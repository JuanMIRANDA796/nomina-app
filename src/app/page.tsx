'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

import { usePresentation } from '@/context/PresentationContext';
import { toast } from 'sonner';

export default function PresentationPage() {
  const { saveSnapshot, isLoading } = usePresentation();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const id = await saveSnapshot();
      const url = `${window.location.origin}/?id=${id}`;
      await navigator.clipboard.writeText(url);
      toast.success('¡Enlace de compartir copiado al portapapeles!', {
        description: 'Cualquier persona con este link verá la presentación con tus cambios actuales.',
        duration: 5000,
      });
    } catch (error) {
      toast.error('Error al generar el enlace');
    } finally {
      setIsSharing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">Cargando datos personalizados...</p>
      </div>
    );
  }

  return (
    <main className="snap-y snap-mandatory h-screen w-full overflow-y-scroll bg-slate-950 text-white scroll-smooth selection:bg-pink-500 selection:text-white">

      {/* Share Button Floating */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="group relative flex items-center gap-2 px-6 py-3 bg-white text-slate-950 rounded-full font-bold shadow-2xl hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSharing ? (
            <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0-10.628a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5m0 0c.18-.324.283-.696.283-1.093s-.103-.77-.283-1.093m0 2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0-10.628a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0 4.5" />
            </svg>
          )}
          <span>{isSharing ? 'Generando...' : 'Compartir con cambios'}</span>

          <div className="absolute -top-12 right-0 bg-slate-800 text-white text-[10px] px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
            Crea un link único con tus ediciones
          </div>
        </button>
      </div>

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

    </main>
  );
}
