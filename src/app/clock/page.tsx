'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Clock, LogIn, LogOut, X, Loader2, Lock } from 'lucide-react';

export default function TimeClock() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Clock Modal State
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState<'ENTRY' | 'EXIT' | null>(null);
    const [cedula, setCedula] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Admin Login State
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');

    // Simple protection for the prototype
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('demo_auth');
        if (!isAuthenticated) {
            toast.error('Debes iniciar sesión primero');
            router.push('/');
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleAction = (type: 'ENTRY' | 'EXIT') => {
        setActionType(type);
        setShowModal(true);
    };

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (adminPassword === '12345') {
            toast.success('Acceso concedido');
            router.push('/admin/employees');
        } else {
            toast.error('Contraseña incorrecta');
            setAdminPassword('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cedula) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/clock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cedula, action: actionType }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data.message, {
                    description: data.warning ? data.warning : `Hora registrada: ${new Date(data.time).toLocaleTimeString()}`,
                    duration: 5000,
                });
                setShowModal(false);
                setCedula('');
            } else {
                toast.error('Error al registrar', {
                    description: data.error,
                });
            }
        } catch (error) {
            toast.error('Error de conexión', {
                description: 'No se pudo conectar con el servidor.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            {/* Clock Display */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 z-10"
            >
                <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight font-mono">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h1>
                <p className="text-slate-400 text-xl mt-2 font-light">
                    {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </motion.div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl z-10">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAction('ENTRY')}
                    className="group relative overflow-hidden bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 text-left transition-all hover:bg-white/10 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/20"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <LogIn className="w-32 h-32 text-green-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors text-green-400">
                            <LogIn className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">HORA ENTRADA</h2>
                        <p className="text-slate-400 group-hover:text-slate-200 transition-colors">
                            Registra el inicio de tu jornada laboral
                        </p>
                    </div>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAction('EXIT')}
                    className="group relative overflow-hidden bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 text-left transition-all hover:bg-white/10 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <LogOut className="w-32 h-32 text-red-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors text-red-400">
                            <LogOut className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">HORA SALIDA</h2>
                        <p className="text-slate-400 group-hover:text-slate-200 transition-colors">
                            Registra el fin de tu jornada laboral
                        </p>
                    </div>
                </motion.button>
            </div>

            {/* Admin Link (Subtle) */}
            <div className="absolute bottom-6 text-slate-600 text-sm hover:text-slate-400 transition-colors cursor-pointer">
                <button onClick={() => { setShowAdminLogin(true); setAdminPassword(''); }} className="hover:underline">
                    Panel Administrativo
                </button>
            </div>

            {/* Clock Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {actionType === 'ENTRY' ? 'Registrar Entrada' : 'Registrar Salida'}
                                    </h3>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Número de Cédula</label>
                                        <input
                                            autoFocus
                                            type="text"
                                            required
                                            placeholder="Ingresa tu documento"
                                            className="w-full text-center text-2xl font-mono tracking-widest py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all text-gray-900"
                                            value={cedula}
                                            onChange={(e) => setCedula(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-lg ${actionType === 'ENTRY'
                                            ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30'
                                            : 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
                                            } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                Procesando...
                                            </>
                                        ) : (
                                            'Confirmar Registro'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Admin Login Modal */}
            <AnimatePresence>
                {showAdminLogin && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-xl">
                                            <Lock className="w-6 h-6 text-slate-700" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Administrador
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowAdminLogin(false)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleAdminLogin} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Contraseña de Acceso</label>
                                        <input
                                            autoFocus
                                            type="password"
                                            required
                                            placeholder="•••••"
                                            className="w-full text-center text-xl font-mono tracking-widest py-3 border-2 border-gray-200 rounded-xl focus:border-slate-800 focus:ring-4 focus:ring-slate-500/10 outline-none transition-all text-gray-900"
                                            value={adminPassword}
                                            onChange={(e) => setAdminPassword(e.target.value)}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                                    >
                                        Ingresar
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
