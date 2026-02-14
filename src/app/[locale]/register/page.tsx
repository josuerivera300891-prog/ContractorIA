'use client';

import { useTranslations } from 'next-intl';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { signup, SignupState } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TrendingUp, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';

const initialState: SignupState = {
    success: false,
    error: '',
    fieldErrors: {},
};

function SubmitButton() {
    const t = useTranslations('Register');
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full pro-button shadow-2xl shadow-turq-primary/20 flex justify-center items-center gap-3 active:scale-95 disabled:opacity-50 h-14"
        >
            {pending && (
                <span className="flex h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            {pending ? t('processing', { defaultMessage: 'Creando cuenta...' }) : (
                <>
                    {t('signUp', { defaultMessage: 'Crear cuenta' })} <ArrowRight size={20} />
                </>
            )}
        </button>
    );
}

export default function RegisterPage() {
    const t = useTranslations('Register');
    const [state, formAction] = useActionState(signup, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            router.push('/');
        }
    }, [state.success, router]);

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
                    {t('title', { defaultMessage: 'Comienza tu prueba gratuita' })}
                </h2>
                <p className="mt-4 text-center text-slate-600 font-medium">
                    {t('haveAccount', { defaultMessage: '¿Ya tienes una cuenta?' })}{' '}
                    <Link href="/login" className="text-turq-primary hover:text-turq-secondary font-bold transition-colors">
                        {t('signIn', { defaultMessage: 'Inicia sesión aquí' })}
                    </Link>
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl">
                <div className="pro-card p-8 sm:p-12 bg-white/60">
                    <form className="space-y-8" action={formAction}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">
                                    {t('firstName', { defaultMessage: 'Nombre' })}
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    className="pro-input w-full bg-white/50"
                                    placeholder="Juan"
                                />
                                {state.fieldErrors?.firstName && (
                                    <p className="mt-2 text-sm text-red-600 font-bold">{state.fieldErrors.firstName[0]}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">
                                    {t('lastName', { defaultMessage: 'Apellido' })}
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    className="pro-input w-full bg-white/50"
                                    placeholder="Pérez"
                                />
                                {state.fieldErrors?.lastName && (
                                    <p className="mt-2 text-sm text-red-600 font-bold">{state.fieldErrors.lastName[0]}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="companyName" className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">
                                {t('companyName', { defaultMessage: 'Nombre de la Empresa' })}
                            </label>
                            <input
                                id="companyName"
                                name="companyName"
                                type="text"
                                required
                                placeholder="Constructora Elite S.A."
                                className="pro-input w-full bg-white/50"
                            />
                            {state.fieldErrors?.companyName && (
                                <p className="mt-2 text-sm text-red-600 font-bold">{state.fieldErrors.companyName[0]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">
                                {t('email', { defaultMessage: 'Correo Corporativo' })}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="juan@constructor-elite.com"
                                className="pro-input w-full bg-white/50"
                            />
                            {state.fieldErrors?.email && (
                                <p className="mt-2 text-sm text-red-600 font-bold">{state.fieldErrors.email[0]}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">
                                {t('password', { defaultMessage: 'Contraseña' })}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                placeholder="••••••••"
                                className="pro-input w-full bg-white/50"
                            />
                            {state.fieldErrors?.password && (
                                <p className="mt-2 text-sm text-red-600 font-bold">{state.fieldErrors.password[0]}</p>
                            )}
                        </div>

                        {state.error && (
                            <div className="rounded-lg bg-red-50 p-4 border border-red-100">
                                <div className="flex gap-3">
                                    <span className="material-icons text-red-500 text-sm">error</span>
                                    <p className="text-sm font-bold text-red-800">{state.error}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <SubmitButton />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
