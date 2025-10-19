
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// نقرأ المفتاح من متغير البيئة
const HF_TOKEN = process.env.VISION_TOKEN;
console.log("Hugging Face Token Loaded:", !!HF_TOKEN); // اختبار فقط

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("❌ HuggingFace API Error:", err);
      return res
        .status(400)
        .json({ error: "Hugging Face returned error", details: err });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (e) {
    console.error("⚠️ Server error:", e);
    res.status(500).json({ error: "فشل الاتصال بواجهة Hugging Face" });
  }
});

app.listen(3000, () => {
  console.log("✅ Vision AI Server running on port 3000 (Stable Diffusion XL)");
});
