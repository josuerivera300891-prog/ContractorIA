"use client";

import { Company, Estimate, LineItem } from "@/types/domain";

interface EstimateContextType {
    company?: Company;
    estimate: Partial<Estimate>;
    messages: ChatMessage[];
    addMessage: (msg: ChatMessage) => void;
    updateEstimate: (data: Partial<Estimate>) => void;
    isLoadingAI: boolean;
    setLoadingAI: (loading: boolean) => void;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    suggestedActions?: { label: string; action: string }[];
}

const EstimateContext = createContext<EstimateContextType | undefined>(undefined);

export function EstimateProvider({ children, initialCompany }: { children: ReactNode, initialCompany?: Company }) {
    const [company] = useState<Company | undefined>(initialCompany);
    const [estimate, setEstimate] = useState<Partial<Estimate>>({
        items: [],
        subtotal: 0,
        tax_amount: 0,
        total: 0,
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

    const [isLoadingAI, setLoadingAI] = useState(false);

    const addMessage = (msg: ChatMessage) => {
        setMessages(prev => [...prev, msg]);
    };

    const updateEstimate = (data: Partial<Estimate>) => {
        setEstimate(prev => ({ ...prev, ...data }));
    };

    return (
        <EstimateContext.Provider value={{ company, estimate, messages, addMessage, updateEstimate, isLoadingAI, setLoadingAI }}>
            {children}
        </EstimateContext.Provider>
    );
}

export const useEstimate = () => {
    const context = useContext(EstimateContext);
    if (!context) throw new Error("useEstimate must be used within EstimateProvider");
    return context;
};
