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
      ".bmp": "image/bmp",
      ".tiff": "image/tiff",
      ".tif": "image/tiff",
      ".svg": "image/svg+xml",
      ".JFIF": "image/jfif",
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
      "Assume this is a dish submitted by a user. \n" +
      "  - Generate a complete recipe based on the dish in the image. \n" +
      "  - Identify the most likely ingredients and their approximate measurements.\n" +
      "  - Provide a detailed, numbered step-by-step guide on how to prepare the dish.\n" +
      "  - Format instructions properly like:\n" +
      "    1. Step one  \n" +
      "    2. Step two  \n" +
      "    3. Step three  \n" +
      "  - Do NOT mention image limitations. Just assume and generate the best possible recipe.",
      imagePart,
    ]);
    console.log(result);

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
