'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePresentation } from '@/context/PresentationContext';
import ReferenceRatesChart from '@/components/presentation/ReferenceRatesChart';
import InflationVsRepoChart from '@/components/presentation/InflationVsRepoChart';
import PortfolioStockRatesChart from '@/components/presentation/PortfolioStockRatesChart';
import DisbursementRatesChart from '@/components/presentation/DisbursementRatesChart';
import MonthlyDisbursementsChart from '@/components/presentation/MonthlyDisbursementsChart';
import PortfolioBalanceByLineChart from '@/components/presentation/PortfolioBalanceByLineChart';
import BenchmarkingConsumoHasta1Chart from '@/components/presentation/BenchmarkingConsumoHasta1Chart';
import BenchmarkingConsumo1To3Chart from '@/components/presentation/BenchmarkingConsumo1To3Chart';
import BenchmarkingConsumo3To6Chart from '@/components/presentation/BenchmarkingConsumo3To6Chart';
import BenchmarkingConsumo6To12Chart from '@/components/presentation/BenchmarkingConsumo6To12Chart';
import BenchmarkingConsumo12To25Chart from '@/components/presentation/BenchmarkingConsumo12To25Chart';
import BenchmarkingConsumoTodosChart from '@/components/presentation/BenchmarkingConsumoTodosChart';
import BenchmarkingViviendaVisHasta20Chart from '@/components/presentation/BenchmarkingViviendaVisHasta20Chart';
import BenchmarkingViviendaVisSup20Chart from '@/components/presentation/BenchmarkingViviendaVisSup20Chart';
import BenchmarkingViviendaNoVisHasta20Chart from '@/components/presentation/BenchmarkingViviendaNoVisHasta20Chart';
import BenchmarkingViviendaNoVisSup20Chart from '@/components/presentation/BenchmarkingViviendaNoVisSup20Chart';
import BenchmarkingViviendaVisUvrHasta20Chart from '@/components/presentation/BenchmarkingViviendaVisUvrHasta20Chart';
import BenchmarkingViviendaVisUvrSup20Chart from '@/components/presentation/BenchmarkingViviendaVisUvrSup20Chart';
import BenchmarkingViviendaNoVisUvrHasta20Chart from '@/components/presentation/BenchmarkingViviendaNoVisUvrHasta20Chart';
import BenchmarkingViviendaNoVisUvrSup20Chart from '@/components/presentation/BenchmarkingViviendaNoVisUvrSup20Chart';
import BenchmarkingCreditsTable from '@/components/presentation/BenchmarkingCreditsTable';
import BenchmarkingCDATsTable from '@/components/presentation/BenchmarkingCDATsTable';
import RateProposalTables from '@/components/presentation/RateProposalTables';
import FSGProposalTable from '@/components/presentation/FSGProposalTable';
import EarlyCancellationsChart from '@/components/presentation/EarlyCancellationsChart';
import TotalLiabilitiesBalanceChart from '@/components/presentation/TotalLiabilitiesBalanceChart';
import TPPCaptacionSaldosChart from '@/components/presentation/TPPCaptacionSaldosChart';
import MacroeconomicAnalysisSlide from '@/components/presentation/MacroeconomicAnalysisSlide';

export default function PresentationPage() {
  const { resetData, isLoading } = usePresentation();

  if (isLoading) return (
    <div className="w-full h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white text-2xl font-bold animate-pulse">Cargando Presentación...</div>
    </div>
  );

  return (
    <main className="snap-y snap-mandatory h-screen w-full overflow-y-scroll bg-slate-950 text-white scroll-smooth selection:bg-pink-500 selection:text-white">

      {/* COVER SLIDE */}
      <section className="snap-start w-full h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#D4145A] via-[#E91E63] to-[#FBB03B]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full max-w-3xl flex flex-col items-center"
        >
          <div className="relative w-96 h-48 md:w-[600px] md:h-[300px]">
            <img
              src="/logo-presente.png"
              alt="Presente Fondo de Empleados"
              className="object-contain w-full h-full drop-shadow-xl"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-light tracking-widest text-white/90 uppercase">
              Comité de Precios
            </h2>
            <p className="text-xl text-white/80 mt-2 font-medium">
              Diciembre 2025
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-12 text-white/80"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </motion.div>
      </section>

      {/* FINANCIAL TRENDS */}
      <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl">
          <ReferenceRatesChart />
        </motion.div>
      </section>

      <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 0 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full h-full">
          <MacroeconomicAnalysisSlide />
        </motion.div>
      </section>

      {[InflationVsRepoChart, PortfolioStockRatesChart, DisbursementRatesChart, MonthlyDisbursementsChart, PortfolioBalanceByLineChart].map((Chart, i) => (
        <section key={`fin-${i}`} className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl">
            <Chart />
          </motion.div>
        </section>
      ))}

      {/* BENCHMARKING CONSUMO */}
      {[BenchmarkingConsumoHasta1Chart, BenchmarkingConsumo1To3Chart, BenchmarkingConsumo3To6Chart, BenchmarkingConsumo6To12Chart, BenchmarkingConsumo12To25Chart, BenchmarkingConsumoTodosChart].map((Chart, i) => (
        <section key={`cons-${i}`} className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl">
            <Chart />
          </motion.div>
        </section>
      ))}

      {/* BENCHMARKING VIVIENDA PESOS */}
      {[BenchmarkingViviendaVisHasta20Chart, BenchmarkingViviendaVisSup20Chart, BenchmarkingViviendaNoVisHasta20Chart, BenchmarkingViviendaNoVisSup20Chart].map((Chart, i) => (
        <section key={`viv-p-${i}`} className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
          <motion.div initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl">
            <Chart />
          </motion.div>
        </section>
      ))}

      {/* BENCHMARKING VIVIENDA UVR */}
      {[BenchmarkingViviendaVisUvrHasta20Chart, BenchmarkingViviendaVisUvrSup20Chart, BenchmarkingViviendaNoVisUvrHasta20Chart, BenchmarkingViviendaNoVisUvrSup20Chart].map((Chart, i) => (
        <section key={`viv-u-${i}`} className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
          <motion.div initial={{ opacity: 0, y: i % 2 === 0 ? 50 : -50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl">
            <Chart />
          </motion.div>
        </section>
      ))}

      {/* BENCHMARKING TABLES */}
      <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="w-full max-w-[90rem] h-[85vh]">
          <BenchmarkingCreditsTable />
        </motion.div>
      </section>

      <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl">
          <TotalLiabilitiesBalanceChart />
        </motion.div>
      </section>

      <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl">
          <EarlyCancellationsChart />
        </motion.div>
      </section>

      <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl">
          <TPPCaptacionSaldosChart />
        </motion.div>
      </section>

      <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="w-full max-w-[90rem] h-[85vh]">
          <BenchmarkingCDATsTable />
        </motion.div>
      </section>

      {/* PROPOSALS */}
      <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-[90rem] h-[85vh]">
          <RateProposalTables />
        </motion.div>
      </section>

      <section className="snap-start w-full h-screen flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-7xl h-[85vh]">
          <FSGProposalTable />
        </motion.div>
      </section>

      {/* FLOATING RESET BUTTON */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <button
          onClick={resetData}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-white/10 transition-colors text-xs font-medium backdrop-blur-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Restablecer Datos
        </button>
      </div>

    </main>
  );
}
