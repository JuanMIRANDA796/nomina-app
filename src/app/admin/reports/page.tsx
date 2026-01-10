'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface ReportItem {
    employee: {
        id: number;
        name: string;
        cedula: string;
        salary: number;
    };
    hours: {
        HD: number;   // Hora Diurna
        HN: number;   // Hora Nocturna
        HED: number;  // Extra Diurna
        HEN: number;  // Extra Nocturna
        HDD: number;  // Dom Diurna
        HND: number;  // Dom Nocturna
        HEDD: number; // Extra Dom Diurna
        HEND: number; // Extra Dom Nocturna
    };
    payment: number;
    totalWorkedHours: number;
}

export default function ReportsPage() {
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM'));
    const [report, setReport] = useState<ReportItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchReport();
    }, [date]);

    const fetchReport = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/reports?date=${date}`);
            const data = await res.json();
            setReport(data);
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalPayroll = report.reduce((acc, item) => acc + item.payment, 0);

    return (
        <div className="space-y-6">
            {/* Simple Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Reporte de Nómina</h2>
                    <p className="text-gray-500">Selecciona un empleado para ver el detalle completo</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="month"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-4 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Empleado</th>
                                {/* Standard */}
                                <th className="text-center py-4 px-2 text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/50">HD</th>
                                <th className="text-center py-4 px-2 text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50/50">HN</th>
                                {/* Overtime */}
                                <th className="text-center py-4 px-2 text-[10px] font-bold text-orange-600 uppercase tracking-wider bg-orange-50/50">HED</th>
                                <th className="text-center py-4 px-2 text-[10px] font-bold text-orange-600 uppercase tracking-wider bg-orange-50/50">HEN</th>
                                {/* Sunday Standard */}
                                <th className="text-center py-4 px-2 text-[10px] font-bold text-purple-600 uppercase tracking-wider bg-purple-50/50">HDD</th>
                                <th className="text-center py-4 px-2 text-[10px] font-bold text-purple-600 uppercase tracking-wider bg-purple-50/50">HND</th>
                                {/* Sunday Overtime */}
                                <th className="text-center py-4 px-2 text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50/50">HEDD</th>
                                <th className="text-center py-4 px-2 text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50/50">HEND</th>
                                <th className="text-right py-4 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Pago</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={10} className="py-8 text-center text-gray-500">Calculando reporte...</td>
                                </tr>
                            ) : report.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="py-8 text-center text-gray-500">No hay datos para este periodo</td>
                                </tr>
                            ) : (
                                report.map((item) => (
                                    <tr key={item.employee.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-gray-900 border-r border-gray-50">
                                            <Link href={`/admin/reports/${item.employee.id}?date=${date}`} className="text-blue-600 hover:underline">
                                                {item.employee.name}
                                            </Link>
                                            <p className="text-[10px] text-gray-400">{item.employee.cedula}</p>
                                        </td>

                                        <td className="py-3 px-2 text-center text-gray-600 bg-blue-50/10">{item.hours.HD.toFixed(2)}</td>
                                        <td className="py-3 px-2 text-center text-gray-600 bg-blue-50/10">{item.hours.HN.toFixed(2)}</td>

                                        <td className="py-3 px-2 text-center text-gray-600 bg-orange-50/10">{item.hours.HED.toFixed(2)}</td>
                                        <td className="py-3 px-2 text-center text-gray-600 bg-orange-50/10">{item.hours.HEN.toFixed(2)}</td>

                                        <td className="py-3 px-2 text-center text-gray-600 bg-purple-50/10">{item.hours.HDD.toFixed(2)}</td>
                                        <td className="py-3 px-2 text-center text-gray-600 bg-purple-50/10">{item.hours.HND.toFixed(2)}</td>

                                        <td className="py-3 px-2 text-center text-gray-600 bg-red-50/10">{item.hours.HEDD.toFixed(2)}</td>
                                        <td className="py-3 px-2 text-center text-gray-600 bg-red-50/10">{item.hours.HEND.toFixed(2)}</td>

                                        <td className="py-3 px-4 text-right font-bold text-gray-900 border-l border-gray-50">
                                            ${item.payment.toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
