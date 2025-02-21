
import {GoogleGenerativeAI} from "@google/generative-ai";

export const getRecipe = async (req, res) => {
    try {
        const { foodName } = req.body;

        if (!foodName) {
            return res.status(400).json({
                msg: "Please provide a food name"
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Analyze the food in this image and provide a straightforward estimate of its nutritional information..."

        const result = await model.generateContent([prompt]);
        let recipe = await result.response.text();

        recipe = recipe
            .replace(/#+\s*/g, "") // Remove hashtags (##, ###)
            .replace(/\*\*/g, "") // Remove double asterisks (**bold**)
            .replace(/\*/g, "") // Remove single asterisks (*italic*)
            .replace(/\n{2,}/g, "\n") // Replace multiple newlines with a single newline
            .trim(); // Trim whitespace


        res.json({foodName, recipe});

    } catch (error) {
        res.status(500).json({
            message: error.message
        })

    }
}