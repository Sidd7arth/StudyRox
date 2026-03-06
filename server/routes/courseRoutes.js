const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Helper: load & parse Courses.json
const loadCourses = () => {
  const dataPath = path.join(__dirname, "../data/Courses.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(rawData);
};

// GET /api/courses  — supports keyword search, category filter, and pagination
router.get("/", (req, res) => {
  try {
    const {
      keyword = "",
      category = "",
      page = 1,
      limit = 8,
    } = req.query;

    let courses = loadCourses();

    //  Keyword search: matches courseName, category, or description (case-insensitive)
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      courses = courses.filter(
        (c) =>
          c.courseName?.toLowerCase().includes(kw) ||
          c.category?.toLowerCase().includes(kw) ||
          c.description?.toLowerCase().includes(kw)
      );
    }

    //  Exact category filter (optional, for future use)
    if (category.trim()) {
      courses = courses.filter(
        (c) => c.category?.toLowerCase() === category.trim().toLowerCase()
      );
    }

    const total = courses.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const totalPages = Math.ceil(total / limitNum) || 1;

    //  Pagination
    const paginated = courses.slice(
      (pageNum - 1) * limitNum,
      pageNum * limitNum
    );

    res.json({
      courses: paginated,
      total,
      page: pageNum,
      totalPages,
    });
  } catch (error) {
    console.error("Error reading courses:", error);
    res.status(500).json({ message: "Server error fetching courses" });
  }
});

module.exports = router;
