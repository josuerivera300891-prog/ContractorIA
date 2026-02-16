'use client'

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts'
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface FinancialChartProps {
    data: any[]
}

export default function FinancialChart({ data }: FinancialChartProps) {
    if (!data || data.length === 0) return null

    const totalRevenue = data.reduce((sum, item) => sum + item.ingresos, 0)
    const totalExpenses = data.reduce((sum, item) => sum + item.gastos, 0)
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
                <div>
                    <h2 className="text-xl font-[900] text-deep-blue font-outfit flex items-center gap-3">
                        <TrendingUp className="text-turq-primary" size={24} />
                        Historial Financiero
                    </h2>
                    <p className="text-xs text-slate-400 font-medium font-inter uppercase tracking-widest mt-1">Últimos 6 meses</p>
                </div>
                <div className="flex gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-turq-primary/10 flex items-center justify-center text-turq-primary">
                            <ArrowUpRight size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Margen Promedio</p>
                            <p className="text-sm font-black text-deep-blue font-outfit">{profitMargin.toFixed(1)}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full mt-8">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                            tickFormatter={(value) => `$${value > 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '20px',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                padding: '15px'
                            }}
                            labelStyle={{ fontWeight: 900, marginBottom: '5px', color: '#1e3a8a', fontFamily: 'Outfit' }}
                            itemStyle={{ fontSize: '12px', fontWeight: 700, fontFamily: 'Inter' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="ingresos"
                            stroke="#06b6d4"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorIngresos)"
                        />
                        <Area
                            type="monotone"
                            dataKey="gastos"
                            stroke="#f43f5e"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorGastos)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-turq-primary"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ingresos Reales</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#f43f5e]"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gastos Directos</span>
                </div>
            </div>
        </div>
    )
}
