import fs, { promises as fsPromises } from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imagePath = req.file.path;
    const imageData = await fsPromises.readFile(imagePath, {
      encoding: "base64",
    });

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
      "Analyze the food in this image and provide a straightforward estimate of its nutritional information...",
      imagePart,
    ]);

    const macroInfo = await result.response.text();
    await fsPromises.unlink(imagePath); // Cleanup file

    res.json({
      results: macroInfo,
      image: `data:${mimeType};base64, ${imageData.toString("base64")}`,
    });
  } catch (error) {
    await fsPromises.unlink(imagePath); // Cleanup in case of error
    res.status(500).json({ message: error.message });
  }
};
