
'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

type ChartProps = {
    type: string;
    data: any; // The JSON blob from DB
};

export default function DynamicChart({ type, data }: ChartProps) {
    if (!data || !data.series) return <div>No Data</div>;

    const { series, chartConfig } = data;
    const xAxisKey = chartConfig?.xAxis || 'name';
    const bars = chartConfig?.bars || [];

    // Custom Tooltip for dark mode
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-800 p-4 border border-slate-700 rounded shadow-xl">
                    <p className="font-bold text-slate-200 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumSignificantDigits: 3 }).format(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (type === 'chart-bar') {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={series}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey={xAxisKey} stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value / 1000000}M`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {bars.map((barKey: string, index: number) => (
                        <Bar
                            key={barKey}
                            dataKey={barKey}
                            fill={index === 0 ? '#3b82f6' : '#10b981'}
                            radius={[4, 4, 0, 0]}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        );
    }

    if (type === 'chart-line') {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={series}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey={xAxisKey} stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value / 1000000}M`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="Ingresos" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="EBITDA" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="UtilidadNeta" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        );
    }

    return <div>Chart type {type} not supported</div>;
}
