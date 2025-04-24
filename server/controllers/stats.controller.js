const Visitor = require("../models/visitor.model.js");
const Contact = require("../models/contact.model.js");
const Service = require("../models/service.model.js");
const User = require("../models/user.model.js");

// Get website statistics
const getWebsiteStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const visitorStats = await Visitor.aggregate([
      {
        $match: {
          date: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          totalVisits: { $sum: "$count" },
          uniqueVisits: { $sum: "$uniqueCount" },
          todayVisits: {
            $sum: {
              $cond: [{ $gte: ["$date", today] }, "$count", 0],
            },
          },
        },
      },
    ]);

    const contactStats = await Contact.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: {
            $sum: {
              $cond: [{ $eq: ["$status", "new"] }, 1, 0],
            },
          },
          replied: {
            $sum: {
              $cond: [{ $eq: ["$status", "replied"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const serviceCount = await Service.countDocuments({ active: true });
    const userCount = await User.countDocuments({ isActive: true });

    const stats = {
      visitors: {
        total: visitorStats.length > 0 ? visitorStats[0].totalVisits : 0,
        unique: visitorStats.length > 0 ? visitorStats[0].uniqueVisits : 0,
        today: visitorStats.length > 0 ? visitorStats[0].todayVisits : 0,
      },
      contacts: {
        total: contactStats.length > 0 ? contactStats[0].total : 0,
        new: contactStats.length > 0 ? contactStats[0].new : 0,
        replied: contactStats.length > 0 ? contactStats[0].replied : 0,
      },
      services: serviceCount,
      users: userCount,
      system: {
        status: "active",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
      },
    };

    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
};

// Record visitor
const recordVisitor = async (req, res, next) => {
  try {
    const { page, referrer } = req.body;
    const ipAddress = req.ip;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let visitorRecord = await Visitor.findOne({ date: today });

    if (!visitorRecord) {
      visitorRecord = new Visitor({
        date: today,
        count: 0,
        uniqueCount: 0,
        ipAddresses: [],
        referrers: [],
        pages: [],
      });
    }

    visitorRecord.count += 1;

    if (!visitorRecord.ipAddresses.includes(ipAddress)) {
      visitorRecord.ipAddresses.push(ipAddress);
      visitorRecord.uniqueCount += 1;
    }

    if (referrer) {
      const existingReferrer = visitorRecord.referrers.find(
        (r) => r.url === referrer
      );
      if (existingReferrer) {
        existingReferrer.count += 1;
      } else {
        visitorRecord.referrers.push({ url: referrer, count: 1 });
      }
    }

    if (page) {
      const existingPage = visitorRecord.pages.find((p) => p.path === page);
      if (existingPage) {
        existingPage.count += 1;
      } else {
        visitorRecord.pages.push({ path: page, count: 1 });
      }
    }

    await visitorRecord.save();

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// Get visitor statistics
const getVisitorStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const parsedStartDate = startDate
      ? new Date(startDate)
      : new Date(new Date().setDate(new Date().getDate() - 30));
    const parsedEndDate = endDate ? new Date(endDate) : new Date();

    parsedEndDate.setHours(23, 59, 59, 999);

    const visitorData = await Visitor.find({
      date: {
        $gte: parsedStartDate,
        $lte: parsedEndDate,
      },
    }).sort({ date: 1 });

    const dailyData = visitorData.map((record) => ({
      date: record.date,
      visits: record.count,
      uniqueVisits: record.uniqueCount,
    }));

    const topPages = visitorData
      .reduce((acc, record) => {
        record.pages.forEach((page) => {
          const existingPage = acc.find((p) => p.path === page.path);
          if (existingPage) {
            existingPage.count += page.count;
          } else {
            acc.push({ path: page.path, count: page.count });
          }
        });
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topReferrers = visitorData
      .reduce((acc, record) => {
        record.referrers.forEach((referrer) => {
          const existingReferrer = acc.find((r) => r.url === referrer.url);
          if (existingReferrer) {
            existingReferrer.count += referrer.count;
          } else {
            acc.push({ url: referrer.url, count: referrer.count });
          }
        });
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.status(200).json({
      dailyData,
      topPages,
      topReferrers,
      summary: {
        totalVisits: dailyData.reduce((sum, day) => sum + day.visits, 0),
        totalUniqueVisits: dailyData.reduce(
          (sum, day) => sum + day.uniqueVisits,
          0
        ),
        averageDailyVisits:
          dailyData.length > 0
            ? Math.round(
                dailyData.reduce((sum, day) => sum + day.visits, 0) /
                  dailyData.length
              )
            : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWebsiteStats,
  recordVisitor,
  getVisitorStats,
};
