"use client";

import { useEstimate } from "./EstimateContext";
import { ClientSelector, ClientOption } from "./ClientSelector";
import { Send, Bot, User, Mic, Paperclip, Image as ImageIcon, History, UserCheck } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { processEstimateAICommand } from "@/app/actions/estimate-ai";
import { LineItem } from "@/types/domain";

export function EstimateChatBuilder() {
    const {
        messages, addMessage, addItems, estimate,
        isLoadingAI, setLoadingAI,
        company, selectedClient, setClient
    } = useEstimate();

    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput("");

        // 1. Add User Message
        addMessage({
            id: Date.now().toString(),
            role: 'user',
            content: userMsg,
            timestamp: new Date()
        });

        // 2. Call AI Action
        setLoadingAI(true);

        try {
            const context = {
                currentItems: estimate.items || []
            };

            // Pass companyId for multi-tenant security validation
            const companyId = company?.id || '';
            const response = await processEstimateAICommand(userMsg, context, companyId);

            if (response) {
                addMessage({
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: response.content,
                    timestamp: new Date()
                });

                // Use addItems from context — handles recalculation automatically
                if (response.suggestedItems && response.suggestedItems.length > 0) {
                    addItems(response.suggestedItems as Partial<LineItem>[]);
                }
            }
        } catch (error) {
            console.error("Error calling AI:", error);
            addMessage({
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Lo siento, hubo un problema al procesar tu solicitud. Por favor intenta de nuevo.",
                timestamp: new Date()
            });
        } finally {
            setLoadingAI(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    const handleClientSelect = (client: ClientOption | null) => {
        setClient(client);

        if (client) {
            addMessage({
                id: `client-${Date.now()}`,
                role: 'assistant',
                content: `✅ Cliente asignado: **${client.first_name} ${client.last_name}**${client.company_name ? ` (${client.company_name})` : ''}. El presupuesto será enviado a ${client.email}. ¿Continuamos con los ítems?`,
                timestamp: new Date()
            });
        }
    };

    return (
        <aside className="w-[420px] flex flex-col border-r border-slate-200 bg-slate-50 relative z-20 shadow-xl shadow-slate-200/50">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-turq-primary/10 p-2 rounded-lg text-turq-primary">
                        <Bot size={20} />
                    </div>
                    <h2 className="font-[800] text-deep-blue text-sm uppercase tracking-wide">AI Project Assistant</h2>
                </div>
                <button className="text-slate-400 hover:text-turq-primary transition-colors">
                    <History size={20} />
                </button>
            </div>

            {/* Client Selector Section */}
            <div className="px-5 pt-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-2">
                    <UserCheck size={14} className="text-turq-primary" />
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Cliente</span>
                </div>
                {company?.id && (
                    <ClientSelector
                        companyId={company.id}
                        selectedClientId={selectedClient?.id}
                        onSelect={handleClientSelect}
                    />
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border 
                            ${msg.role === 'user'
                                ? 'bg-white border-slate-200 text-slate-400'
                                : 'bg-turq-primary/10 border-turq-primary/20 text-turq-primary'
                            }`}>
                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>

                        <div className={`space-y-1 max-w-[85%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                                ${msg.role === 'user'
                                    ? 'bg-deep-blue text-white rounded-tr-none'
                                    : 'bg-white text-slate-600 border border-slate-100 rounded-tl-none'
                                }`}>
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block px-1">
                                {msg.role === 'assistant' ? 'AI Assistant' : 'You'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}

                {isLoadingAI && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-turq-primary/10 flex items-center justify-center shrink-0 border border-turq-primary/20">
                            <Bot size={14} className="text-turq-primary" />
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex gap-1 items-center h-10">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-white border-t border-slate-200">
                <div className="relative flex items-end gap-2 bg-slate-50 rounded-2xl p-2 border border-slate-200 focus-within:border-turq-primary/50 focus-within:ring-4 focus-within:ring-turq-primary/5 transition-all">
                    <button className="p-3 text-slate-400 hover:text-turq-primary hover:bg-turq-primary/5 rounded-xl transition-all">
                        <Mic size={20} />
                    </button>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 max-h-32 resize-none text-slate-700 font-medium placeholder:text-slate-400 focus:outline-none"
                        placeholder="Describe el proyecto o dicta los ítems..."
                        rows={1}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoadingAI}
                        className="p-3 bg-deep-blue text-white rounded-xl shadow-lg shadow-deep-blue/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="flex justify-between items-center mt-3 px-2">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Powered by Neural Gemini 1.5</span>
                    <div className="flex gap-2">
                        <button className="text-slate-400 hover:text-deep-blue transition-colors p-1"><Paperclip size={16} /></button>
                        <button className="text-slate-400 hover:text-deep-blue transition-colors p-1"><ImageIcon size={16} /></button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
