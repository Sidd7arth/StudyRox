const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    description: String,
    image: String,
  },
  { timestamps: true }
);

// Important for search performance
courseSchema.index({ courseName: "text", description: "text" });

module.exports = mongoose.model("Course", courseSchema);    