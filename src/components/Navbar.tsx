'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { TrendingUp, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const t = useTranslations('Navbar');
    const locale = useLocale();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${isScrolled ? 'bg-white/70 backdrop-blur-xl border-b border-turq-primary/10 py-3 shadow-premium' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
                    <div className="p-2 bg-turq-primary/10 rounded-xl group-hover:scale-110 transition-transform duration-500">
                        <TrendingUp className="text-turq-primary" size={28} />
                    </div>
                    <span className={`text-2xl font-[950] tracking-tighter font-outfit ${isScrolled || !isScrolled ? 'text-deep-blue' : 'text-white'}`}>
                        Contractor<span className="text-turq-primary">IA</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    {['features', 'solutions', 'pricing'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item}`}
                            className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-turq-primary active:scale-95 ${isScrolled || !isScrolled ? 'text-slate-600' : 'text-white/80'}`}
                        >
                            {t(item)}
                        </Link>
                    ))}
                    <Link href={`/${locale}/login`}>
                        <button className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-turq-primary ${isScrolled || !isScrolled ? 'text-slate-600' : 'text-white/80'}`}>
                            {t('login')}
                        </button>
                    </Link>
                    <Link href={`/${locale}/register`}>
                        <button className="pro-button !py-3 !px-8 text-sm shadow-xl active:scale-95">
                            {t('register')}
                        </button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={`md:hidden p-2 rounded-xl transition-colors ${isScrolled || !isScrolled ? 'text-deep-blue hover:bg-turq-primary/10' : 'text-white hover:bg-white/10'}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu - Premium Aura */}
            <div className={`fixed inset-0 z-50 bg-white/95 backdrop-blur-2xl md:hidden transition-all duration-500 flex flex-col p-8 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
                <div className="flex justify-between items-center mb-16">
                    <div className="flex items-center gap-2.5">
                        <TrendingUp className="text-turq-primary" size={32} />
                        <span className="text-3xl font-[950] tracking-tighter text-deep-blue font-outfit">Contractor<span className="text-turq-primary">IA</span></span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-deep-blue">
                        <X size={32} />
                    </button>
                </div>

                <div className="flex flex-col gap-8">
                    {['features', 'solutions', 'pricing'].map((item) => (
                        <Link
                            key={item}
                            href={`#${item}`}
                            className="text-2xl font-black text-deep-blue hover:text-turq-primary transition-colors font-outfit"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t(item)}
                        </Link>
                    ))}
                    <div className="h-px bg-slate-100 my-4"></div>
                    <Link href={`/${locale}/login`} onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="text-xl font-bold text-slate-600 mb-6">{t('login')}</div>
                    </Link>
                    <Link href={`/${locale}/register`} onClick={() => setIsMobileMenuOpen(false)}>
                        <button className="pro-button w-full h-16 text-lg">
                            {t('register')}
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
