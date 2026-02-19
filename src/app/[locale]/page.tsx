'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Play, ShieldCheck, Zap, BarChart3, TrendingUp, ChevronRight } from 'lucide-react';

export default function LandingPage() {
    const t = useTranslations('Landing');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
    };

    return (
        <div className="min-h-screen turq-aura-bg text-slate-900 selection:bg-turq-primary/30 selection:text-deep-blue overflow-x-hidden">
            <Navbar />

            {/* Hero Section - Turquoise Aura Premium */}
            <section className="relative pt-56 pb-24 lg:pt-64 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-30"></div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-5xl mx-auto px-6 relative z-10 text-center"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-turq-primary/10 border border-turq-primary/20 text-turq-primary text-[12px] font-black uppercase tracking-[0.2em] mb-12 backdrop-blur-md">
                        <span className="flex h-2 w-2 rounded-full bg-turq-primary animate-pulse"></span>
                        {t('evolution') || '10 Días de Prueba Gratuita • La evolución del presupuesto'}
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-6xl lg:text-[104px] font-[900] text-deep-blue leading-[0.9] mb-12 tracking-[-0.05em] drop-shadow-sm font-outfit">
                        Escala tu negocio con presupuestos <span className="bg-gradient-to-r from-turq-primary to-turq-secondary bg-clip-text text-transparent">inteligentes.</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-xl lg:text-2xl text-slate-600 mb-16 leading-relaxed max-w-3xl mx-auto font-medium">
                        ContractorIA es la infraestructura de IA corporativa diseñada para que contratistas cierren tratos en tiempo récord con precisión milimétrica.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button className="pro-button text-lg shadow-2xl shadow-turq-primary/20 w-full sm:w-80 h-16 px-10">
                            {t('ctaRequest') || 'Probar Ahora Gratis'} <ChevronRight size={20} />
                        </button>
                        <button className="pro-card bg-white/40 border-turq-primary/20 hover:border-turq-primary/40 px-10 h-16 rounded-2xl text-lg font-bold transition-all flex items-center justify-center gap-3 active:scale-95 text-deep-blue shadow-premium w-full sm:w-auto group">
                            <Play size={20} className="text-turq-primary fill-turq-primary/20" /> {t('ctaWebinar') || 'Ver Demostración'}
                        </button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mt-24 flex flex-col items-center gap-6">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-10 w-10 rounded-full border-2 border-[#020617] overflow-hidden shadow-2xl">
                                    <Image
                                        alt={`User ${i}`}
                                        className="object-cover h-full w-full"
                                        src={`https://i.pravatar.cc/150?u=${i + 10}`}
                                        width={40}
                                        height={40}
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm font-bold text-slate-500">
                            <span className="text-white">+500 líderes</span> industriales ya confían en nuestra infraestructura
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* Social Proof Bar - Turquoise Glass */}
            <section className="py-24 border-y border-turq-primary/10 bg-white/20 backdrop-blur-md overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-turq-primary/5 via-transparent to-turq-secondary/5"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <p className="text-[12px] font-black text-turq-primary uppercase tracking-[0.4em] mb-14 text-center">
                        INFRAESTRUCTURA UTILIZADA POR
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-60 transition-all hover:opacity-100">
                        {['INDUSTRIAL', 'SOLUTIONS', 'PRECISION', 'GLOBAL.CON', 'OPS.GROUP'].map((partner) => (
                            <div key={partner} className="flex items-center gap-2 text-xl font-black tracking-tighter text-deep-blue hover:text-turq-primary transition-colors cursor-default font-outfit">
                                {partner}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section - Turquoise aura Theme */}
            <section id="features" className="py-40 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl mb-24"
                    >
                        <div className="text-turq-primary text-[12px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                            <span className="w-8 h-px bg-turq-primary"></span> Características Pro
                        </div>
                        <h2 className="text-5xl md:text-6xl font-[900] text-deep-blue mb-8 tracking-tighter leading-[1.1] font-outfit">
                            Infraestructura de <span className="text-turq-primary">clase mundial</span>
                        </h2>
                        <p className="text-slate-600 text-xl font-medium leading-relaxed">
                            ContractorIA automatiza todo el ciclo de vida de tus presupuestos, desde la captura hasta la firma del trato.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { icon: <ShieldCheck size={32} />, title: 'Seguridad Empresarial', desc: 'Protocolos de cifrado de grado bancario y aislamiento multi-tenant estricto.' },
                            { icon: <Zap size={32} />, title: 'Generación Instantánea', desc: 'Crea presupuestos complejos en segundos con nuestra IA optimizada para la industria.' },
                            { icon: <BarChart3 size={32} />, title: 'Análisis Predictivo', desc: 'Anticipa márgenes de ganancia y detecta riesgos con modelos de datos avanzados.' }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="pro-card group bg-white/50"
                            >
                                <div className="w-16 h-16 bg-turq-primary/10 text-turq-primary rounded-2xl flex items-center justify-center mb-10 border border-turq-primary/5 transition-all duration-500 group-hover:bg-turq-primary group-hover:text-white group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-5 text-deep-blue group-hover:text-turq-primary transition-colors font-outfit">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed font-medium group-hover:text-slate-700 transition-colors">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials - Turquoise Glass Design */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-turq-primary/20 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-[900] text-deep-blue mb-6 tracking-tight font-outfit text-center">
                            Resultados <span className="text-turq-primary">probados</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="pro-card p-12 bg-white/40 border-turq-primary/10 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-turq-primary/5 rounded-full blur-3xl group-hover:bg-turq-primary/10 transition-colors"></div>
                            <span className="text-6xl text-turq-primary/20 absolute top-8 left-8 font-serif">“</span>
                            <div className="relative z-10">
                                <p className="text-xl text-deep-blue font-bold leading-relaxed mb-10">
                                    &quot;ContractorIA ha reducido nuestro tiempo de respuesta de 3 días a 5 minutos. La precisión de los costos es simplemente asombrosa.&quot;
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-turq-primary/20 rounded-full flex items-center justify-center text-turq-primary font-black">MP</div>
                                    <div>
                                        <p className="font-black text-deep-blue">Marco Polo</p>
                                        <p className="text-xs font-bold text-turq-primary uppercase tracking-widest">Director Industrial</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pro-card p-12 bg-white/40 border-turq-secondary/10 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-turq-secondary/5 rounded-full blur-3xl group-hover:bg-turq-secondary/10 transition-colors"></div>
                            <span className="text-6xl text-turq-secondary/20 absolute top-8 left-8 font-serif">“</span>
                            <div className="relative z-10">
                                <p className="text-xl text-deep-blue font-bold leading-relaxed mb-10">
                                    &quot;La mejor inversión tecnológica que hemos hecho este año. Cerramos un 40% más de tratos gracias a la rapidez de la plataforma.&quot;
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-turq-secondary/20 rounded-full flex items-center justify-center text-turq-secondary font-black">EG</div>
                                    <div>
                                        <p className="font-black text-deep-blue">Elena Garcia</p>
                                        <p className="text-xs font-bold text-turq-secondary uppercase tracking-widest">VP de Ventas</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="py-24 bg-white/30 backdrop-blur-xl border-t border-turq-primary/10 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                        <div className="max-w-xs">
                            <div className="flex items-center gap-3 mb-8">
                                <TrendingUp className="text-turq-primary" size={32} />
                                <span className="text-3xl font-[950] tracking-tighter text-deep-blue font-outfit">Contractor<span className="text-turq-primary">IA</span></span>
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed">
                                Infraestructura de IA de proxima generación para el sector de la construcción.
                            </p>
                        </div>
                        <div className="flex gap-10 text-sm font-bold text-slate-500 uppercase tracking-widest">
                            <Link href="#" className="hover:text-turq-primary transition-colors">Aviso Legal</Link>
                            <Link href="#" className="hover:text-turq-primary transition-colors">Privacidad</Link>
                            <Link href="#" className="hover:text-turq-primary transition-colors">Cookies</Link>
                        </div>
                    </div>
                    <div className="mt-20 pt-10 border-t border-turq-primary/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                            © 2024 ContractorIA Enterprise. Todos los derechos reservados.
                        </p>
                        <div className="flex items-center gap-3 text-xs font-black text-turq-primary uppercase tracking-[0.4em]">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-turq-primary animate-pulse"></span>
                            Sistemas Operativos
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    );
}
