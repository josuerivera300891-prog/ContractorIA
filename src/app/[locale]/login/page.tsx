'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/app/actions/auth';
import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const t = useTranslations('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            router.refresh();
            setLoading(false);
        } else {
            // Get profile and redirect
            const session = await getUserProfile();

            if (session?.role === 'superadmin') {
                router.push('/superadmin'); // The middleware or layout should handle locale
            } else if (session?.companySlug) {
                router.push(`/${session.companySlug}/dashboard`);
            } else {
                // If no company, go to register
                router.push('/register');
            }
        }
    };

    return (
        <div className="min-h-screen turq-aura-bg flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center items-center gap-2 mb-10 group">
                    <div className="bg-turq-primary/10 p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                        <TrendingUp className="text-turq-primary" size={32} />
                    </div>
                    <span className="text-3xl font-[950] tracking-tighter text-deep-blue leading-none font-outfit">
                        Contractor<span className="text-turq-primary">IA</span>
                    </span>
                </Link>
                <h2 className="text-center text-4xl font-[900] text-deep-blue tracking-tight leading-tight font-outfit">
                    {t('title', { defaultMessage: 'Bienvenido de nuevo' })}
                </h2>
                <p className="mt-4 text-center text-slate-600 font-medium">
                    {t('or', { defaultMessage: '¿No tienes cuenta?' })}{' '}
                    <Link href="/register" className="text-turq-primary hover:text-turq-secondary font-bold transition-colors">
                        {t('register', { defaultMessage: 'Comienza tu prueba gratuita' })}
                    </Link>
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="pro-card p-8 sm:p-10 bg-white/60">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">
                                {t('email', { defaultMessage: 'Correo Electrónico' })}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pro-input w-full bg-white/50"
                                placeholder="tu@empresa.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                                    {t('password', { defaultMessage: 'Contraseña' })}
                                </label>
                                <a href="#" className="text-xs font-bold text-turq-primary hover:text-turq-secondary transition-colors">
                                    {t('forgotPassword', { defaultMessage: '¿Olvidaste tu contraseña?' })}
                                </a>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pro-input w-full bg-white/50"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-5 w-5 text-turq-primary border-slate-200 rounded focus:ring-turq-primary/20 transition-all cursor-pointer accent-turq-primary"
                            />
                            <label htmlFor="remember-me" className="ml-3 block text-sm font-bold text-slate-600 cursor-pointer">
                                {t('rememberMe', { defaultMessage: 'Recordar mi sesión' })}
                            </label>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 p-4 border border-red-100">
                                <div className="flex gap-3">
                                    <span className="material-icons text-red-500 text-sm">error</span>
                                    <p className="text-sm font-bold text-red-800">{error}</p>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full pro-button shadow-2xl shadow-turq-primary/20 flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50 h-14"
                        >
                            {loading && (
                                <span className="flex h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            )}
                            {loading ? t('processing', { defaultMessage: 'Iniciando sesión...' }) : t('signIn', { defaultMessage: 'Entrar a ContractorIA' })}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
