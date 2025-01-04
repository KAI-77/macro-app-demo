import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import fs, { promises as fsPromises } from "fs";
import path from "path";
import cors from "cors";

import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
// Configure multer to save files to the uploads folder
const upload = multer({ dest: "uploads/" });
app.use(express.json({ limit: "25mb" }));

// Initialize the GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
app.use(express.static("public"));

app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log(req.file);
    const imagePath = req.file.path;
    const imageData = await fsPromises.readFile(imagePath, {
      encoding: "base64",
    });
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
    };

    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    const mimeType = mimeTypes[fileExtension] || "image/jpeg";

    const imagePart = {
      inlineData: {
        data: imageData.toString("base64"),
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([
      "Analyze the food in this image and provide a straightforward estimate of its nutritional information. Include only the total calories, macronutrient breakdown (carbohydrates, proteins, and fats), and notable nutrients. Assume standard serving sizes where necessary and avoid lengthy explanations or justifications. Avoid using special characters like asterisks, and present the data in plain text.",
      imagePart,
    ]);
    const response = await result.response;
    const macroInfo = response.text();

    await fsPromises.unlink(imagePath);
    res.json({
      results: macroInfo,
      image: `data:${mimeType};base64, ${imageData.toString("base64")}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
