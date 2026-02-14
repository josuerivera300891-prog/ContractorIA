import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function SuperAdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const supabase = await createClient();

    // Security Check: Only superadmin allowed
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect(`/${locale}/login`);

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'superadmin') {
        redirect(`/${locale}/login`);
    }

    // Fetch all companies
    const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen bg-slate-50 p-8 sm:p-12">
            <div className="max-w-7xl mx-auto space-y-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-200">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-700 text-[10px] font-black uppercase tracking-widest mb-4">
                            System Access: SuperAdmin
                        </div>
                        <h1 className="text-4xl font-black text-brand-navy tracking-tight">Gestión Global de Empresas</h1>
                        <p className="text-slate-500 font-medium">Control total sobre el ecosistema ContractorIA</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Total Empresas</h3>
                        <p className="text-4xl font-black text-brand-navy">{companies?.length || 0}</p>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Suscripciones Activas</h3>
                        <p className="text-4xl font-black text-emerald-600">{companies?.length || 0}</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-4">Empresa</th>
                                <th className="px-8 py-4">Slug</th>
                                <th className="px-8 py-4">Fecha Registro</th>
                                <th className="px-8 py-4">Estado</th>
                                <th className="px-8 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {companies?.map((company) => (
                                <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-6 font-bold text-brand-navy">{company.name}</td>
                                    <td className="px-8 py-6 text-slate-500 font-mono text-xs">{company.slug}</td>
                                    <td className="px-8 py-6 text-slate-500">{new Date(company.created_at).toLocaleDateString()}</td>
                                    <td className="px-8 py-6">
                                        <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase">Activa</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="text-brand-primary font-black text-xs hover:underline">Gestionar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
