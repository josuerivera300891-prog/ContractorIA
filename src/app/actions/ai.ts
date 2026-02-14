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

    const lowerMsg = message.toLowerCase()

    // --- GUIDED FLOW LOGIC (Pattern Matching) ---

    // 1. Create Estimate Initiation
    if (lowerMsg.includes('crear presupuesto') || lowerMsg.includes('nuevo presupuesto')) {
        return {
            role: 'ai',
            content: `¡Perfecto! Vamos a crear un nuevo presupuesto para **${company.name}**. \n\n¿Para qué cliente es? Estos son tus últimos clientes activos:\n- **Juan Pérez** (jperez@email.com)\n- **María García** (mgarcia@email.com)\n\n¿O prefieres registrar uno nuevo?`
        }
    }

    // 2. Client Selection (Mocking a match)
    if (lowerMsg.includes('juan') || lowerMsg.includes('perez')) {
        return {
            role: 'ai',
            content: 'Excelente, trabajaré el presupuesto para **Juan Pérez**. \n\nAhora, dime el concepto. Por ejemplo: *"Pintura de fachada"* o *"Instalación eléctrica"*. '
        }
    }

    // 3. Concept and Pricing Guidance
    if (lowerMsg.includes('pintura') || lowerMsg.includes('fachada') || lowerMsg.includes('instalacion')) {
        return {
            role: 'ai',
            content: `Concepto registrado: **"${message}"**. \n\nPara calcular el total con precisión de 2 decimales (estándar ContractorIA), ¿qué cantidad y precio unitario aplicamos? \n\n*(Ejemplo: 50 sqft a $10.50)*`
        }
    }

    // 4. Calculations Confirmation
    if (lowerMsg.match(/\d+/) && (lowerMsg.includes('$') || lowerMsg.includes('precio'))) {
        // Mock extraction
        return {
            role: 'ai',
            content: 'He calculado los totales siguiendo la regla determinista: \n\n- **Subtotal**: $525.00\n- **Tax (8%)**: $42.00\n- **Total**: **$567.00**\n\n¿Deseas que genere este presupuesto como borrador (DRAFT) ahora mismo?'
        }
    }

    // 5. Final Confirmation (DRAFT CREATION)
    if (lowerMsg.includes('si') || lowerMsg.includes('generar') || lowerMsg.includes('crear')) {
        // In a real scenario, we would call createEstimateAction here with the collected data
        return {
            role: 'ai',
            content: '¡Listo! He creado el presupuesto **EST-992** en estado **DRAFT**. \n\nPuedes verlo ahora en tu panel de presupuestos. ¿Necesitas algo más?'
        }
    }

    // Help
    if (lowerMsg.includes('ayuda') || lowerMsg.includes('help')) {
        return {
            role: 'ai',
            content: 'Puedo guiarte paso a paso para:\n- **Crear presupuestos** bilingües.\n- **Registrar clientes** con dirección y notas.\n- **Gestionar revisiones** N+1.\n\nPrueba diciendo: "Crear un nuevo presupuesto".'
        }
    }

    // Default Fallback
    return {
        role: 'ai',
        content: 'Entiendo. Como tu asistente de ContractorIA, estoy aquí para agilizar tu flujo de trabajo. ¿Quieres que empecemos con un nuevo presupuesto o prefieres ver tus clientes?'
    }
}
