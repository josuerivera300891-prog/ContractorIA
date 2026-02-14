'use server'

import { createClient } from '@/utils/supabase/server'
import { createEstimateAction } from './estimates'

/**
 * Advanced AI Engine for ContractorIA.
 * Simulates a guided conversation flow for estimate creation.
 */
export async function processAIChatCommand(message: string, tenant: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { role: 'ai', content: 'Debes iniciar sesión para que pueda ayudarte.' }

    // Fetch company info
    const { data: company } = await supabase
        .from('companies')
        .select('id, name, settings')
        .eq('slug', tenant)
        .single()

    if (!company) return { role: 'ai', content: 'Lo siento, no puedo identificar tu empresa.' }

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback Mock Logic (preserved for robustness or if key is missing)
    const runMockLogic = (msg: string) => {
        const lowerMsg = msg.toLowerCase()
        if (lowerMsg.includes('crear presupuesto') || lowerMsg.includes('nuevo presupuesto')) {
            return `¡Perfecto! Vamos a crear un nuevo presupuesto para **${company.name}**. \n\n¿Para qué cliente es?`;
        }
        if (lowerMsg.includes('ayuda') || lowerMsg.includes('help')) {
            return 'Puedo guiarte paso a paso para:\n- **Crear presupuestos** bilingües.\n- **Registrar clientes** con dirección y notas.\n- **Gestionar revisiones** N+1.\n\nPrueba diciendo: "Crear un nuevo presupuesto".';
        }
        return null;
    };

    if (!apiKey) {
        console.warn("GEMINI_API_KEY is not set. Using fallback logic.");
        const mockResponse = runMockLogic(message);
        if (mockResponse) return { role: 'ai', content: mockResponse };
        return {
            role: 'ai',
            content: '⚠️ **Modo Demo**: La IA no está activada en este entorno (Falta API Key). \n\nSin embargo, puedo simular acciones básicas. Prueba escribir "Crear presupuesto" o "Ayuda".'
        };
    }

    try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are ContractorIA, an advanced AI assistant for construction contractors.
            Current Company: "${company.name}".
            User: "${user.user_metadata.full_name || 'User'}".
            
            Your goal is to help managing the business (estimates, invoices, clients).
            
            User message: "${message}"
            
            Respond in Spanish (Latin American), professional but friendly. Use Markdown for formatting (bold, lists).
            If the user wants to create an estimate, guide them or ask for details.
            Keep it concise.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        return { role: 'ai', content: text };

    } catch (error) {
        console.error("Gemini API Error:", error);
        // Fallback to mock if API fails
        const mockResponse = runMockLogic(message);
        if (mockResponse) return { role: 'ai', content: mockResponse };

        return {
            role: 'ai',
            content: "Lo siento, tuve un problema conectando con mi cerebro digital (Gemini API). Por favor intenta más tarde."
        };
    }
}
