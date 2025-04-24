const Content = require("../models/content.model.js");
const { createError } = require("../utils/error.util.js");
const { validateContent } = require("../validators/content.validator.js");

// Get all content items
const getAllContent = async (req, res, next) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};

    const content = await Content.find(query).sort({ updatedAt: -1 });
    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

// Get content by key
const getContentByKey = async (req, res, next) => {
  try {
    const content = await Content.findOne({ key: req.params.key }); 
    if (!content) {
      return next(createError(404, "Content not found"));
    }
    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

// Create new content
const createContent = async (req, res, next) => {
  try {
    const { error } = validateContent(req.body);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const { key, title, content, type, languages } = req.body;

    // Check if content with this key already exists
    const existingContent = await Content.findOne({ key });
    if (existingContent) {
      return next(createError(400, "Content with this key already exists"));
    }

    const newContent = new Content({
      key,
      title,
      content,
      type: type || "section",
      languages: languages || {},
      lastUpdatedBy: req.user.id,
    });

    await newContent.save();
    res.status(201).json(newContent);
  } catch (error) {
    next(error);
  }
};

// Update content
const updateContent = async (req, res, next) => {
  try {
    const { error } = validateContent(req.body, true);
    if (error) {
      return next(createError(400, error.details[0].message));
    }

    const { title, content, type, languages } = req.body;
    const { key } = req.params;

    const contentItem = await Content.findOne({ key });
    if (!contentItem) {
      return next(createError(404, "Content not found"));
    }

    // Update fields if provided
    if (title) contentItem.title = title;
    if (content) contentItem.content = content;
    if (type) contentItem.type = type;
    if (languages) contentItem.languages = languages;

    // Update the lastUpdatedBy field
    contentItem.lastUpdatedBy = req.user.id;

    await contentItem.save();
    res.status(200).json(contentItem);
  } catch (error) {
    next(error);
  }
};

// Delete content
const deleteContent = async (req, res, next) => {
  try {
    const content = await Content.findOne({ key: req.params.key });
    if (!content) {
      return next(createError(404, "Content not found"));
    }

    await content.deleteOne();
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get about page content
const getAboutContent = async (req, res, next) => {
  try {
    const aboutContent = await Content.findOne({ key: "about-page" });

    // If about content doesn't exist, create default content
    if (!aboutContent) {
      const defaultContent = {
        key: "about-page",
        title: "About Page",
        content: {
          en: {
            title: "About the Proprietor",
            description1:
              "Mahmoud Samaoui is a certified tax preparer and professional translator, serving individuals and small enterprises in Philadelphia. As an esteemed member of the American Translators Association, Mahmoud offers expert translation services in English, Arabic, and French.",
            description2:
              "He is dedicated to providing personalized service in areas such as tax preparation, bookkeeping, and immigration support. Mahmoud endeavors to simplify complex processes and deliver reliable solutions tailored to each client's unique requirements.",
          },
          ar: {
            title: "عن صاحب العمل",
            description1:
              "محمود سماوي هو معد ضرائب معتمد ومترجم محترف، يخدم الأفراد والشركات الصغيرة في فيلادلفيا. كعضو موقر في جمعية المترجمين الأمريكية، يقدم محمود خدمات الترجمة الاحترافية بالإنجليزية والعربية والفرنسية.",
            description2:
              "يكرس نفسه لتقديم خدمات مخصصة في مجالات مثل إعداد الضرائب، المحاسبة، ودعم الهجرة. يسعى محمود لتبسيط العمليات المعقدة وتقديم حلول موثوقة مخصصة لاحتياجات كل عميل.",
          },
          fr: {
            title: "À propos du propriétaire",
            description1:
              "Mahmoud Samaoui est un préparateur fiscal certifié et traducteur professionnel, au service des particuliers et des petites entreprises à Philadelphie. En tant que membre estimé de l'American Translators Association, Mahmoud offre des services de traduction experts en anglais, arabe et français.",
            description2:
              "Il se consacre à fournir un service personnalisé dans des domaines tels que la préparation fiscale, la comptabilité et le soutien à l'immigration. Mahmoud s'efforce de simplifier les processus complexes et de fournir des solutions fiables adaptées aux besoins uniques de chaque client.",
          },
        },
        type: "page",
        lastUpdatedBy: req.user ? req.user.id : null,
      };

      const newAboutContent = new Content(defaultContent);
      await newAboutContent.save();

      return res.status(200).json(newAboutContent);
    }

    res.status(200).json(aboutContent);
  } catch (error) {
    next(error);
  }
};

// Update about page content
const updateAboutContent = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return next(createError(400, "Content is required"));
    }

    let aboutContent = await Content.findOne({ key: "about-page" });

    // If about content doesn't exist, create it
    if (!aboutContent) {
      aboutContent = new Content({
        key: "about-page",
        title: "About Page",
        content: content,
        type: "page",
        lastUpdatedBy: req.user.id,
      });
    } else {
      // Update existing content
      aboutContent.content = content;
      aboutContent.lastUpdatedBy = req.user.id;
    }

    await aboutContent.save();

    // Update the language files if needed
    // This would be implemented if you want to sync with i18n files

    res.status(200).json(aboutContent);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContent,
  getContentByKey,
  createContent,
  updateContent,
  deleteContent,
  getAboutContent,
  updateAboutContent,
};
