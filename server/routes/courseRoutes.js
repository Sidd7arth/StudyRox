const express = require("express");

const router = express.Router();
const path = require("path");
const fs = require("fs");
const { runInContext } = require("vm");
const { searchCourses } = require("../controllers/courseCountroller");

router.get("/search", searchCourses);

router.get("/", (req, res) => {
    try {
        const dataPath = path.join(__dirname, "../data/Courses.json");
        const rawData = fs.readFileSync(dataPath, "utf-8");
        const courses = JSON.parse(rawData);
        res.json(courses);
    } catch (error) {
        console.error("Error reading courses.json:", error);
        res.status(500).json({ message: "Server error fetching courses" });
    }
});



module.exports = router;
