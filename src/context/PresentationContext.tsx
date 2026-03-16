'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';


// Import all default data
import referenceRatesDefault from '@/data/reference_rates.json';
import inflationRepoDefault from '@/data/inflation_repo_data.json';
import portfolioStockRatesDefault from '@/data/portfolio_stock_rates.json';
import disbursementRatesDefault from '@/data/disbursement_rates.json';
import monthlyDisbursementsDefault from '@/data/placement_amounts.json';
import portfolioBalanceByLineDefault from '@/data/portfolio_balance_by_line.json';
import benchmarkingConsumoHasta1Default from '@/data/benchmarking_consumo_hasta_1.json';
import benchmarkingConsumo1To3Default from '@/data/benchmarking_consumo_1_to_3.json';
import benchmarkingConsumo3To6Default from '@/data/benchmarking_consumo_3_to_6.json';
import benchmarkingConsumo6To12Default from '@/data/benchmarking_consumo_6_to_12.json';
import benchmarkingConsumo12To25Default from '@/data/benchmarking_consumo_12_to_25.json';
import benchmarkingConsumoTodosDefault from '@/data/benchmarking_consumo_todos.json';
import benchmarkingConsumoHasta1EneroDefault from '@/data/benchmarking_consumo_hasta_1_enero.json';
import benchmarkingConsumo1To3EneroDefault from '@/data/benchmarking_consumo_1_to_3_enero.json';
import benchmarkingConsumo3To6EneroDefault from '@/data/benchmarking_consumo_3_to_6_enero.json';
import benchmarkingConsumo6To12EneroDefault from '@/data/benchmarking_consumo_6_to_12_enero.json';
import benchmarkingConsumo12To25EneroDefault from '@/data/benchmarking_consumo_12_to_25_enero.json';
import benchmarkingConsumoTodosEneroDefault from '@/data/benchmarking_consumo_todos_enero.json';
import benchmarkingViviendaVisHasta20EneroDefault from '@/data/benchmarking_vivienda_vis_hasta_20_enero.json';
import benchmarkingViviendaVisSup20EneroDefault from '@/data/benchmarking_vivienda_vis_sup_20_enero.json';
import benchmarkingViviendaNoVisHasta20EneroDefault from '@/data/benchmarking_vivienda_no_vis_hasta_20_enero.json';
import benchmarkingViviendaNoVisSup20EneroDefault from '@/data/benchmarking_vivienda_no_vis_sup_20_enero.json';
import benchmarkingViviendaVisUvrHasta20EneroDefault from '@/data/benchmarking_vivienda_vis_uvr_hasta_20_enero.json';
import benchmarkingViviendaVisUvrSup20EneroDefault from '@/data/benchmarking_vivienda_vis_uvr_sup_20_enero.json';
import benchmarkingViviendaNoVisUvrHasta20EneroDefault from '@/data/benchmarking_vivienda_no_vis_uvr_hasta_20_enero.json';
import benchmarkingViviendaNoVisUvrSup20EneroDefault from '@/data/benchmarking_vivienda_no_vis_uvr_sup_20_enero.json';
import benchmarkingViviendaVisHasta20Default from '@/data/benchmarking_vivienda_vis_hasta_20.json';
import benchmarkingViviendaVisSup20Default from '@/data/benchmarking_vivienda_vis_sup_20.json';
import benchmarkingViviendaNoVisHasta20Default from '@/data/benchmarking_vivienda_no_vis_hasta_20.json';
import benchmarkingViviendaNoVisSup20Default from '@/data/benchmarking_vivienda_no_vis_sup_20.json';
import benchmarkingViviendaVisUvrHasta20Default from '@/data/benchmarking_vivienda_vis_uvr_hasta_20.json';
import benchmarkingViviendaVisUvrSup20Default from '@/data/benchmarking_vivienda_vis_uvr_sup_20.json';
import benchmarkingViviendaNoVisUvrHasta20Default from '@/data/benchmarking_vivienda_no_vis_uvr_hasta_20.json';
import benchmarkingViviendaNoVisUvrSup20Default from '@/data/benchmarking_vivienda_no_vis_uvr_sup_20.json';
import benchmarkingCreditsDefault from '@/data/benchmarking_credits.json';
import benchmarkingCreditsEneroDefault from '@/data/benchmarking_credits_enero.json';
import benchmarkingCDATsEneroDefault from '@/data/benchmarking_cdats_enero.json';
import totalLiabilitiesBalanceDefault from '@/data/total_liabilities_balance.json';
import earlyCancellationsDefault from '@/data/early_cancellations.json';
import tppCaptacionSaldosDefault from '@/data/tpp_captacion_saldos.json';
import benchmarkingCDATsDefault from '@/data/benchmarking_cdats.json';
import rateProposalDefault from '@/data/rate_proposal.json';
import fsgProposalDefault from '@/data/fsg_proposal.json';
import cdatProposalMainDefault from '@/data/cdat_proposal_benchmarking.json';
import cdatRateMatrixProposalDefault from '@/data/cdat_rate_matrix_proposal.json';
import historicalRatesV2Default from '@/data/historical_rates_v2.json';

const metadataDefault = {
    title: 'COMITÉ DE PRECIOS ENERO 2026',
    subtitle: 'Enero 2026'
};

const macroAnalysisDefault = [
    {
        title: "Salario Mínimo",
        phrase: "Salario a 2 millones exige captar liquidez inmediata.",
        iconType: "cash",
        color: "from-pink-500 to-rose-600"
    },
    {
        title: "Inflación",
        phrase: "Inflación 8%",
        iconType: "chart",
        color: "from-emerald-500 to-teal-600"
    },
    {
        title: "Tasas BanRep",
        phrase: "Tasa BanRep al 10,25% presiona márgenes de colocación.",
        iconType: "bank",
        color: "from-orange-500 to-amber-600"
    },
    {
        title: "Mercado Laboral",
        phrase: "Desempleo histórico del 8% reduce riesgo de crédito.",
        iconType: "users",
        color: "from-blue-500 to-indigo-600"
    },
    {
        title: "Proyección",
        phrase: "Crecimiento económico incentiva créditos de largo plazo.",
        iconType: "rocket",
        color: "from-violet-500 to-fuchsia-600"
    }
];

const ALL_DEFAULTS = {
    referenceRates: referenceRatesDefault,
    inflationRepo: inflationRepoDefault,
    portfolioStockRates: portfolioStockRatesDefault,
    disbursementRates: disbursementRatesDefault,
    monthlyDisbursements: monthlyDisbursementsDefault,
    portfolioBalanceByLine: portfolioBalanceByLineDefault,
    benchmarkingConsumoHasta1: benchmarkingConsumoHasta1Default,
    benchmarkingConsumo1To3: benchmarkingConsumo1To3Default,
    benchmarkingConsumo3To6: benchmarkingConsumo3To6Default,
    benchmarkingConsumo6To12: benchmarkingConsumo6To12Default,
    benchmarkingConsumo12To25: benchmarkingConsumo12To25Default,
    benchmarkingConsumoTodos: benchmarkingConsumoTodosDefault,
    benchmarkingConsumoHasta1Enero: benchmarkingConsumoHasta1EneroDefault,
    benchmarkingConsumo1To3Enero: benchmarkingConsumo1To3EneroDefault,
    benchmarkingConsumo3To6Enero: benchmarkingConsumo3To6EneroDefault,
    benchmarkingConsumo6To12Enero: benchmarkingConsumo6To12EneroDefault,
    benchmarkingConsumo12To25Enero: benchmarkingConsumo12To25EneroDefault,
    benchmarkingConsumoTodosEnero: benchmarkingConsumoTodosEneroDefault,
    benchmarkingViviendaVisHasta20Enero: benchmarkingViviendaVisHasta20EneroDefault,
    benchmarkingViviendaVisSup20Enero: benchmarkingViviendaVisSup20EneroDefault,
    benchmarkingViviendaNoVisHasta20Enero: benchmarkingViviendaNoVisHasta20EneroDefault,
    benchmarkingViviendaNoVisSup20Enero: benchmarkingViviendaNoVisSup20EneroDefault,
    benchmarkingViviendaVisUvrHasta20Enero: benchmarkingViviendaVisUvrHasta20EneroDefault,
    benchmarkingViviendaVisUvrSup20Enero: benchmarkingViviendaVisUvrSup20EneroDefault,
    benchmarkingViviendaNoVisUvrHasta20Enero: benchmarkingViviendaNoVisUvrHasta20EneroDefault,
    benchmarkingViviendaNoVisUvrSup20Enero: benchmarkingViviendaNoVisUvrSup20EneroDefault,
    benchmarkingViviendaVisHasta20: benchmarkingViviendaVisHasta20Default,
    benchmarkingViviendaVisSup20: benchmarkingViviendaVisSup20Default,
    benchmarkingViviendaNoVisHasta20: benchmarkingViviendaNoVisHasta20Default,
    benchmarkingViviendaNoVisSup20: benchmarkingViviendaNoVisSup20Default,
    benchmarkingViviendaVisUvrHasta20: benchmarkingViviendaVisUvrHasta20Default,
    benchmarkingViviendaVisUvrSup20: benchmarkingViviendaVisUvrSup20Default,
    benchmarkingViviendaNoVisUvrHasta20: benchmarkingViviendaNoVisUvrHasta20Default,
    benchmarkingViviendaNoVisUvrSup20: benchmarkingViviendaNoVisUvrSup20Default,
    benchmarkingCredits: benchmarkingCreditsDefault,
    benchmarkingCreditsEnero: benchmarkingCreditsEneroDefault,
    totalLiabilitiesBalance: totalLiabilitiesBalanceDefault,
    earlyCancellations: earlyCancellationsDefault,
    tppCaptacionSaldos: tppCaptacionSaldosDefault,
    benchmarkingCDATs: benchmarkingCDATsDefault,
    benchmarkingCDATsEnero: benchmarkingCDATsEneroDefault,
    rateProposal: rateProposalDefault,
    fsgProposal: fsgProposalDefault,
    cdatProposalMain: cdatProposalMainDefault,
    cdatRateMatrixProposal: cdatRateMatrixProposalDefault,
    historicalRatesV2: historicalRatesV2Default,
    metadata: metadataDefault,
    macroAnalysis: macroAnalysisDefault,
};

type PresentationData = typeof ALL_DEFAULTS;

interface PresentationContextType {
    data: PresentationData;
    updateSection: (section: keyof PresentationData, newData: any) => void;
    resetData: () => void;
    isLoading: boolean;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export function PresentationProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<PresentationData>(ALL_DEFAULTS);
    const [isLoading, setIsLoading] = useState(true);

    // Load initial state from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('presentation_data_v2');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error('Error parsing local storage data', e);
            }
        }
        setIsLoading(false);
    }, []);

    // Update section and sync to LocalStorage
    const updateSection = useCallback((section: keyof PresentationData, newData: any) => {
        setData(prev => {
            const updated = { ...prev, [section]: newData };
            localStorage.setItem('presentation_data_v2', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const resetData = useCallback(() => {
        if (confirm('¿Estás seguro de restablecer todos los datos a los valores iniciales?')) {
            localStorage.removeItem('presentation_data_v2');
            setData(ALL_DEFAULTS);
            window.location.reload();
        }
    }, []);

    return (
        <PresentationContext.Provider value={{ data, updateSection, resetData, isLoading }}>
            {children}
        </PresentationContext.Provider>
    );
}

export const usePresentation = () => {
    const context = useContext(PresentationContext);
    if (!context) throw new Error('usePresentation must be used within a PresentationProvider');
    return context;
};
