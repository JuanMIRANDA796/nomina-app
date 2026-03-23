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
import benchmarkingConsumoHasta1FebreroDefault from '@/data/benchmarking_consumo_hasta_1_febrero.json';
import benchmarkingConsumo1To3FebreroDefault from '@/data/benchmarking_consumo_1_to_3_febrero.json';
import benchmarkingConsumo3To6FebreroDefault from '@/data/benchmarking_consumo_3_to_6_febrero.json';
import benchmarkingConsumo6To12FebreroDefault from '@/data/benchmarking_consumo_6_to_12_febrero.json';
import benchmarkingConsumo12To25FebreroDefault from '@/data/benchmarking_consumo_12_to_25_febrero.json';
import benchmarkingConsumoTodosFebreroDefault from '@/data/benchmarking_consumo_todos_febrero.json';
import benchmarkingViviendaVisHasta20EneroDefault from '@/data/benchmarking_vivienda_vis_hasta_20_enero.json';
import benchmarkingViviendaVisSup20EneroDefault from '@/data/benchmarking_vivienda_vis_sup_20_enero.json';
import benchmarkingViviendaNoVisHasta20EneroDefault from '@/data/benchmarking_vivienda_no_vis_hasta_20_enero.json';
import benchmarkingViviendaNoVisSup20EneroDefault from '@/data/benchmarking_vivienda_no_vis_sup_20_enero.json';
import benchmarkingViviendaVisUvrHasta20EneroDefault from '@/data/benchmarking_vivienda_vis_uvr_hasta_20_enero.json';
import benchmarkingViviendaVisUvrSup20EneroDefault from '@/data/benchmarking_vivienda_vis_uvr_sup_20_enero.json';
import benchmarkingViviendaNoVisUvrHasta20EneroDefault from '@/data/benchmarking_vivienda_no_vis_uvr_hasta_20_enero.json';
import benchmarkingViviendaNoVisUvrSup20EneroDefault from '@/data/benchmarking_vivienda_no_vis_uvr_sup_20_enero.json';
import benchmarkingViviendaVisHasta20FebreroDefault from '@/data/benchmarking_vivienda_vis_hasta_20_febrero.json';
import benchmarkingViviendaVisSup20FebreroDefault from '@/data/benchmarking_vivienda_vis_sup_20_febrero.json';
import benchmarkingViviendaNoVisHasta20FebreroDefault from '@/data/benchmarking_vivienda_no_vis_hasta_20_febrero.json';
import benchmarkingViviendaNoVisSup20FebreroDefault from '@/data/benchmarking_vivienda_no_vis_sup_20_febrero.json';
import benchmarkingViviendaVisUvrHasta20FebreroDefault from '@/data/benchmarking_vivienda_vis_uvr_hasta_20_febrero.json';
import benchmarkingViviendaVisUvrSup20FebreroDefault from '@/data/benchmarking_vivienda_vis_uvr_sup_20_febrero.json';
import benchmarkingViviendaNoVisUvrHasta20FebreroDefault from '@/data/benchmarking_vivienda_no_vis_uvr_hasta_20_febrero.json';
import benchmarkingViviendaNoVisUvrSup20FebreroDefault from '@/data/benchmarking_vivienda_no_vis_uvr_sup_20_febrero.json';
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
import benchmarkingCreditsFebreroDefault from '@/data/benchmarking_credits_febrero.json';
import benchmarkingCDATsEneroDefault from '@/data/benchmarking_cdats_enero.json';
import benchmarkingCDATsFebreroDefault from '@/data/benchmarking_cdats_febrero.json';
import totalLiabilitiesBalanceDefault from '@/data/total_liabilities_balance.json';
import earlyCancellationsDefault from '@/data/early_cancellations.json';
import tppCaptacionSaldosDefault from '@/data/tpp_captacion_saldos.json';
import benchmarkingCDATsDefault from '@/data/benchmarking_cdats.json';
import rateProposalDefault from '@/data/rate_proposal.json';
import fsgProposalDefault from '@/data/fsg_proposal.json';
import cdatProposalMainDefault from '@/data/cdat_proposal_benchmarking.json';
import cdatRateMatrixProposalDefault from '@/data/cdat_rate_matrix_proposal.json';
import historicalRatesV2Default from '@/data/historical_rates_v2.json';
import creditRateProposalsDefault from '@/data/credit_rate_proposal_data.json';
import benchmarkingSummaryTableDefault from '@/data/benchmarking_summary_table.json';

const metadataDefault = {
    title: 'COMITÉ DE PRECIOS FEBRERO 2026',
    subtitle: 'Febrero 2026'
};

const macroAnalysisDefault = [
    "El panorama macroeconómico de Colombia atraviesa un momento **restrictivo y de cautela**, originado por un repunte de la inflación al 5,35% que obligó al Banco de la República a elevar la tasa REPO al 10,25% para frenar el alza de precios.",
    "Este **encarecimiento** del crédito privado se enlaza con una profunda preocupación de los mercados frente a un déficit fiscal que podría rondar el 6,7%, dada la falta de claridad en los recortes de gasto público.",
    "Como resultado de esta incertidumbre, la deuda del Gobierno es vista como más **riesgosa**, disparando los rendimientos de los TES por encima del 13,8% y comprometiendo el presupuesto de la nación.",
    "Todo este cóctel de **altas tasas**, crédito caro e incertidumbre fiscal amenaza con frenar la inversión, poniendo en riesgo la actual resiliencia del desempleo, que por ahora se ubica en un 10,9%, pero que enfrenta un horizonte bastante complejo."
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
    benchmarkingConsumoHasta1Febrero: benchmarkingConsumoHasta1FebreroDefault,
    benchmarkingConsumo1To3Febrero: benchmarkingConsumo1To3FebreroDefault,
    benchmarkingConsumo3To6Febrero: benchmarkingConsumo3To6FebreroDefault,
    benchmarkingConsumo6To12Febrero: benchmarkingConsumo6To12FebreroDefault,
    benchmarkingConsumo12To25Febrero: benchmarkingConsumo12To25FebreroDefault,
    benchmarkingConsumoTodosFebrero: benchmarkingConsumoTodosFebreroDefault,
    benchmarkingViviendaVisHasta20Enero: benchmarkingViviendaVisHasta20EneroDefault,
    benchmarkingViviendaVisSup20Enero: benchmarkingViviendaVisSup20EneroDefault,
    benchmarkingViviendaNoVisHasta20Enero: benchmarkingViviendaNoVisHasta20EneroDefault,
    benchmarkingViviendaNoVisSup20Enero: benchmarkingViviendaNoVisSup20EneroDefault,
    benchmarkingViviendaVisUvrHasta20Enero: benchmarkingViviendaVisUvrHasta20EneroDefault,
    benchmarkingViviendaVisUvrSup20Enero: benchmarkingViviendaVisUvrSup20EneroDefault,
    benchmarkingViviendaNoVisUvrHasta20Enero: benchmarkingViviendaNoVisUvrHasta20EneroDefault,
    benchmarkingViviendaNoVisUvrSup20Enero: benchmarkingViviendaNoVisUvrSup20EneroDefault,
    benchmarkingViviendaVisHasta20Febrero: benchmarkingViviendaVisHasta20FebreroDefault,
    benchmarkingViviendaVisSup20Febrero: benchmarkingViviendaVisSup20FebreroDefault,
    benchmarkingViviendaNoVisHasta20Febrero: benchmarkingViviendaNoVisHasta20FebreroDefault,
    benchmarkingViviendaNoVisSup20Febrero: benchmarkingViviendaNoVisSup20FebreroDefault,
    benchmarkingViviendaVisUvrHasta20Febrero: benchmarkingViviendaVisUvrHasta20FebreroDefault,
    benchmarkingViviendaVisUvrSup20Febrero: benchmarkingViviendaVisUvrSup20FebreroDefault,
    benchmarkingViviendaNoVisUvrHasta20Febrero: benchmarkingViviendaNoVisUvrHasta20FebreroDefault,
    benchmarkingViviendaNoVisUvrSup20Febrero: benchmarkingViviendaNoVisUvrSup20FebreroDefault,
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
    benchmarkingCreditsFebrero: benchmarkingCreditsFebreroDefault,
    totalLiabilitiesBalance: totalLiabilitiesBalanceDefault,
    earlyCancellations: earlyCancellationsDefault,
    tppCaptacionSaldos: tppCaptacionSaldosDefault,
    benchmarkingCDATs: benchmarkingCDATsDefault,
    benchmarkingCDATsEnero: benchmarkingCDATsEneroDefault,
    benchmarkingCDATsFebrero: benchmarkingCDATsFebreroDefault,
    rateProposal: rateProposalDefault,
    fsgProposal: fsgProposalDefault,
    cdatProposalMain: cdatProposalMainDefault,
    cdatRateMatrixProposal: cdatRateMatrixProposalDefault,
    historicalRatesV2: historicalRatesV2Default,
    creditRateProposals: creditRateProposalsDefault,
    benchmarkingSummaryData: benchmarkingSummaryTableDefault,
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
    const [isSaving, setIsSaving] = useState(false);

    // Initial load: Fetch from Server (Primary) then LocalStorage (Fallback)
    useEffect(() => {
        async function loadData() {
            try {
                // 1. Try to get from Server
                const response = await fetch('/api/presentation/shared');
                if (response.ok) {
                    const result = await response.json();
                    if (result && result.data) {
                        setData(prev => {
                            const merged = { ...prev, ...result.data };
                            // Migration: Ensure macroAnalysis is always an array of strings
                            if (merged.macroAnalysis && Array.isArray(merged.macroAnalysis)) {
                                merged.macroAnalysis = merged.macroAnalysis.map((item: any) =>
                                    typeof item === 'string' ? item : (item.phrase || item.title || '...')
                                );

                                // FORCE NEW DATA if old structure/text detected
                                if (merged.macroAnalysis.length > 4 || (typeof merged.macroAnalysis[0] === 'string' && merged.macroAnalysis[0].includes('Salario a 2 millones'))) {
                                    merged.macroAnalysis = ALL_DEFAULTS.macroAnalysis;
                                }
                            }

                            // FORCE OVERRIDE for 2026-02-01 inflation value (if stuck at 5.42)
                            if (merged.inflationRepo && Array.isArray(merged.inflationRepo)) {
                                merged.inflationRepo = merged.inflationRepo.map((item: any) => {
                                    if (item.date === "2026-02-01" && (item.inflation === 5.42 || item.inflation === "5.42")) {
                                        return { ...item, inflation: 5.29 };
                                    }
                                    return item;
                                });
                            }

                            return merged;
                        });
                        setIsLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.error('Failed to load shared presentation from server:', err);
            }

            // 2. Fallback to LocalStorage if server fails or is empty
            const saved = localStorage.getItem('presentation_data_v2');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);

                    // Migration: Ensure macroAnalysis is always an array of strings
                    if (parsed.macroAnalysis && Array.isArray(parsed.macroAnalysis)) {
                        parsed.macroAnalysis = parsed.macroAnalysis.map((item: any) =>
                            typeof item === 'string' ? item : (item.phrase || item.title || '...')
                        );

                        // FORCE NEW DATA if old structure/text detected
                        if (parsed.macroAnalysis.length > 4 || (typeof parsed.macroAnalysis[0] === 'string' && parsed.macroAnalysis[0].includes('Salario a 2 millones'))) {
                            parsed.macroAnalysis = ALL_DEFAULTS.macroAnalysis;
                        }
                    }

                    // FORCE OVERRIDE for 2026-02-01 inflation value (if stuck at 5.42)
                    if (parsed.inflationRepo && Array.isArray(parsed.inflationRepo)) {
                        parsed.inflationRepo = parsed.inflationRepo.map((item: any) => {
                            if (item.date === "2026-02-01" && (item.inflation === 5.42 || item.inflation === "5.42")) {
                                return { ...item, inflation: 5.29 };
                            }
                            return item;
                        });
                    }

                    setData(prev => ({ ...prev, ...parsed }));
                } catch (e) {
                    console.error('Error parsing local storage data', e);
                }
            }
            setIsLoading(false);
        }

        loadData();

        // 3. Polling for real-time sync across computers
        const interval = setInterval(async () => {
            if (isSaving) return; // Don't poll if we're currently pushing updates
            try {
                const response = await fetch('/api/presentation/shared');
                if (response.ok) {
                    const result = await response.json();
                    if (result && result.data) {
                        setData(prev => {
                            // Only update if data is actually different to avoid unnecessary re-renders
                            const newData = { ...prev, ...result.data };
                            if (JSON.stringify(prev) === JSON.stringify(newData)) return prev;
                            return newData;
                        });
                    }
                }
            } catch (err) {
                console.warn('Polling failed:', err);
            }
        }, 10000); // Poll every 10s

        return () => clearInterval(interval);
    }, [isSaving]);

    // Debounced Persist to Server and LocalStorage
    useEffect(() => {
        if (isLoading) return;

        const timer = setTimeout(async () => {
            // Save to LocalStorage immediately for responsiveness
            localStorage.setItem('presentation_data_v2', JSON.stringify(data));

            // Persist to Server
            setIsSaving(true);
            try {
                await fetch('/api/presentation/shared', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data })
                });
            } catch (err) {
                console.error('Failed to sync presentation to server:', err);
            } finally {
                setIsSaving(false);
            }
        }, 1500); // 1.5s debounce

        return () => clearTimeout(timer);
    }, [data, isLoading]);

    // Update section logic
    const updateSection = useCallback((section: keyof PresentationData, newData: any) => {
        setData(prev => ({ ...prev, [section]: newData }));
    }, []);

    const resetData = useCallback(async () => {
        if (confirm('¿Estás seguro de restablecer todos los datos a los valores iniciales para TODOS los usuarios?')) {
            localStorage.removeItem('presentation_data_v2');

            // Also reset server state
            try {
                await fetch('/api/presentation/shared', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: ALL_DEFAULTS })
                });
            } catch (err) {
                console.error('Failed to reset server state:', err);
            }

            setData(ALL_DEFAULTS);
            window.location.reload();
        }
    }, []);

    return (
        <PresentationContext.Provider value={{ data, updateSection, resetData, isLoading }}>
            {children}
            {isSaving && (
                <div className="fixed bottom-4 right-4 bg-emerald-600/80 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm z-50 animate-pulse">
                    Sincronizando...
                </div>
            )}
        </PresentationContext.Provider>
    );
}

export const usePresentation = () => {
    const context = useContext(PresentationContext);
    if (!context) throw new Error('usePresentation must be used within a PresentationProvider');
    return context;
};
