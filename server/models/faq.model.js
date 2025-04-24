const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
      unique: true, // جعل السؤال فريدًا لتفادي التكرار
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// إضافة hook قبل الحفظ لضمان ترتيب العناصر بشكل صحيح
faqSchema.pre("save", async function (next) {
  // إذا كان المستند جديدًا ولم يتم تحديد order
  if (this.isNew && this.order === 0) {
    try {
      const lastFaq = await this.constructor.findOne(
        {},
        {},
        { sort: { order: -1 } }
      );
      this.order = lastFaq ? lastFaq.order + 1 : 1;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const FAQ = mongoose.model("FAQ", faqSchema);

module.exports = FAQ;
