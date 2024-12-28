const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
const app = express();
const PORT = process.env.PORT;

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
      "Create an estimated nutritional value for this food item and provide detailed information about its macros, including calories, fat, carbohydrates, and protein.",
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
