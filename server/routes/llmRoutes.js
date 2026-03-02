const express = require("express");
const { askLLM } = require("../controllers/llmController");

const router = express.Router();

router.post("/ask-llm", askLLM);

module.exports = router;