import fs, { promises as fsPromises } from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {getSupabaseClient} from "../services/supabase.js";

const validateFile = (file) => {
  const maxSize = 5 * 1024 * 1024 // 5MB
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
  if (!file) {
    throw new Error('No file provided');
  }

  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB limit');
  }

  const fileExtension = path.extname(file.originalname).toLowerCase();
  const allowedMimeTypes = Object.values(mimeTypes);

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only images are allowed');
  }

}


export const analyzeImage = async (req, res) => {
  let imageUrl= null;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Add validation check here
    try {
      validateFile(req.file);
    } catch (validationError) {
      return res.status(400).json({ message: validationError.message });
    }


    const userId = req.user.id;
    const supabase = getSupabaseClient(userId);
    const file= req.file;
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileName = `users/${userId}/${timestamp}${fileExtension}`;

    const { data: uploadData, error: uploadError } = await supabase.storage.from('images').upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

    if (uploadError) {
      return res.status(500).json({ message: uploadError.message });
    }

    const { data: {publicUrl} } = supabase.storage.from('images').getPublicUrl(fileName);
    imageUrl = publicUrl;

    const imageData = file.buffer.toString('base64')

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


    const mimeType = mimeTypes[fileExtension] || "image/jpeg";

    const imagePart = {
      inlineData: {
        data: imageData,
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

    res.json({
      analysis: {
        fullResults: response,
        ingredients: ingredients,
        image: imageUrl
      }

    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
