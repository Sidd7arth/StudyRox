const axios = require("axios");

const askLLM = async (req, res) => {
  try {
    const { question, persona } = req.body;

    const response = await axios.post(
      "http://localhost:8000/generate",
      { question, persona }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "LLM error" });
  }
};

module.exports = { askLLM };