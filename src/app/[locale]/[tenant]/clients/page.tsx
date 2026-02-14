"use client";

import { use } from "react";
import { Users, Plus, Search, Filter, Mail, Phone, MoreVertical, UserPlus } from "lucide-react";

export default function ClientsPage({ params }: { params: Promise<{ tenant: string }> }) {
    const { tenant } = use(params);

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-[900] text-deep-blue tracking-tight mb-2 font-outfit">
                        Directorio de <span className="text-turq-primary">Clientes</span>
                    </h1>
                    <p className="text-slate-500 font-medium font-inter">
                        Base de relaciones para <span className="text-deep-blue font-bold">{tenant}</span>
                    </p>
                </div>
                <button className="pro-button shadow-xl shadow-turq-primary/20 group !py-3 !px-6 text-sm">
                    <UserPlus size={18} />
                    Añadir Cliente
                </button>
            </div>

            {/* Content Card */}
            <div className="pro-card bg-white/60 p-8 min-h-[500px]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h2 className="text-xl font-[900] text-deep-blue font-outfit flex items-center gap-3">
                        <Users className="text-turq-primary" size={24} />
                        Cartera de Clientes
                    </h2>
                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Nombre, email o empresa..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-turq-primary/10 bg-white/50 focus:outline-none focus:ring-2 focus:ring-turq-primary/20 text-sm font-medium"
                            />
                        </div>
                        <button className="p-2.5 rounded-xl border border-turq-primary/10 bg-white/50 text-slate-500 hover:text-turq-primary transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                {/* Clients Table Placeholder */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                <th className="px-6 py-4">Cliente / Contacto</th>
                                <th className="px-6 py-4">Empresa</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1].map(i => (
                                <tr key={i} className="group bg-white/50 hover:bg-white transition-all duration-300">
                                    <td className="px-6 py-5 rounded-l-2xl border-y border-l border-turq-primary/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-turq-primary/10 flex items-center justify-center text-turq-primary font-bold text-sm">
                                                JD
                                            </div>
                                            <div>
                                                <p className="font-bold text-deep-blue font-outfit">Juan Díaz (Demo)</p>
                                                <p className="text-[11px] text-slate-400 font-medium">juan.diaz@demo.com</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 border-y border-turq-primary/5">
                                        <span className="text-sm font-bold text-slate-600">Constructor Pro S.A.</span>
                                    </td>
                                    <td className="px-6 py-5 border-y border-turq-primary/5">
                                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                                            Activo
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 rounded-r-2xl border-y border-r border-turq-primary/5 text-right">
                                        <button className="p-2 text-slate-300 hover:text-turq-primary transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty Help */}
                <div className="mt-12 p-8 rounded-3xl bg-slate-50/50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300">
                            <Users size={32} />
                        </div>
                        <div>
                            <h4 className="font-bold text-deep-blue font-outfit">Importar Contactos</h4>
                            <p className="text-sm text-slate-500 font-medium">Sincroniza tu lista desde CSV o Google Contacts.</p>
                        </div>
                    </div>
                    <button className="pro-card !py-3 !px-8 text-xs font-black uppercase tracking-widest text-deep-blue border-turq-primary/20 hover:border-turq-primary transition-all">
                        Configurar Importación
                    </button>
                </div>
            </div>
        </div>
    );
}
