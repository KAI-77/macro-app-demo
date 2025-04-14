import { GoogleGenerativeAI } from "@google/generative-ai";
import { Request, Response } from "express";
import { RecipeRequest } from "../types/interface";

export const getRecipe = async (req: Request, res: Response) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients) {
      return res.status(400).json({
        msg: "Please provide the ingredients of the recipe",
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Based on these recipe ingredients: ${ingredients} 
        
        Calculate the TOTAL nutritional value for the ENTIRE recipe (not per serving):
        - Total Calories
        - Total Protein (g)
        - Total Carbohydrates (g)
        - Total Fat (g)

        Return EXACTLY in this format with no additional text or symbols:
        Calories: [number]
        Protein: [number] g
        Carbohydrates: [number] g
        Fat: [number] g`;

    const result = await model.generateContent(prompt);
    let recipe = await result.response.text();

    // Enhanced cleaning to ensure correct format
    recipe = recipe
      .replace(/#+\s*/g, "") // Remove hashtags
      .replace(/\*\*/g, "") // Remove bold markdown
      .replace(/\*/g, "") // Remove italic markdown
      .replace(/\n{2,}/g, "\n") // Replace multiple newlines
      // .replace(/^[^C].*\n?/gm, "") // Remove any lines that don't start with C (Calories)
      // .replace(/^[^P].*\n?/gm, "") // Keep only lines starting with P (Protein)
      // .replace(/^[^F].*\n?/gm, "") // Keep only lines starting with F (Fat)
      .replace(/- /g, "") // Remove bullet points
      .replace(/\b(\d+)\s*kcal\b/gi, "$1") // Convert kcal to just number
      .trim();

    // Ensure the format matches exactly what frontend expects
    const lines = recipe.split("\n");
    const formattedRecipe = [];

    for (const line of lines) {
      if (line.toLowerCase().includes("calories")) {
        formattedRecipe.push(
          line.replace(/calories:?\s*(\d+).*/i, "Calories: $1")
        );
      } else if (line.toLowerCase().includes("protein")) {
        formattedRecipe.push(
          line.replace(/protein:?\s*(\d+).*/i, "Protein: $1 g")
        );
      } else if (line.toLowerCase().includes("carbohydrates")) {
        formattedRecipe.push(
          line.replace(/carbohydrates:?\s*(\d+).*/i, "Carbohydrates: $1 g")
        );
      } else if (line.toLowerCase().includes("fat")) {
        formattedRecipe.push(line.replace(/fat:?\s*(\d+).*/i, "Fat: $1 g"));
      }
    }

    const finalRecipe = formattedRecipe.join("\n");

    res.json({ totalMacros: finalRecipe });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({
      message: errorMessage,
    });
  }
};
