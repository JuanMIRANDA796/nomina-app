'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ChevronRight, CheckCircle2, ShieldCheck, BarChart3, Clock, X, Lock, User } from 'lucide-react';
import Head from 'next/head';

export default function LandingPage() {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay for effect
    setTimeout(() => {
      if (username === 'Juan' && password === '123') {
        localStorage.setItem('demo_auth', 'true');
        toast.success('Bienvenido de nuevo, Juan');
        router.push('/clock');
      } else {
        toast.error('Credenciales incorrectas', {
          description: 'Intenta con Juan / 123 (Demo)'
        });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#0f1014] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-5 md:px-12 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm md:backdrop-blur-none transition-all">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white tracking-tight">
            NóminaApp
          </span>
        </div>
        <button
          onClick={() => setShowLogin(true)}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-lg shadow-blue-900/20 text-sm md:text-base border border-blue-500/50"
        >
          Iniciar Sesión
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Video/Image Placeholders */}
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
            className="pt-8"
          >
            <button
              onClick={() => setShowLogin(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-xl font-bold text-white shadow-2xl shadow-blue-900/40 hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              Comienza Ahora
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-[#0f1014] to-[#16181d]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <span className="text-blue-500 font-bold tracking-widest text-sm uppercase">Beneficios Exclusivos</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Potencia tu Organización</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                <ShieldCheck className="w-8 h-8 text-blue-400 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Seguridad Jurídica</h3>
              <p className="text-gray-400 leading-relaxed">
                Cumplimiento automático de la normativa laboral colombiana. Evita sanciones y mantén tu empresa protegida legalmente.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:bg-indigo-500 transition-colors">
                <Clock className="w-8 h-8 text-indigo-400 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Eficiencia Total</h3>
              <p className="text-gray-400 leading-relaxed">
                Reduce el tiempo de gestión de nómina en un 80%. Automatiza cálculos, horas extras y prestaciones sociales al instante.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
                <BarChart3 className="w-8 h-8 text-purple-400 group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Reportes en Tiempo Real</h3>
              <p className="text-gray-400 leading-relaxed">
                Toma decisiones informadas con tableros de control avanzados. Visualiza costos, asistencia y tendencias de tu equipo.
              </p>
            </motion.div>
          </div>
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
                  <h2 className="text-3xl font-bold text-white mb-2">Bienvenido</h2>
                  <p className="text-gray-400 text-sm">Ingresa a tu portal empresarial</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        placeholder="Usuario (Juan)"
                        className="w-full bg-[#0f1014] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="password"
                        placeholder="Contraseña (123)"
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
                      "Ingresar"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    ¿Olvidaste tu contraseña? <span className="text-blue-400 hover:underline cursor-pointer">Recuperar acceso</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
