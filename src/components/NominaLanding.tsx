'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ChevronRight, Clock, X, Lock, User, ShieldCheck, BarChart3 } from 'lucide-react';
import NominaXLogo from './NominaXLogo';

export default function NominaLanding() {
    const router = useRouter();
    const [showLogin, setShowLogin] = useState(false);
    const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
    const [companyName, setCompanyName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPlanNotice, setShowPlanNotice] = useState(true);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const endpoint = authMode === 'LOGIN' ? '/api/auth/login' : '/api/auth/register';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: companyName, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('company_id', data.companyId.toString());
                localStorage.setItem('company_name', data.companyName);
                localStorage.setItem('auth_token', 'true'); // Simple auth
                toast.success(authMode === 'LOGIN' ? `Bienvenido, ${data.companyName}` : 'Cuenta creada con éxito');
                router.push('/clock');
            } else {
                toast.error(data.error || 'Error en la autenticación');
            }
        } catch (error) {
            toast.error('Error de conexión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#0f1014] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-5 md:px-12 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm md:backdrop-blur-none transition-all">
                <div className="flex items-center gap-2">
                    <NominaXLogo className="scale-75 origin-left" lightTheme={true} />
                </div>
                <div className="flex items-center gap-4 md:gap-6">
                    <Link href="/planes" className="text-gray-300 hover:text-white font-medium transition-colors text-sm md:text-base hidden sm:block">
                        Planes
                    </Link>
                    <button
                        onClick={() => setShowLogin(true)}
                        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-lg shadow-blue-900/20 text-sm md:text-base border border-blue-500/50"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-20 transform scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0f1014]" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto space-y-8 mt-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400"
                    >
                        El Futuro de tu <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">Nómina Empresarial</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed"
                    >
                        Simplifica la gestión de talento, automatiza pagos legales y asegura el cumplimiento normativo en una sola plataforma inteligente.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button
                            onClick={() => setShowLogin(true)}
                            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-xl font-bold text-white shadow-2xl shadow-blue-900/40 hover:scale-105 transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center"
                        >
                            Comienza Ahora
                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                        </button>
                        <Link
                            href="/planes"
                            className="px-8 py-4 bg-transparent border-2 border-gray-700 hover:border-gray-500 rounded-xl text-xl font-bold text-gray-300 hover:text-white transition-all duration-300 w-full sm:w-auto text-center"
                        >
                            Ver Planes
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Login Modal */}
            <AnimatePresence>
                {showLogin && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowLogin(false) }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md bg-[#16181d] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 relative">
                                <button
                                    onClick={() => setShowLogin(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold text-white mb-2">
                                        {authMode === 'LOGIN' ? 'Bienvenido' : 'Nueva Empresa'}
                                    </h2>
                                    <p className="text-gray-400 text-sm">
                                        {authMode === 'LOGIN' ? 'Ingresa a tu portal empresarial' : 'Registra tu empresa para empezar'}
                                    </p>
                                </div>

                                {authMode === 'SIGNUP' && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 text-center relative overflow-hidden group shadow-2xl shadow-blue-500/10"
                                    >
                                        <div className="relative z-10">
                                            <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">MODALIDAD DE REGISTRO RÁPIDO</p>
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <span className="text-2xl">🌱</span>
                                                <h4 className="text-white text-lg font-bold">Plan Semilla (Gratis)</h4>
                                            </div>
                                            <p className="text-gray-400 text-xs leading-relaxed mb-4">
                                                Tendrás un límite máximo de <span className="text-blue-400 font-bold">2 empleados</span>. 
                                                Ideal para micro-negocios en fase inicial.
                                            </p>
                                            
                                            <div className="flex flex-col gap-2">
                                                <p className="text-[10px] text-gray-500 font-medium">¿Necesitas más capacidad?</p>
                                                <Link 
                                                    href="/planes"
                                                    className="inline-flex items-center justify-center gap-2 py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-xs font-bold transition-all group/btn"
                                                >
                                                    🚀 Ver Planes Emprendedor / Empresarial
                                                    <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                        {/* Subtle background glow */}
                                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-24 h-24 bg-blue-500/10 blur-[40px] rounded-full"></div>
                                    </motion.div>
                                )}

                                <div className="flex bg-[#0f1014] p-1 rounded-xl mb-6">
                                    <button
                                        onClick={() => {
                                            setAuthMode('LOGIN');
                                            setShowPlanNotice(true); // Reset for next time they click signup
                                        }}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authMode === 'LOGIN' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Ingresar
                                    </button>
                                    <button
                                        onClick={() => setAuthMode('SIGNUP')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authMode === 'SIGNUP' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Registrarse
                                    </button>
                                </div>

                                <AnimatePresence mode="wait">
                                    {authMode === 'SIGNUP' && showPlanNotice ? (
                                        <motion.div
                                            key="plan-notice"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 text-center relative overflow-hidden shadow-2xl">
                                                <div className="relative z-10">
                                                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">PLAN INICIAL ASIGNADO</p>
                                                    <div className="flex items-center justify-center gap-3 mb-3">
                                                        <span className="text-3xl animate-bounce">🌱</span>
                                                        <h4 className="text-white text-xl font-bold tracking-tight">Plan Semilla (Gratis)</h4>
                                                    </div>
                                                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                                        Este plan tiene un límite máximo de <span className="text-blue-400 font-bold">2 empleados</span>. 
                                                        Ideal para empezar sin costos.
                                                    </p>
                                                    
                                                    <div className="space-y-3">
                                                        <Link 
                                                            href="/planes"
                                                            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all group"
                                                        >
                                                            🚀 Ver Planes Emprendedor / Empresarial
                                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                        </Link>
                                                        
                                                        <button 
                                                            type="button"
                                                            onClick={() => setShowPlanNotice(false)}
                                                            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-sm font-medium transition-all"
                                                        >
                                                            Continuar con Plan Semilla
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-24 h-24 bg-blue-500/10 blur-[40px] rounded-full"></div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            key="auth-form"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            onSubmit={handleAuth}
                                            className="space-y-6"
                                        >
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <User className="h-5 w-5 text-gray-500" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre de la Empresa"
                                                        className="w-full bg-[#0f1014] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                                        value={companyName}
                                                        onChange={(e) => setCompanyName(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock className="h-5 w-5 text-gray-500" />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        placeholder="Contraseña"
                                                        className="w-full bg-[#0f1014] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-blue-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                            >
                                                {isLoading ? (
                                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    authMode === 'LOGIN' ? "Ingresar" : "Crear Cuenta"
                                                )}
                                            </button>
                                            
                                            {authMode === 'SIGNUP' && (
                                                <button 
                                                    onClick={() => setShowPlanNotice(true)}
                                                    className="w-full text-xs text-gray-500 hover:text-gray-400 underline underline-offset-4"
                                                >
                                                    Regresar a información de planes
                                                </button>
                                            )}
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
