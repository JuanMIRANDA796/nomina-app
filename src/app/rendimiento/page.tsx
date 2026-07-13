'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Flame, Skull, Calculator, Clock, ChevronDown, CheckCircle2, AlertTriangle, XCircle, TrendingUp, TrendingDown, Info, DollarSign, Percent, ArrowRight } from 'lucide-react';

// Reusable Components
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl ${className}`}>
    {children}
  </div>
);

const SlideContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <section className={`snap-start w-full h-screen flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden ${className}`}>
    {children}
  </section>
);

// Slide 1: Quién ganó más
const Slide1 = () => {
  const investors = [
    { name: "Juan", amount: 5000000, emoji: "👨" },
    { name: "María", amount: 2000000, emoji: "👩" },
    { name: "Pedro", amount: 800000, emoji: "🧑" },
  ];

  return (
    <SlideContainer className="bg-slate-950">
      <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-4 bg-yellow-500/10 rounded-full mb-6">
          <Trophy className="w-12 h-12 text-yellow-500" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600 mb-6 tracking-tight">
          ¿QUIÉN GANÓ MÁS EL AÑO PASADO?
        </h1>
        <p className="text-2xl text-slate-400 font-light">
          Tres amigos invirtieron en 2024. Esto es lo que ganaron:
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {investors.map((inv, idx) => (
          <motion.div
            key={inv.name}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.5, type: "spring" }}
            whileHover={{ scale: 1.05, translateY: -10 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
            <GlassCard className="relative h-full flex flex-col items-center justify-center text-center group-hover:border-pink-500/50 transition-colors">
              <span className="text-6xl mb-6 block">{inv.emoji}</span>
              <h3 className="text-3xl font-bold text-white mb-4">{inv.name}</h3>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600">
                ${inv.amount.toLocaleString('es-CO')}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-16 text-center"
      >
        <p className="text-3xl text-white font-medium mb-4">¿Quién es el mejor inversionista?</p>
        <p className="text-xl text-pink-400 animate-pulse">(Levanta la mano por tu favorito)</p>
      </motion.div>
    </SlideContainer>
  );
};

// Slide 2: La información completa
const Slide2 = () => {
  const data = [
    { name: "Juan", cap: 100000000, gan: 5000000, ren: 5 },
    { name: "María", cap: 20000000, gan: 2000000, ren: 10 },
    { name: "Pedro", cap: 4000000, gan: 800000, ren: 20 },
  ];

  return (
    <SlideContainer className="bg-slate-950">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="w-full max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <Target className="w-10 h-10 text-pink-500" />
          <h2 className="text-4xl font-bold text-white">LA INFORMACIÓN COMPLETA</h2>
        </div>

        <GlassCard className="mb-12 overflow-hidden p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="p-6 text-xl text-slate-300 font-semibold border-b border-white/10">Persona</th>
                <th className="p-6 text-xl text-slate-300 font-semibold border-b border-white/10 text-right">Capital Invertido</th>
                <th className="p-6 text-xl text-slate-300 font-semibold border-b border-white/10 text-right">Ganancia</th>
                <th className="p-6 text-xl text-pink-400 font-bold border-b border-white/10 text-center">Rendimiento</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <motion.tr
                  key={row.name}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="p-6 text-2xl font-bold text-white border-b border-white/5">{row.name}</td>
                  <td className="p-6 text-2xl text-slate-300 font-mono text-right border-b border-white/5">
                    ${row.cap.toLocaleString('es-CO')}
                  </td>
                  <td className="p-6 text-2xl text-green-400 font-mono text-right border-b border-white/5">
                    ${row.gan.toLocaleString('es-CO')}
                  </td>
                  <td className="p-6 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 text-center border-b border-white/5">
                    {row.ren}%
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <GlassCard className="h-full border-l-4 border-l-orange-500">
              <p className="text-2xl text-slate-300 leading-relaxed">
                <strong className="text-white">Juan</strong> invirtió 25 veces más que Pedro,<br/>
                pero <strong className="text-orange-400">Pedro</strong> fue 4 veces más eficiente.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
            <GlassCard className="h-full bg-gradient-to-br from-pink-500/10 to-orange-500/10 border-pink-500/30">
              <div className="flex items-start gap-4">
                <span className="text-4xl block">💡</span>
                <div>
                  <h4 className="text-xl font-bold text-pink-400 mb-2">Regla #1</h4>
                  <p className="text-2xl font-medium text-white">
                    En inversiones, el tamaño no importa. <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">Importa la eficiencia.</span>
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </SlideContainer>
  );
};

// Slide 3: Falta un dato
const Slide3 = () => {
  const [showTimer, setShowTimer] = useState(false);

  return (
    <SlideContainer className="bg-slate-950 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-slate-950 pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="text-center z-10 max-w-5xl">
        <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-full mb-8">
          <Flame className="w-16 h-16 text-red-500" />
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black text-white mb-12 tracking-tight">
          PERO FALTA UN <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">DATO CRUCIAL...</span>
        </h2>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <p className="text-3xl text-slate-300 mb-6">La inflación de Colombia en 2024 fue del</p>
          <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 drop-shadow-2xl">
            5,2%
          </div>
          <p className="text-lg text-slate-500 mt-4">(Fuente: DANE)</p>
        </motion.div>

        <GlassCard className="mb-12 border-red-500/20 bg-red-500/5 max-w-3xl mx-auto text-left">
          <p className="text-2xl text-slate-300 leading-relaxed">
            Eso significa que las cosas que costaban <strong className="text-white">$100.000</strong> al inicio del año, 
            al final del año costaban <strong className="text-red-400">$105.200</strong>.
          </p>
          <div className="mt-6 p-4 bg-red-500/20 rounded-xl border border-red-500/30">
            <p className="text-2xl font-bold text-center text-red-200">
              Tu plata vale menos cada año que pasa.
            </p>
          </div>
        </GlassCard>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <h3 className="text-4xl font-bold text-white mb-8">¿Quién <span className="text-pink-500 underline decoration-wavy decoration-pink-500/50">REALMENTE</span> ganó?</h3>
          
          {!showTimer ? (
            <button 
              onClick={() => setShowTimer(true)}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-bold text-xl transition-all hover:scale-105 border border-white/20"
            >
              🤔 Iniciar tiempo para pensar
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-2xl text-slate-400">Piensen 30 segundos...</p>
              <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 30, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-pink-500 to-orange-500"
                />
              </div>
            </div>
          )}
        </motion.div>

      </motion.div>
    </SlideContainer>
  );
};

// Slide 4: Rendimiento Real
const Slide4 = () => {
  const data = [
    { name: "Juan", nom: 5, inf: 5.2, real: -0.2, veredicto: "😞 Perdió poder", color: "text-red-500", bg: "bg-red-500/10" },
    { name: "María", nom: 10, inf: 5.2, real: 4.6, veredicto: "😐 Ganó moderadamente", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { name: "Pedro", nom: 20, inf: 5.2, real: 14.1, veredicto: "🚀 Ganó de verdad", color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <SlideContainer className="bg-slate-950">
      <div className="w-full max-w-7xl flex flex-col items-center">
        <div className="flex items-center gap-4 mb-12">
          <Skull className="w-12 h-12 text-slate-400" />
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">LA VERDAD DEL RENDIMIENTO REAL</h2>
        </div>

        <GlassCard className="w-full mb-8 p-0 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/80">
                <th className="p-6 text-lg text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">Persona</th>
                <th className="p-6 text-lg text-slate-400 font-bold uppercase tracking-wider border-b border-white/10 text-center">Nominal</th>
                <th className="p-6 text-lg text-slate-400 font-bold uppercase tracking-wider border-b border-white/10 text-center">Inflación</th>
                <th className="p-6 text-lg text-white font-black uppercase tracking-wider border-b border-white/10 text-center bg-white/5">Real</th>
                <th className="p-6 text-lg text-slate-400 font-bold uppercase tracking-wider border-b border-white/10">Veredicto</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <motion.tr
                  key={row.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.3 }}
                  className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                >
                  <td className="p-6 text-2xl font-bold text-white">{row.name}</td>
                  <td className="p-6 text-2xl font-mono text-center text-slate-300">{row.nom}%</td>
                  <td className="p-6 text-2xl font-mono text-center text-red-400">{row.inf}%</td>
                  <td className={`p-6 text-3xl font-black font-mono text-center ${row.color} bg-white/5`}>
                    {row.real > 0 ? '+' : ''}{row.real}%
                  </td>
                  <td className="p-6">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${row.bg} ${row.color}`}>
                      {row.veredicto}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <GlassCard className="flex flex-col justify-center">
            <h4 className="text-xl font-bold text-slate-400 mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" /> Cálculo exacto (Ecuación de Fisher)
            </h4>
            <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 font-mono text-xl text-center shadow-inner">
              <span className="text-pink-400">r_real</span> = <span className="text-slate-300">(1 + r_nom) / (1 + inflación) - 1</span>
            </div>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed border-l-4 border-slate-500 pl-4">
              Juan ganó $5 millones de pesos en su cuenta...<br/>
              <strong className="text-red-400">pero su plata compra MENOS cosas que hace un año.</strong>
            </p>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-pink-600/20 to-purple-600/20 border-pink-500/30 flex flex-col justify-center">
            <div className="flex gap-4">
              <span className="text-5xl block">💡</span>
              <div>
                <h4 className="text-2xl font-bold text-pink-400 mb-3">Regla #2</h4>
                <p className="text-3xl font-black text-white leading-tight">
                  Ganar <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">nominalmente</span> no es ganar <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">realmente</span>.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </SlideContainer>
  );
};

// Slide 5: Las 3 Preguntas
const Slide5 = () => {
  return (
    <SlideContainer className="bg-slate-950">
      <div className="w-full max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-16 uppercase tracking-tight">
          LAS 3 PREGUNTAS QUE TODO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">INVERSIONISTA</span> DEBE HACERSE
        </h2>

        <div className="space-y-8">
          {/* Question 1 */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <GlassCard className="relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 ml-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold">1</span>
                    <h3 className="text-2xl font-bold text-white">¿Cuánto gané en pesos?</h3>
                  </div>
                  <div className="mt-4 bg-slate-950/50 p-4 rounded-xl border border-white/5 font-mono text-lg text-slate-300 inline-block">
                    Ganancia = V_Final − V_Inicial
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                  <span className="text-xl font-bold text-blue-400">Rendimiento Absoluto</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Question 2 */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard className="relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 ml-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">2</span>
                    <h3 className="text-2xl font-bold text-white">¿Cuánto gané en %?</h3>
                  </div>
                  <div className="mt-4 bg-slate-950/50 p-4 rounded-xl border border-white/5 font-mono text-lg text-slate-300 inline-block">
                    r_nom = (V_Final − V_Inicial) / V_Inicial
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                  <Percent className="w-6 h-6 text-emerald-400" />
                  <span className="text-xl font-bold text-emerald-400">Rendimiento Nominal</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Question 3 */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <GlassCard className="relative overflow-hidden group bg-gradient-to-r from-pink-500/5 to-orange-500/5 border-pink-500/20">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-pink-500 to-orange-500"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 ml-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 font-bold">3</span>
                    <h3 className="text-2xl font-bold text-white">¿Cuánto gané DE VERDAD?</h3>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5 font-mono text-lg text-slate-300 inline-block">
                      r_real = [(1 + r_nominal) / (1 + inflación)] − 1
                    </div>
                    <div className="text-sm text-slate-500 font-mono ml-2">
                      Aprox. rápida: r_real ≈ r_nominal − inflación
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-2xl border border-pink-500/30 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                  <Flame className="w-6 h-6 text-pink-400" />
                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">Rendimiento Real</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-8 flex items-start gap-4 p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
          <AlertTriangle className="w-8 h-8 text-yellow-500 shrink-0" />
          <p className="text-lg text-slate-300">
            <strong className="text-white">En la plantilla de Excel las fórmulas ya están listas.</strong><br/>
            Aquí no se memoriza, se entiende y se usa.
          </p>
        </motion.div>
      </div>
    </SlideContainer>
  );
};

// Slide 6: Reto Rápido
const Slide6 = () => {
  const [revealed, setRevealed] = useState(0);

  const steps = [
    { label: "1. Rendimiento absoluto (en pesos)", value: "-$560.000", color: "text-red-400" },
    { label: "2. Rendimiento nominal (%)", value: "-22,4%", color: "text-red-400" },
    { label: "3. Rendimiento real (%)", value: "-26,23%", color: "text-red-500 font-black text-3xl" },
  ];

  return (
    <SlideContainer className="bg-slate-950">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Context */}
        <div>
          <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-pink-500/10 rounded-full border border-pink-500/20 mb-6 text-pink-400 font-bold uppercase tracking-wider">
              <Clock className="w-5 h-5" /> Reto de 90 segundos
            </div>
            <h2 className="text-5xl font-black text-white mb-4">RETO RÁPIDO</h2>
            <p className="text-2xl text-slate-400">Caso real: Acción de Ecopetrol durante 2024</p>
          </motion.div>

          <GlassCard className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-sm text-slate-400">Enero 2024</p>
                  <p className="text-xl font-bold text-white">Compraste por</p>
                </div>
              </div>
              <span className="text-2xl font-mono font-bold text-slate-300">$2.500.000</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <p className="text-sm text-slate-400">Diciembre 2024</p>
                  <p className="text-xl font-bold text-white">Vendiste por</p>
                </div>
              </div>
              <span className="text-2xl font-mono font-bold text-slate-300">$1.940.000</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-red-400" />
                <p className="text-xl font-bold text-red-200">Inflación 2024 (DANE)</p>
              </div>
              <span className="text-2xl font-mono font-bold text-red-400">5,2%</span>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Calculator / Answers */}
        <div className="flex flex-col justify-center">
          <GlassCard className="h-full flex flex-col border-pink-500/20 bg-gradient-to-b from-slate-900/50 to-slate-900/80">
            <h3 className="text-2xl font-bold text-white mb-8">Calculen en la plantilla:</h3>
            
            <div className="space-y-6 flex-1">
              {steps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="flex flex-col gap-2">
                    <p className="text-xl text-slate-300 font-medium">{step.label}</p>
                    <AnimatePresence mode="wait">
                      {revealed > idx ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className={`p-4 bg-slate-950/50 rounded-xl border border-white/5 font-mono text-2xl ${step.color}`}
                        >
                          {step.value}
                        </motion.div>
                      ) : (
                        <div className="h-16 flex items-center justify-center bg-slate-800/30 rounded-xl border border-white/5 border-dashed">
                          <span className="text-slate-600 font-mono">???</span>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setRevealed(prev => Math.min(prev + 1, steps.length + 1))}
              disabled={revealed >= steps.length + 1}
              className={`mt-8 w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2
                ${revealed >= steps.length + 1 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-500/25 hover:scale-[1.02]'}`}
            >
              {revealed >= steps.length + 1 ? 'Análisis Completado' : 'Revelar Siguiente Dato'} <ArrowRight className="w-5 h-5" />
            </button>
            
            <AnimatePresence>
              {revealed >= steps.length + 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-center"
                >
                  <p className="text-2xl font-black text-red-400 uppercase tracking-wider mb-2">PÉSIMA INVERSIÓN 💀</p>
                  <p className="text-slate-300">No solo perdió valor nominal, sino que la inflación destruyó aún más el poder adquisitivo de ese dinero.</p>
                </motion.div>
              )}
            </AnimatePresence>

          </GlassCard>
        </div>

      </div>
    </SlideContainer>
  );
};

export default function RendimientoRealPresentation() {
  return (
    <main className="snap-y snap-mandatory h-screen w-full overflow-y-scroll bg-slate-950 text-white scroll-smooth selection:bg-pink-500 selection:text-white">
      <title>Rendimiento Real - Presentación</title>
      
      {/* Intro Cover */}
      <section className="snap-start w-full h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#1a1c29] via-[#0f172a] to-[#020617] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.15)_0%,rgba(0,0,0,0)_50%)] animate-[spin_60s_linear_infinite]" />
        </div>
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative z-10 text-center max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 mb-8 tracking-tighter">
            EL MITO DEL RENDIMIENTO
          </h1>
          <p className="text-2xl md:text-3xl text-slate-300 font-light mb-12">
            Por qué ganar plata no significa ser más rico.
          </p>
          <div className="animate-bounce text-slate-500 mt-16">
            <ChevronDown className="w-12 h-12 mx-auto" />
          </div>
        </motion.div>
      </section>

      <Slide1 />
      <Slide2 />
      <Slide3 />
      <Slide4 />
      <Slide5 />
      <Slide6 />

      {/* Progress Bar globally over presentation */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-900 z-50">
        <div className="h-full bg-gradient-to-r from-pink-500 to-orange-500 w-full animate-pulse opacity-50" />
      </div>
    </main>
  );
}
