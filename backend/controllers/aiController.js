export const askAI = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const pythonServiceUrl =
      process.env.PYTHON_SERVICE_URL || "http://localhost:5001";

    const response = await fetch(`${pythonServiceUrl}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.authorization,
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "AI service is unavailable. " + error.message,
    });
  }
};
