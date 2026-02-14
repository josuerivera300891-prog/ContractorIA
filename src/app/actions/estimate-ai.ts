"use server";

import { createClient } from "@/utils/supabase/server";

export interface EstimateAIResponse {
    role: 'assistant';
    content: string;
    suggestedItems?: unknown[]; // Structured items extracted
    updatedEstimate?: unknown; // Full estimate object if updated
}

export async function processEstimateAICommand(message: string, currentContext: unknown): Promise<EstimateAIResponse> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Auth Check
    if (!user) {
        return {
            role: 'assistant',
            content: "Error: No autorizado. Por favor recarga la página."
        };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 2. Fallback if no Key
    if (!apiKey) {
        console.warn("GEMINI_API_KEY no configurada. Usando modo simulación.");
        return simulateEstimateAI(message, currentContext);
    }

    try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" } // Force JSON
        });

        // 3. Prompt Engineering
        const systemPrompt = `
            Eres un experto estimador de construcción para ContractorIA.
            Tu objetivo es extraer ítems, cantidades y precios del mensaje del usuario para construir un presupuesto JSON.
            
            Contexto Actual del Presupuesto (JSON):
            ${JSON.stringify(currentContext)}

            Instrucciones:
            1. Analiza el mensaje del usuario buscando materiales, mano de obra y servicios.
            2. Si menciona items nuevos, agrégalos a la lista.
            3. Si pide cambios (ej. "el precio es muy alto"), ajusta los valores existentes.
            4. Si el usuario no da precio, ESTIMA un precio de mercado realista para USA/México según el idioma.
            5. Responde SIEMPRE en este formato JSON exacto:
            {
                "conversational_response": "Texto amable explicando qué hiciste...",
                "items_to_add": [ { "description": "...", "quantity": 0, "rate": 0, "unit_type": "unit" } ],
                "items_to_update": [], // Si aplica
                "items_to_remove": [] // Si aplica
            }
        `;

        const result = await model.generateContent([systemPrompt, message]);
        const responseText = result.response.text();
        const parsedResponse = JSON.parse(responseText);

        return {
            role: 'assistant',
            content: parsedResponse.conversational_response,
            suggestedItems: parsedResponse.items_to_add
        };

    } catch (error) {
        console.error("Gemini Error:", error);
        return {
            role: 'assistant',
            content: "Lo siento, tuve un problema conectando con mi cerebro neural. ¿Podrías repetir eso?"
        };
    }
}

function simulateEstimateAI(message: string, context: unknown): EstimateAIResponse {
    // Simple Keyword matching for simulation
    const msg = message.toLowerCase();

    if (msg.includes("cocina") || msg.includes("kitchen")) {
        return {
            role: 'assistant',
            content: "Entendido. He agregado partidas típicas para una renovación de cocina.",
            suggestedItems: [
                { description: "Demolición de gabinetes existentes", quantity: 1, rate: 800, unit_type: 'project' },
                { description: "Instalación de gabinetes nuevos", quantity: 15, rate: 120, unit_type: 'unit' },
                { description: "Encimera de Granito", quantity: 45, rate: 95, unit_type: 'sqft' }
            ]
        };
    }

    return {
        role: 'assistant',
        content: "He recibido tu mensaje. Como estoy en modo demo (sin API Key), no puedo generar items reales, pero imagina que aquí aparecerían."
    };
}
