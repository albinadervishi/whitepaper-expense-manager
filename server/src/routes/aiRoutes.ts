import express from "express";
import { aiService } from "../services/aiService";

const router = express.Router();

router.post("/suggest-category", async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        error: "Description is required",
      });
    }

    const suggestion = await aiService.suggestCategory(description);

    res.json({
      success: true,
      data: suggestion,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
