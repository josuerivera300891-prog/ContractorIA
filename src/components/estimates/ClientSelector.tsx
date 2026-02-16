"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search, UserPlus, Check, ChevronDown, Building2, Mail, X } from "lucide-react";
import { getClients } from "@/app/actions/clients";

interface ClientSelectorProps {
    companyId: string;
    selectedClientId?: string;
    onSelect: (client: ClientOption | null) => void;
}

export interface ClientOption {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    company_name?: string;
    address?: string;
    phone?: string;
}

export function ClientSelector({ companyId, selectedClientId, onSelect }: ClientSelectorProps) {
    const [clients, setClients] = useState<ClientOption[]>([]);
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<ClientOption | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Load clients on mount
    useEffect(() => {
        async function load() {
            setIsLoading(true);
            const data = await getClients(companyId);
            const mapped: ClientOption[] = (data || []).map((c: ClientOption) => ({
                id: c.id,
                first_name: c.first_name,
                last_name: c.last_name,
                email: c.email,
                company_name: c.company_name,
                address: c.address,
                phone: c.phone,
            }));
            setClients(mapped);

            // Pre-select if ID provided
            if (selectedClientId) {
                const found = mapped.find(c => c.id === selectedClientId);
                if (found) setSelected(found);
            }
            setIsLoading(false);
        }
        load();
    }, [companyId, selectedClientId]);

    // Derived filtered list (no setState needed)
    const filtered = useMemo(() => {
        if (!search.trim()) return clients;
        const q = search.toLowerCase();
        return clients.filter(c =>
            `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q) ||
            c.company_name?.toLowerCase().includes(q)
        );
    }, [search, clients]);

    // Close on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleSelect = (client: ClientOption) => {
        setSelected(client);
        onSelect(client);
        setIsOpen(false);
        setSearch("");
    };

    const handleClear = () => {
        setSelected(null);
        onSelect(null);
    };

    return (
        <div ref={dropdownRef} className="relative w-full">
            {/* Trigger / Selected */}
            {selected ? (
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-turq-primary/20 shadow-sm group hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-turq-primary/10 flex items-center justify-center text-turq-primary font-black text-sm">
                            {selected.first_name.charAt(0)}{selected.last_name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-deep-blue text-sm">
                                {selected.first_name} {selected.last_name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                                {selected.company_name || selected.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClear}
                        className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-dashed border-turq-primary/20 hover:border-turq-primary/40 text-slate-400 hover:text-turq-primary transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-turq-primary/5 group-hover:text-turq-primary transition-colors">
                            <UserPlus size={18} />
                        </div>
                        <span className="text-sm font-bold">Seleccionar Cliente</span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            )}

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl shadow-slate-200/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Search */}
                    <div className="p-3 border-b border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar por nombre, email o empresa..."
                                autoFocus
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl text-xs font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 border border-slate-100"
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <div className="max-h-52 overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="p-6 text-center">
                                <div className="w-5 h-5 border-2 border-turq-primary/30 border-t-turq-primary rounded-full animate-spin mx-auto mb-2" />
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Cargando clientes...</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="p-6 text-center">
                                <p className="text-xs font-bold text-slate-400 mb-1">Sin resultados</p>
                                <p className="text-[10px] text-slate-300">No se encontraron clientes con ese criterio.</p>
                            </div>
                        ) : (
                            filtered.map(client => (
                                <button
                                    key={client.id}
                                    onClick={() => handleSelect(client)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-turq-primary/5 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                                            {client.first_name.charAt(0)}{client.last_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-deep-blue">
                                                {client.first_name} {client.last_name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {client.company_name && (
                                                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                                        <Building2 size={8} /> {client.company_name}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-slate-300 font-medium flex items-center gap-1">
                                                    <Mail size={8} /> {client.email}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {selected?.id === client.id && (
                                        <Check size={14} className="text-turq-primary" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
