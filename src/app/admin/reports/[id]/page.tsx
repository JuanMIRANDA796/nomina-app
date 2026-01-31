'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Save, AlertCircle, Calendar as CalendarIcon, Download } from 'lucide-react';
import Link from 'next/link';

interface DailyRecord {
    date: string;
    status: 'ATTENDED' | 'ABSENT' | 'MISSING' | 'HOLIDAY' | 'REST';
    attendance: { entry: string; exit: string } | null;
    absence: { reason: string; paidPercentage: number } | null;
    hours: any | null; // ShiftResult
}

interface PayrollData {
    employee: any;
    period: string;
    dailyRecords: DailyRecord[];
    payroll: any; // PayrollResult
}

const ABSENCE_OPTIONS = [
    'Incapacidad médica común (día 1-2)',
    'Incapacidad médica común (día 3 en adelante)',
    'Incapacidad laboral (ARL)',
    'Licencia de maternidad',
    'Licencia de paternidad',
    'Licencia remunerada',
    'Vacaciones',
    'Permiso no remunerado',
    'Ausencia injustificada',
    'Suspensión'
];

export default function PayrollDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [date, setDate] = useState(searchParams.get('date') || format(new Date(), 'yyyy-MM'));
    const [period, setPeriod] = useState('month');
    const [data, setData] = useState<PayrollData | null>(null);
    const [loading, setLoading] = useState(true);

    const employeeId = params.id;

    useEffect(() => {
        if (employeeId) fetchPayroll();
    }, [employeeId, date, period]);

    const fetchPayroll = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/payroll/${employeeId}?date=${date}&period=${period}`);
            const json = await res.json();
            if (res.ok) setData(json);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAbsenceChange = async (recordDate: string, reason: string) => {
        try {
            const res = await fetch(`/api/payroll/${employeeId}/absence`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: recordDate,
                    reason
                })
            });
            if (res.ok) fetchPayroll();
        } catch (error) {
            console.error('Failed to update absence', error);
        }
    };

    const handleResetDay = async (recordDate: string) => {
        if (!confirm('¿Estás seguro de restablecer este día a "Sin Registro"? Se borrará la asistencia.')) return;

        try {
            const res = await fetch(`/api/employees/${employeeId}/attendance`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: recordDate })
            });
            if (res.ok) fetchPayroll();
        } catch (error) {
            console.error('Failed to reset day', error);
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando nómina detallada...</div>;
    if (!data) return <div className="p-8 text-center text-red-600">No se encontró información del empleado</div>;

    const { employee, payroll, dailyRecords } = data;

    const HOUR_CONCEPTS = [
        { key: 'HD', label: 'Hora Ordinaria Diurna (HD)', percent: '100%' },
        { key: 'HN', label: 'Hora Nocturna (HN)', percent: '+35%' },
        { key: 'HED', label: 'Horas extra diurnas (HED)', percent: '+25%' },
        { key: 'HEN', label: 'Horas extra nocturnas (HEN)', percent: '+75%' },
        { key: 'HDD', label: 'Dominicales y festivos (HDD)', percent: '+75%' },
        { key: 'HND', label: 'Dominicales y festivos Noct (HND)', percent: '+110%' },
        { key: 'HEDD', label: 'Dominicales y festivos Extras (HEDD)', percent: '+100%' },
        { key: 'HEND', label: 'Dominicales y festivos Extras noct. (HEND)', percent: '+150%' },
    ];

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/employees" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
                        <p className="text-gray-500">{employee.cargo} • {payroll.period}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="p-2 border border-gray-200 rounded-lg bg-white text-black"
                    >
                        <option value="month">Mensual (Completo)</option>
                        <option value="q1">Quincena 1 (1-15)</option>
                        <option value="q2">Quincena 2 (16-Fin)</option>
                    </select>

                    <input
                        type="month"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="p-2 border border-gray-200 rounded-lg text-black"
                    />
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Download className="w-4 h-4" />
                        Exportar PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Daily Detail */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">Registro Diario</h3>
                            <span className="text-sm text-gray-500">Gestiona las ausencias aquí</span>
                        </div>
                        {/* Table ... existing ... */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-max">
                                <thead className="bg-gray-100 border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 text-left font-bold text-gray-900 uppercase tracking-wide">Fecha</th>
                                        <th className="p-4 text-left font-bold text-gray-900 uppercase tracking-wide">Estado</th>
                                        <th className="p-4 text-left font-bold text-gray-900 uppercase tracking-wide">Detalle / Acción</th>
                                        <th className="p-4 text-center font-bold text-gray-900 w-16 border-l border-gray-200" title="Hora Diurna">HD</th>
                                        <th className="p-4 text-center font-bold text-gray-900 w-16" title="Hora Nocturna">HN</th>
                                        <th className="p-4 text-center font-bold text-gray-900 w-16" title="Hora Extra Diurna">HED</th>
                                        <th className="p-4 text-center font-bold text-gray-900 w-16" title="Hora Extra Nocturna">HEN</th>
                                        <th className="p-4 text-center font-bold text-gray-900 w-16" title="Hora Dominical Diurna">HDD</th>
                                        <th className="p-4 text-center font-bold text-gray-900 w-16" title="Hora Dominical Nocturna">HND</th>
                                        <th className="p-4 text-center font-bold text-gray-900 w-16" title="Hora Extra Dominical Diurna">HEDD</th>
                                        <th className="p-4 text-center font-bold text-gray-900 w-16" title="Hora Extra Dominical Nocturna">HEND</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {dailyRecords.map((day) => (
                                        <tr key={day.date} className="hover:bg-gray-50/50">
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900 capitalize">
                                                    {day.attendance?.entry
                                                        ? format(parseISO(day.attendance.entry), 'dd MMM', { locale: es })
                                                        : format(parseISO(day.date), 'dd MMM', { locale: es })
                                                    }
                                                </div>
                                                <div className="text-xs text-gray-500 capitalize">
                                                    {day.attendance?.entry
                                                        ? format(parseISO(day.attendance.entry), 'EEEE', { locale: es })
                                                        : format(parseISO(day.date), 'EEEE', { locale: es })
                                                    }
                                                </div>
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                {day.status === 'ATTENDED' && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Asistió
                                                    </span>
                                                )}
                                                {day.status === 'ABSENT' && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Ausencia
                                                    </span>
                                                )}
                                                {day.status === 'MISSING' && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                        Sin Registro
                                                    </span>
                                                )}
                                                {day.status === 'HOLIDAY' && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        Festivo Pago
                                                    </span>
                                                )}
                                                {day.status === 'REST' && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        Descanso Pago
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 whitespace-nowrap">
                                                {day.status === 'ATTENDED' ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-gray-600 text-xs font-mono flex flex-col">
                                                            <span>Entrada: {format(parseISO(day.attendance!.entry), 'd MMM HH:mm', { locale: es })}</span>
                                                            <span>Salida: {format(parseISO(day.attendance!.exit), 'd MMM HH:mm', { locale: es })}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleResetDay(day.date)}
                                                            className="text-gray-400 hover:text-red-500"
                                                            title="Restablecer a Sin Registro"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                        </button>
                                                    </div>
                                                ) : day.status === 'ABSENT' ? (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-medium text-red-700 text-xs max-w-[150px] truncate" title={day.absence?.reason}>{day.absence?.reason}</span>
                                                        <button
                                                            onClick={() => handleAbsenceChange(day.date, '')}
                                                            className="text-xs text-blue-600 hover:underline text-left"
                                                        >
                                                            Cambiar
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <select
                                                        className="w-40 text-xs p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                                        onChange={(e) => handleAbsenceChange(day.date, e.target.value)}
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>Seleccionar motivo...</option>
                                                        {ABSENCE_OPTIONS.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </td>
                                            {/* Hours Columns */}
                                            <td className="p-4 text-center font-mono text-xs text-gray-600 border-l border-gray-100">{day.hours?.HD ? day.hours.HD.toFixed(1) : '-'}</td>
                                            <td className="p-4 text-center font-mono text-xs text-gray-600">{day.hours?.HN ? day.hours.HN.toFixed(1) : '-'}</td>
                                            <td className="p-4 text-center font-mono text-xs text-gray-600">{day.hours?.HED ? day.hours.HED.toFixed(1) : '-'}</td>
                                            <td className="p-4 text-center font-mono text-xs text-gray-600">{day.hours?.HEN ? day.hours.HEN.toFixed(1) : '-'}</td>
                                            <td className="p-4 text-center font-mono text-xs text-gray-600">{day.hours?.HDD ? day.hours.HDD.toFixed(1) : '-'}</td>
                                            <td className="p-4 text-center font-mono text-xs text-gray-600">{day.hours?.HND ? day.hours.HND.toFixed(1) : '-'}</td>
                                            <td className="p-4 text-center font-mono text-xs text-gray-600">{day.hours?.HEDD ? day.hours.HEDD.toFixed(1) : '-'}</td>
                                            <td className="p-4 text-center font-mono text-xs text-gray-600">{day.hours?.HEND ? day.hours.HEND.toFixed(1) : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Payroll Summary */}
                <div className="space-y-6">
                    {/* Main Totals */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 text-lg">Resumen de Pago</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Salario Base</span>
                                <span className="font-bold text-gray-900">${employee.salary.toLocaleString()}</span>
                            </div>

                            {/* Earnings Breakdown */}
                            <div className="py-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Detalle de Horas</p>
                                <div className="space-y-1">
                                    {/* Table Header for Breakdown */}
                                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 text-xs font-semibold text-gray-400 pb-1 border-b border-gray-100">
                                        <span>Concepto</span>
                                        <span className="text-center w-10">Hrs</span>
                                        <span className="text-right w-16">V.Unit</span>
                                        <span className="text-right w-20">Total</span>
                                    </div>

                                    {HOUR_CONCEPTS.map((item) => {
                                        const hours = payroll.hours?.[item.key] || 0;
                                        const total = payroll.earningsBreakdown?.[item.key] || 0;
                                        const unitVal = payroll.unitValues?.[item.key] || 0;

                                        // if (hours === 0) return null; // Show all or filter? "pueda ver... numero acumulado". Usually show all to confirm 0.

                                        return (
                                            <div key={item.key} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 text-xs text-gray-600 hover:bg-gray-50 p-1 rounded items-center">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-700">{item.key}</span>
                                                    <span className="text-[10px] text-gray-400">{item.percent}</span>
                                                </div>
                                                <span className="text-center font-mono w-10 text-gray-500">{hours > 0 ? hours.toFixed(1) : '-'}</span>
                                                <span className="text-right font-mono w-16 text-gray-400">{unitVal > 0 ? unitVal.toLocaleString() : '-'}</span>
                                                <span className="text-right font-medium w-20 text-gray-900">${Math.round(total).toLocaleString()}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-between pt-2 border-t border-gray-100">
                                <span className="text-gray-600">Devengado (Tiempo)</span>
                                <span className="font-bold text-gray-900">${Math.round(payroll.basicPay).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Auxilio Transporte</span>
                                <span className="font-bold text-gray-900">${Math.round(payroll.auxTransporte).toLocaleString()}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-100 flex justify-between font-bold text-gray-900">
                                <span>Total Devengado</span>
                                <span>${Math.round(payroll.totalDevengado).toLocaleString()}</span>
                            </div>

                            <div className="pt-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Deducciones Empleado</p>
                                <div className="flex justify-between text-red-600">
                                    <span>Salud (4%)</span>
                                    <span>-${Math.round(payroll.healthDeduction).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-red-600">
                                    <span>Pensión (4%)</span>
                                    <span>-${Math.round(payroll.pensionDeduction).toLocaleString()}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-100 flex justify-between font-bold text-red-700">
                                    <span>Total Deducciones</span>
                                    <span>-${Math.round(payroll.totalDeductions).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-4 mt-4 border-t-2 border-gray-100">
                                <div className="flex justify-between text-xl font-bold text-gray-900">
                                    <span>Neto a Pagar</span>
                                    <span>${Math.round(payroll.netPay).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employer Provisions */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Prestaciones (Empleador)</h3>
                        <div className="space-y-2 text-xs text-gray-800">
                            <div className="flex justify-between">
                                <span>Cesantías (8.33%)</span>
                                <span className="font-mono font-bold text-gray-900">${Math.round(payroll.cesantias).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Int. Cesantías (1%)</span>
                                <span className="font-mono font-bold text-gray-900">${Math.round(payroll.interesesCesantias).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Prima (8.33%)</span>
                                <span className="font-mono font-bold text-gray-900">${Math.round(payroll.prima).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Vacaciones (4.17%)</span>
                                <span className="font-mono font-bold text-gray-900">${Math.round(payroll.vacaciones).toLocaleString()}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                                <span>Total Prestaciones</span>
                                <span>${Math.round(payroll.totalProvisions).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Employer Security */}
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Seguridad Social (Empleador)</h3>
                        <div className="space-y-2 text-xs text-gray-800">
                            <div className="flex justify-between">
                                <span>Salud (8.5%)</span>
                                <span className="font-mono font-bold text-gray-900">${Math.round(payroll.securityHealth).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Pensión (12%)</span>
                                <span className="font-mono font-bold text-gray-900">${Math.round(payroll.securityPension).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>ARL (Nivel {employee.riskClass})</span>
                                <span className="font-mono font-bold text-gray-900">${Math.round(payroll.securityARL).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Caja (4%)</span>
                                <span className="font-mono font-bold text-gray-900">${Math.round(payroll.securityCaja).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>ICBF (3%)</span>
                                <span className="font-mono font-bold text-gray-900">${Math.round(payroll.securityICBF).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>SENA (2%)</span>
                                <span className="font-mono font-bold text-gray-900">${Math.round(payroll.securitySENA).toLocaleString()}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                                <span>Total Seguridad</span>
                                <span>${Math.round(payroll.totalSecurity).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

