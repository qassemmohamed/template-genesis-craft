const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    count: {
      type: Number,
      default: 0,
      required: true,
    },
    uniqueCount: {
      type: Number,
      default: 0,
    },
    ipAddresses: [String],
    referrers: [
      {
        url: String,
        count: Number,
      },
    ],
    pages: [
      {
        path: String,
        count: Number,
      },
    ],
  },
  { timestamps: true }
);

const Visitor = mongoose.model("Visitor", visitorSchema);

module.exports = Visitor;

