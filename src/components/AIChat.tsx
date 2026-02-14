"use client";

import { useState, useRef, useEffect } from "react";
import {
    Send,
    Bot,
    User,
    Sparkles,
    X,
    Maximize2,
    Minimize2,
    Trash2,
    Brain,
    Loader2
} from "lucide-react";
import { processAIChatCommand } from "@/app/actions/ai";

interface Message {
    role: 'ai' | 'user' | 'system';
    content: string;
    timestamp: Date;
}

export function AIChat({ tenant }: { tenant: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'ai',
            content: "¡Hola! Soy tu asistente de ContractorIA. Puedo ayudarte a crear presupuestos, gestionar clientes o analizar tus proyectos. ¿En qué trabajamos hoy?",
            timestamp: new Date()
        }
    ]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await processAIChatCommand(input, tenant);
            const aiResponse: Message = {
                role: 'ai',
                content: response.content,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "Lo siento, hubo un error procesando tu solicitud. Por favor intenta de nuevo.",
                timestamp: new Date()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-turq-primary text-white rounded-2xl shadow-2xl shadow-turq-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 z-50 group overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rotate-45 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <Brain size={28} className="relative z-10" />
            </button>
        );
    }

    return (
        <div className={`
      fixed bottom-8 right-8 z-50 flex flex-col bg-white/80 backdrop-blur-2xl border border-turq-primary/10 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 ease-out
      ${isMinimized ? 'h-20 w-80' : 'h-[600px] w-[400px]'}
    `}>
            {/* Header */}
            <div className="p-5 border-b border-turq-primary/5 flex items-center justify-between bg-white/40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-turq-primary flex items-center justify-center text-white shadow-lg shadow-turq-primary/20 animate-pulse">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-deep-blue leading-none">AI Assistant</h3>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-2 text-slate-400 hover:text-turq-primary hover:bg-turq-primary/5 rounded-lg transition-all"
                    >
                        {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
                    >
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${msg.role === 'ai' ? 'bg-turq-primary text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                                        {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'ai'
                                        ? 'bg-white text-deep-blue border border-turq-primary/5'
                                        : 'bg-turq-primary text-white shadow-turq-primary/10'
                                        }`}>
                                        {msg.content}
                                        <div className={`text-[9px] mt-2 font-bold opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-2">
                                    <Loader2 size={16} className="text-turq-primary animate-spin" />
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Asistente pensando...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-5 border-t border-turq-primary/5 bg-white/40">
                        <div className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Escribe un comando o consulta..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-5 pr-14 text-sm text-deep-blue focus:outline-none focus:border-turq-primary focus:ring-4 focus:ring-turq-primary/10 transition-all font-medium"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${input.trim()
                                    ? 'bg-turq-primary text-white shadow-lg shadow-turq-primary/20 hover:scale-105 active:scale-95'
                                    : 'text-slate-300 pointer-events-none'
                                    }`}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <div className="mt-3 flex gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Sugerencias:</span>
                            <button onClick={() => setInput("Crear presupuesto para...")} className="text-[9px] font-bold text-turq-primary hover:underline transition-all">&quot;Crear presupuesto...&quot;</button>
                            <button onClick={() => setInput("Listar clientes")} className="text-[9px] font-bold text-turq-primary hover:underline transition-all">&quot;Listar clientes&quot;</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
