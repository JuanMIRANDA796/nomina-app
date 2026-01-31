'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Download, RefreshCw, Save, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { toast } from 'sonner';

interface HistoryRecord {
    date: string; // ISO
    recordId: number | null;
    entryTime: string | null; // ISO
    exitTime: string | null; // ISO
    status: string;
}

// Helper to get formatted date string for input (YYYY-MM-DD)
const getInputDate = (isoString: string | null, fallbackDate: string) => {
    if (isoString) return format(parseISO(isoString), 'yyyy-MM-dd');
    return format(parseISO(fallbackDate), 'yyyy-MM-dd');
};

const getInputTime = (isoString: string | null) => {
    if (!isoString) return '';
    return format(parseISO(isoString), 'HH:mm');
};

interface EmployeeData {
    id: number;
    name: string;
    cedula: string;
    cargo: string;
}

export default function EmployeeHistoryPage() {
    const params = useParams();
    const employeeId = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ employee: EmployeeData, history: HistoryRecord[] } | null>(null);

    // Date Selection
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());

    const MONTHS = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 1 + i); // 2024-2028 approx

    useEffect(() => {
        if (employeeId) fetchHistory();
    }, [employeeId, month, year]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/employees/${employeeId}/attendance?month=${month}&year=${year}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar historial');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (date: string, type: 'entryTime' | 'exitTime', newDateValue: string, newTimeValue: string) => {
        // Prepare Full ISO String
        let fullISO = null;
        if (newTimeValue && newDateValue) {
            const datePart = parseISO(newDateValue);
            const [hours, minutes] = newTimeValue.split(':').map(Number);
            datePart.setHours(hours, minutes, 0, 0);
            fullISO = datePart.toISOString();
        }

        try {
            const res = await fetch(`/api/employees/${employeeId}/attendance`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date, // Original row date (Anchor)
                    [type]: fullISO
                })
            });

            if (res.ok) {
                toast.success('Registro actualizado');
                fetchHistory();
            } else {
                toast.error('Error al actualizar');
            }
        } catch (error) {
            toast.error('Error de conexión');
        }
    };

    const handleDelete = async (date: string) => {
        if (!confirm('¿Estás seguro de eliminar este registro?')) return;
        try {
            const res = await fetch(`/api/employees/${employeeId}/attendance`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date })
            });

            if (res.ok) {
                toast.success('Registro eliminado');
                fetchHistory();
            } else {
                toast.error('Error al eliminar');
            }
        } catch (error) {
            toast.error('Error de conexión');
        }
    };

    const getTimeValue = (isoString: string | null) => {
        if (!isoString) return '';
        return format(parseISO(isoString), 'HH:mm');
    };

    if (!data && loading) return <div className="p-8 text-center text-gray-500">Cargando...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">No se encontró información</div>;

    const { employee, history } = data;

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/employees"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Historial de Asistencia</h2>
                        <p className="text-gray-500">{employee.name} • {employee.cargo}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    <select
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                        className="p-2 bg-transparent outline-none font-medium text-gray-700 cursor-pointer hover:bg-gray-50 rounded-lg"
                    >
                        {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                    <select
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        className="p-2 bg-transparent outline-none font-medium text-gray-700 cursor-pointer hover:bg-gray-50 rounded-lg"
                    >
                        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hora Entrada</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hora Salida</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {history.map((record) => {
                                const isWeekend = new Date(record.date).getDay() === 0 || new Date(record.date).getDay() === 6;
                                const isCompleted = record.status === 'Completo';

                                return (
                                    <tr key={record.date} className={`hover:bg-gray-50/50 transition-colors ${isWeekend ? 'bg-gray-50/30' : ''}`}>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-medium capitalize">
                                                        {/* Strict Date Listing: Always show the bucket date (e.g. 19th) so the row exists.
                                                            The API handles moving the right record into this bucket if needed. */}
                                                        {format(parseISO(record.date), 'EEEE, d MMMM', { locale: es })}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {format(parseISO(record.date), 'yyyy')}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                <input
                                                    type="date"
                                                    defaultValue={getInputDate(record.entryTime, record.date)}
                                                    className="p-1 text-xs border border-gray-100 rounded text-gray-500 w-32 focus:border-blue-500 outline-none"
                                                    onChange={(e) => {
                                                        const timeVal = (document.getElementById(`time-entry-${record.date}`) as HTMLInputElement)?.value;
                                                        handleUpdate(record.date, 'entryTime', e.target.value, timeVal);
                                                    }}
                                                />
                                                <input
                                                    id={`time-entry-${record.date}`}
                                                    type="time"
                                                    defaultValue={getInputTime(record.entryTime)}
                                                    onBlur={(e) => {
                                                        const dateVal = (e.target.previousSibling as HTMLInputElement)?.value;
                                                        // Fallback if sibling nav fails, use state or smarter query. 
                                                        // Actually, keeping simple for now. 
                                                        // Ideally we store state per row, but direct DOM value is fine for this prototype.
                                                        const dateInput = e.target.parentElement?.querySelector('input[type="date"]') as HTMLInputElement;
                                                        if (dateInput) {
                                                            handleUpdate(record.date, 'entryTime', dateInput.value, e.target.value);
                                                        }
                                                    }}
                                                    className={`p-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none w-32 text-center
                                                        ${!record.entryTime ? 'text-gray-400 border-dashed border-gray-300' : 'text-gray-900 border-gray-200'}`}
                                                />
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                <input
                                                    type="date"
                                                    defaultValue={getInputDate(record.exitTime, record.date)}
                                                    className="p-1 text-xs border border-gray-100 rounded text-gray-500 w-32 focus:border-blue-500 outline-none"
                                                    onChange={(e) => {
                                                        const timeVal = (document.getElementById(`time-exit-${record.date}`) as HTMLInputElement)?.value;
                                                        handleUpdate(record.date, 'exitTime', e.target.value, timeVal);
                                                    }}
                                                />
                                                <input
                                                    id={`time-exit-${record.date}`}
                                                    type="time"
                                                    defaultValue={getInputTime(record.exitTime)}
                                                    onBlur={(e) => {
                                                        const dateInput = e.target.parentElement?.querySelector('input[type="date"]') as HTMLInputElement;
                                                        if (dateInput) {
                                                            const val = e.target.value;
                                                            // Logic: If user clears time, we might want to clear record? 
                                                            // Current logic: sends null if empty.
                                                            handleUpdate(record.date, 'exitTime', dateInput.value, val);
                                                        }
                                                    }}
                                                    className={`p-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none w-32 text-center
                                                        ${!record.exitTime ? 'text-gray-400 border-dashed border-gray-300' : 'text-gray-900 border-gray-200'}`}
                                                />
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                    ${isCompleted ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                    {isCompleted ? 'Completado' : 'Incompleto'}
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(record.date)}
                                                    className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                                                    title="Eliminar registro"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
