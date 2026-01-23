
'use client';

import React from 'react';

type HeatmapProps = {
    data: any;
};

export default function DynamicHeatmap({ data }: HeatmapProps) {
    if (!data || !data.matrix) return <div>No Data</div>;

    const { rows, cols, matrix } = data;

    // Function to get color based on value (simple gradient)
    // Assuming higher value = better (Green), lower = worse (Red)
    // or relative to base case.
    const getColor = (val: number, isBase: boolean) => {
        if (isBase) return 'bg-blue-600 font-bold border-2 border-white';
        // Simple heuristic: if val > base, green. else red/orange.
        // Ideally we normalize this.
        return 'bg-slate-700 hover:bg-slate-600';
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center overflow-auto">
            <h3 className="text-xl font-bold mb-4 text-slate-300">Sensibilidad Valor Patrimonial (COP MM)</h3>

            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${cols.length}, minmax(100px, 1fr))` }}>

                    {/* Top Left Empty */}
                    <div className="p-2 font-bold text-slate-400 text-sm flex items-center justify-center">
                        WACC \ g
                    </div>

                    {/* Column Headers (g) */}
                    {cols.map((col: any) => (
                        <div key={col} className="p-2 font-bold text-slate-300 text-center border-b border-slate-600">
                            {col}
                        </div>
                    ))}

                    {/* Rows */}
                    {rows.map((rowLabel: string, rIndex: number) => (
                        <React.Fragment key={rowLabel}>
                            {/* Row Header (WACC) */}
                            <div className="p-2 font-bold text-slate-300 border-r border-slate-600 flex items-center justify-center">
                                {rowLabel}
                            </div>

                            {/* Cells */}
                            {matrix[rIndex].map((val: number, cIndex: number) => {
                                const isBase = rIndex === Math.floor(rows.length / 2) && cIndex === Math.floor(cols.length / 2);
                                return (
                                    <div
                                        key={`${rIndex}-${cIndex}`}
                                        className={`p-3 text-center rounded text-sm transition-colors cursor-pointer ${getColor(val, isBase)}`}
                                    >
                                        {new Intl.NumberFormat('es-CO').format(val)}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>

                <div className="mt-4 text-xs text-slate-400 text-center">
                    * Valores en millones de pesos. El recuadro azul indica el escenario base.
                </div>
            </div>
        </div>
    );
}
