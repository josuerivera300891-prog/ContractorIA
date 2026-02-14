"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function processMaterialListOCR(base64Image: string) {
    if (!process.env.GEMINI_API_KEY) {
        return { success: false, error: "GEMINI_API_KEY is missing in environment variables." };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Eres un experto en construcción y gestión de materiales. 
            Analiza esta imagen que contiene una lista de materiales o un plano de construcción.
            
            Extrae los ítems y devuélvelos ESTRICTAMENTE en formato JSON como un array de objetos con esta estructura:
            [
                { "description": "Nombre del material/item", "quantity": número, "unit_price": 0 }
            ]

            Instrucciones:
            1. Si no puedes leer una cantidad, asume 1.
            2. La descripción debe ser clara y profesional.
            3. No incluyas texto fuera del JSON.
            4. Si la imagen no contiene materiales, devuelve un array vacío [].
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean the response (sometimes AI adds markdown blocks)
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        const jsonStr = jsonMatch ? jsonMatch[0] : "[]";
        const items = JSON.parse(jsonStr);

        return { success: true, items };
    } catch (error: any) {
        console.error("OCR Processing Error:", error);
        return { success: false, error: error.message || "Error processing image with AI" };
    }
}
