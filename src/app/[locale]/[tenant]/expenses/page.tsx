import { createClient } from '@/utils/supabase/server'
import { getTranslations } from 'next-intl/server'
import { Receipt, Plus, Filter, TrendingDown, DollarSign, Briefcase } from 'lucide-react'
import { createExpenseAction, deleteExpenseAction } from '@/app/actions/expenses'
import { revalidatePath } from 'next/cache'

export default async function ExpensesPage({
    params: { locale, tenant }
}: {
    params: { locale: string; tenant: string }
}) {
    const supabase = await createClient()
    const t = await getTranslations('Sidebar')

    // Get company ID
    const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', tenant)
        .single()

    if (!company) return <div>Company not found</div>

    // Get expenses
    const { data: expenses } = await supabase
        .from('expenses')
        .select(`
            *,
            estimates (
                title
            )
        `)
        .eq('company_id', company.id)
        .order('expense_date', { ascending: false })

    // Get estimates for the dropdown
    const { data: estimates } = await supabase
        .from('estimates')
        .select('id, title')
        .eq('company_id', company.id)

    const totalExpenses = (expenses || []).reduce((acc, exp) => acc + Number(exp.amount), 0)

    async function handleAddExpense(formData: FormData) {
        'use server'
        const result = await createExpenseAction(formData, company!.id)
        if (result.success) revalidatePath(`/${locale}/${tenant}/expenses`)
    }

    async function handleDelete(id: string) {
        'use server'
        await deleteExpenseAction(id, company!.id)
        revalidatePath(`/${locale}/${tenant}/expenses`)
    }

    return (
        <div className="p-8 space-y-10 max-w-7xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-turq-primary/10 rounded-lg text-turq-primary">
                            <Receipt size={20} />
                        </div>
                        <span className="text-xs font-black text-turq-primary uppercase tracking-[0.2em] font-inter">
                            Administración Financiera
                        </span>
                    </div>
                    <h1 className="text-5xl font-[900] text-deep-blue tracking-tighter font-outfit">
                        Control de <span className="text-turq-primary">Gastos</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md p-2 rounded-[2rem] border border-turq-primary/5 shadow-xl shadow-turq-primary/5">
                    <div className="px-6 py-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Gastos Totales (Acumulado)</p>
                        <p className="text-2xl font-black text-deep-blue font-outfit">${totalExpenses.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Add Expense Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-turq-primary/5 shadow-2xl shadow-turq-primary/5 sticky top-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-turq-primary rounded-2xl text-white shadow-lg shadow-turq-primary/20">
                                <Plus size={20} />
                            </div>
                            <h2 className="text-xl font-black text-deep-blue font-outfit tracking-tight">Nuevo Gasto</h2>
                        </div>

                        <form action={handleAddExpense} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Concepto / Descripción</label>
                                <input
                                    name="description"
                                    type="text"
                                    required
                                    placeholder="Ej: Materiales Home Depot"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold placeholder:text-slate-300 transition-all font-inter"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Monto ($)</label>
                                    <input
                                        name="amount"
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold font-inter"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Fecha</label>
                                    <input
                                        name="expense_date"
                                        type="date"
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        required
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold font-inter"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Categoría</label>
                                <select
                                    name="category"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold appearance-none bg-no-repeat bg-[right_1.5rem_center] font-inter"
                                >
                                    <option value="Material">Material</option>
                                    <option value="Labor">Mano de Obra</option>
                                    <option value="Equipment">Equipo</option>
                                    <option value="Subcontractor">Subcontratista</option>
                                    <option value="Other">Otros</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Vincular Proyecto</label>
                                <select
                                    name="estimate_id"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-turq-primary/20 text-deep-blue font-bold font-inter"
                                >
                                    <option value="">General (Sin proyecto)</option>
                                    {estimates?.map(est => (
                                        <option key={est.id} value={est.id}>{est.title}</option>
                                    ))}
                                </select>
                            </div>

                            <button className="w-full py-5 rounded-[2rem] bg-turq-primary text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-turq-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 font-inter">
                                Registrar Gasto
                            </button>
                        </form>
                    </div>
                </div>

                {/* Expenses List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-8 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                                <Filter size={16} />
                            </div>
                            <h3 className="font-bold text-slate-500">Historial de Gastos</h3>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {expenses?.length === 0 && (
                            <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                                    <TrendingDown size={32} />
                                </div>
                                <h4 className="text-lg font-black text-slate-400 font-outfit">No hay gastos registrados</h4>
                                <p className="text-slate-400 text-sm mt-2">Los gastos de tus proyectos aparecerán aquí.</p>
                            </div>
                        )}

                        {expenses?.map((expense) => (
                            <div
                                key={expense.id}
                                className="group bg-white rounded-[2rem] p-6 border border-turq-primary/5 hover:border-turq-primary/20 hover:shadow-2xl hover:shadow-turq-primary/5 transition-all duration-500"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${expense.category === 'Material' ? 'bg-emerald-50 text-emerald-500' :
                                        expense.category === 'Labor' ? 'bg-blue-50 text-blue-500' :
                                            'bg-slate-50 text-slate-500'
                                        }`}>
                                        <DollarSign size={24} />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-black text-deep-blue text-lg font-outfit tracking-tight leading-tight group-hover:text-turq-primary transition-colors">
                                                    {expense.description}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100 font-inter">
                                                        {expense.category}
                                                    </span>
                                                    {expense.estimates && (
                                                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-turq-primary font-inter">
                                                            <Briefcase size={10} />
                                                            {expense.estimates.title}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-deep-blue font-outfit">
                                                    ${Number(expense.amount).toLocaleString()}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1 font-inter">
                                                    {new Date(expense.expense_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <form action={async () => {
                                        'use server'
                                        await deleteExpenseAction(expense.id, company!.id)
                                        revalidatePath(`/${locale}/${tenant}/expenses`)
                                    }}>
                                        <button className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                            <TrendingDown size={18} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
