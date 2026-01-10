'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, ClipboardList, Settings, LogOut, Headphones, MessageCircle, X, LayoutDashboard } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [showSupportModal, setShowSupportModal] = useState(false);

    const handleSupportClick = () => {
        window.open('https://wa.me/573207941082', '_blank');
        setShowSupportModal(false);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        NóminaApp
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Panel Administrativo</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin/employees"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all group"
                    >
                        <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Empleados</span>
                    </Link>

                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all group"
                    >
                        <Settings className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Configuración</span>
                    </Link>

                    <button
                        onClick={() => setShowSupportModal(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all group"
                    >
                        <Headphones className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Soporte</span>
                    </button>

                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
                    >
                        <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link
                        href="/clock"
                        className="flex items-center gap-3 px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Ir al Reloj</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full">
                <div className="p-8">
                    {children}
                </div>
            </main>

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
