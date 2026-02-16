"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Company, Estimate, LineItem } from "@/types/domain";
import { ClientOption } from "./ClientSelector";
import { calculateEstimateTotals, calculateLineItemTotal } from "@/lib/calculations";

// Types
export type BuilderStatus = 'editing' | 'saving' | 'saved' | 'sending' | 'sent' | 'error';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    suggestedActions?: { label: string; action: string }[];
}

interface EstimateContextType {
    company?: Company;
    estimate: Partial<Estimate>;
    selectedClient: ClientOption | null;
    messages: ChatMessage[];
    builderStatus: BuilderStatus;
    isLoadingAI: boolean;

    // Actions
    addMessage: (msg: ChatMessage) => void;
    updateEstimate: (data: Partial<Estimate>) => void;
    addItems: (items: Partial<LineItem>[]) => void;
    removeItem: (index: number) => void;
    setClient: (client: ClientOption | null) => void;
    setLoadingAI: (loading: boolean) => void;
    setBuilderStatus: (status: BuilderStatus) => void;
    getEstimatePayload: () => EstimatePayload | null;
}

/** Payload ready for the server action */
export interface EstimatePayload {
    client_id: string;
    items: { description: string; unit_type: string; quantity: number; rate: number }[];
    tax_rate: number;
    notes: string;
    deposit_type: 'NONE';
    deposit_value: 0;
}

const EstimateContext = createContext<EstimateContextType | undefined>(undefined);

export function EstimateProvider({ children, initialCompany }: { children: ReactNode; initialCompany?: Company }) {
    const [company] = useState<Company | undefined>(initialCompany);
    const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
    const [builderStatus, setBuilderStatus] = useState<BuilderStatus>('editing');
    const [isLoadingAI, setLoadingAI] = useState(false);

    const [estimate, setEstimate] = useState<Partial<Estimate>>({
        items: [],
        subtotal: 0,
        tax_rate: initialCompany?.settings?.tax_rate ?? 0,
        tax_amount: 0,
        total: 0,
        deposit_amount: 0,
        balance_due: 0,
        status: 'DRAFT',
        number: 'EST-New',
        date_issued: new Date().toISOString(),
    });

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'assistant',
            content: `¡Hola! Soy el asistente de ${company?.name || 'ContractorIA'}. Estoy listo para ayudarte a crear tu presupuesto. Cuéntame sobre el proyecto o lista los ítems que ya discutiste con el cliente.`,
            timestamp: new Date()
        }
    ]);

    // Recalculate totals helper
    const recalculate = useCallback((items: LineItem[], taxRate: number) => {
        const totals = calculateEstimateTotals(items, taxRate);
        return {
            subtotal: totals.subtotal,
            tax_amount: totals.taxAmount,
            total: totals.total,
            balance_due: totals.total,
        };
    }, []);

    const addMessage = useCallback((msg: ChatMessage) => {
        setMessages(prev => [...prev, msg]);
    }, []);

    const updateEstimate = useCallback((data: Partial<Estimate>) => {
        setEstimate(prev => {
            const merged = { ...prev, ...data };
            // Recalculate if items changed
            if (data.items) {
                const totals = recalculate(data.items as LineItem[], merged.tax_rate ?? 0);
                return { ...merged, ...totals };
            }
            return merged;
        });
    }, [recalculate]);

    /** Add new line items (typically from AI) and auto-recalculate */
    const addItems = useCallback((newItems: Partial<LineItem>[]) => {
        setEstimate(prev => {
            const currentItems = prev.items || [];
            const processed: LineItem[] = newItems.map((item, idx) => {
                const unitType = (item.unit_type || 'unit') as LineItem['unit_type'];
                const qty = item.quantity ?? 1;
                const rate = item.rate ?? 0;
                return {
                    id: `ai-${Date.now()}-${idx}`,
                    description: item.description || 'Item',
                    unit_type: unitType,
                    quantity: qty,
                    rate,
                    total: calculateLineItemTotal(qty, rate, unitType),
                };
            });
            const allItems = [...currentItems, ...processed] as LineItem[];
            const totals = recalculate(allItems, prev.tax_rate ?? 0);
            return { ...prev, items: allItems, ...totals };
        });
    }, [recalculate]);

    /** Remove item by index */
    const removeItem = useCallback((index: number) => {
        setEstimate(prev => {
            const items = [...(prev.items || [])];
            items.splice(index, 1);
            const totals = recalculate(items as LineItem[], prev.tax_rate ?? 0);
            return { ...prev, items, ...totals };
        });
    }, [recalculate]);

    const setClient = useCallback((client: ClientOption | null) => {
        setSelectedClient(client);
        setEstimate(prev => ({ ...prev, client_id: client?.id || '' }));
    }, []);

    /** Build the payload expected by createEstimateAction */
    const getEstimatePayload = useCallback((): EstimatePayload | null => {
        if (!selectedClient) return null;
        const items = (estimate.items || []).map(item => ({
            description: item.description,
            unit_type: item.unit_type,
            quantity: item.quantity,
            rate: item.rate,
        }));
        if (items.length === 0) return null;

        return {
            client_id: selectedClient.id,
            items,
            tax_rate: estimate.tax_rate ?? 0,
            notes: estimate.notes || '',
            deposit_type: 'NONE',
            deposit_value: 0,
        };
    }, [selectedClient, estimate]);

    return (
        <EstimateContext.Provider value={{
            company,
            estimate,
            selectedClient,
            messages,
            builderStatus,
            isLoadingAI,
            addMessage,
            updateEstimate,
            addItems,
            removeItem,
            setClient,
            setLoadingAI,
            setBuilderStatus,
            getEstimatePayload,
        }}>
            {children}
        </EstimateContext.Provider>
    );
}

export const useEstimate = () => {
    const context = useContext(EstimateContext);
    if (!context) throw new Error("useEstimate must be used within EstimateProvider");
    return context;
};
