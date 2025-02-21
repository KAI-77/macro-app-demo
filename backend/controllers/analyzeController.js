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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
      `Assume this is a dish submitted by a user, Analyze this recipe image and provide:
        1. List all ingredients with their exact quantities (be specific with measurements)
        2. Step by step cooking procedure

      Format the response as:
      INGREDIENTS:
      - (list each ingredient with quantity)

      PROCEDURE:
        1. (list each step)
      Do NOT mention image limitations. Just assume and generate the best possible recipe.`,
      imagePart,
    ]);

    // Process ingredients separately
    const response = await result.response.text();

    const sections = response.split("PROCEDURE:");
    const ingredientSection = sections[0].replace("INGREDIENTS:", '').trim();

    const ingredients = ingredientSection.split('\n').map(item => item.trim().replace(/^-\s*/, ''
    )).filter(item => item.length > 0);





    const macroInfo = await result.response.text();
    await fsPromises.unlink(imagePath); // Cleanup file

    res.json({
      analysis: {
        fullResults: response,
        ingredients: ingredients,
        image: `data:${mimeType};base64, ${imageData.toString("base64")}`
      }

    });
  } catch (error) {
    await fsPromises.unlink(imagePath); // Cleanup in case of error
    res.status(500).json({ message: error.message });
  }
};
