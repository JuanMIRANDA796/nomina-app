'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, ClipboardList, Settings, LogOut, Headphones, MessageCircle, X, LayoutDashboard, Crown, Eye, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import NominaXLogo from '@/components/NominaXLogo';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, addDays } from 'date-fns';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [session, setSession] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
    const [isTrialActive, setIsTrialActive] = useState(false);
    const [showBanner, setShowBanner] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            const companyId = localStorage.getItem('company_id');
            if (!companyId) return;

            try {
                const res = await fetch('/api/auth/session', {
                    headers: { 'x-company-id': companyId }
                });
                const data = await res.json();
                setSession(data);
                if (data.plan === 'SEMILLA' && data.name !== 'PERSIFAL') {
                    setIsTrialActive(true);
                }
            } catch (error) {
                console.error('Error fetching session:', error);
            }
        };

        fetchSession();
    }, []);

    useEffect(() => {
        if (!session || session.plan !== 'SEMILLA') return;

        const timer = setInterval(() => {
            const createdAt = new Date(session.createdAt);
            const trialEnd = addDays(createdAt, 30);
            const now = new Date();

            const diff = trialEnd.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
                setIsTrialActive(false);
                clearInterval(timer);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((diff / 1000 / 60) % 60);
            const secs = Math.floor((diff / 1000) % 60);

            setTimeLeft({ days, hours, mins, secs });
        }, 1000);

        return () => clearInterval(timer);
    }, [session]);

    const handleSupportClick = () => {
        window.open('https://wa.me/573207941082', '_blank');
        setShowSupportModal(false);
    };

    const handleUpgradeClick = () => {
        window.location.href = '/admin/subscription';
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col z-20 shrink-0">
                <div className="p-6 border-b border-gray-100 flex flex-col items-start justify-center">
                    <NominaXLogo className="scale-75 origin-left" />
                    <p className="text-xs text-gray-500 mt-2 font-medium">Panel Administrativo</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all group lg:text-sm font-medium"
                    >
                        <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        href="/admin/employees"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all group lg:text-sm font-medium"
                    >
                        <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Empleados</span>
                    </Link>

                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all group lg:text-sm font-medium"
                    >
                        <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Configuración</span>
                    </Link>

                    <Link
                        href="/admin/subscription"
                        className="flex items-center gap-3 px-4 py-3 text-purple-700 rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-all group font-bold bg-purple-50/50 lg:text-sm shadow-sm border border-purple-100/50"
                    >
                        <Crown className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Mi Suscripción</span>
                    </Link>

                    <button
                        onClick={() => setShowSupportModal(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all group lg:text-sm font-medium"
                    >
                        <Headphones className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="text-left">Soporte</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link
                        href="/clock"
                        className="flex items-center gap-3 px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-all font-bold lg:text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Ir al Reloj</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative h-full">
                {/* Trial Countdown Banner */}
                <AnimatePresence>
                    {isTrialActive && showBanner && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="w-full bg-[#FFD700] overflow-hidden shadow-md flex-shrink-0 z-30"
                        >
                            <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-2 sm:py-0 h-auto sm:h-14 gap-2 sm:gap-0">
                                <div className="flex items-center gap-3 text-gray-900">
                                    <span className="text-xl">👀</span>
                                    <p className="font-bold text-sm md:text-base leading-tight">
                                        ¡El tiempo corre! <span className="font-normal block sm:inline">Activa tu plan antes de que termine tu prueba</span>
                                    </p>
                                </div>
                                
                                <div className="flex items-center h-full">
                                    {/* Countdown Display */}
                                    <div className="bg-[#00F5D4] h-full px-4 sm:px-6 py-2 sm:py-0 flex items-center gap-3 sm:gap-4 border-l border-black/5">
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-lg sm:text-xl font-black tabular-nums leading-none">{timeLeft.days}</span>
                                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter opacity-70">Días</span>
                                        </div>
                                        <span className="text-xl font-bold opacity-30 mt-[-8px] sm:mt-[-12px]">-</span>
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-lg sm:text-xl font-black tabular-nums leading-none">{timeLeft.hours}</span>
                                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter opacity-70">Hrs</span>
                                        </div>
                                        <span className="text-xl font-bold opacity-30 mt-[-8px] sm:mt-[-12px]">-</span>
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-lg sm:text-xl font-black tabular-nums leading-none">{timeLeft.mins}</span>
                                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter opacity-70">Mins</span>
                                        </div>
                                        
                                        <button 
                                            onClick={handleUpgradeClick}
                                            className="ml-2 sm:ml-4 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-900/20 flex items-center gap-1"
                                        >
                                            Ir a pagar
                                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                        
                                        <button 
                                            onClick={() => setShowBanner(false)}
                                            className="ml-1 p-1 text-black/40 hover:text-black transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    {children}
                </main>
            </div>

            {/* Support Modal */}
            <AnimatePresence>
                {showSupportModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setShowSupportModal(false);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100"
                        >
                            <div className="relative p-8">
                                <button
                                    onClick={() => setShowSupportModal(false)}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 shadow-md">
                                        <MessageCircle className="w-10 h-10" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                        ¿Necesitas ayuda?
                                    </h3>

                                    <p className="text-gray-600 mb-8 leading-relaxed">
                                        Serás dirigido a nuestro chat oficial de WhatsApp.
                                        Allí ayudaremos a resolver dudas técnicas, reportar mejoras en la plataforma y brindarte
                                        <span className="font-semibold text-emerald-700"> asesoría legal especializada</span> en nómina.
                                    </p>

                                    <div className="flex gap-4 w-full">
                                        <button
                                            onClick={() => setShowSupportModal(false)}
                                            className="flex-1 py-3 px-6 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSupportClick}
                                            className="flex-1 py-3 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            Ir a WhatsApp
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
