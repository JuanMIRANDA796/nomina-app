'use client';

import { useState, useEffect } from 'react';
import { 
    Send, 
    CheckCircle2, 
    AlertCircle,
    Clock,
    FileText,
    Download,
    Building2,
    CalendarDays,
    Search,
    Filter
} from 'lucide-react';
import { toast } from 'sonner';

export default function PayrollTransmission() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTransmitting, setIsTransmitting] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('2026-04');
    const [dianEnabled, setDianEnabled] = useState<boolean | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const companyId = localStorage.getItem('company_id') || '1';
            
            // Check enablement
            const compRes = await fetch(`/api/settings/company?companyId=${companyId}`);
            if (compRes.ok) {
                const compData = await compRes.json();
                setDianEnabled(compData.dianEnabled === true);
                
                // If not enabled, don't bother fetching employees for the board yet
                if (compData.dianEnabled !== true) {
                    setIsLoading(false);
                    return;
                }
            }

            const res = await fetch(`/api/employees?companyId=${companyId}`);
            if (res.ok) {
                const data = await res.json();
                
                // Add dummy status data for the UI demonstration
                const mappedData = data.map((emp: any, index: number) => {
                    let status = 'PENDING'; // Default
                    
                    // Just to show different states in the UI for demonstration
                    if (index === 0) status = 'SUCCESS';
                    if (index === 2) status = 'ERROR';

                    return {
                        ...emp,
                        dianStatus: status,
                        totalDevengado: emp.salary + 162000, 
                        totalDeducido: (emp.salary * 0.08), // 4% salud, 4% pension
                        totalPagar: emp.salary + 162000 - (emp.salary * 0.08)
                    };
                });

                setEmployees(mappedData);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            toast.error('Error al cargar la nómina');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTransmitAll = async () => {
        setIsTransmitting(true);
        toast.info('Iniciando transmisión masiva a la DIAN...');
        
        // Simulate API call for transmission
        setTimeout(() => {
            setIsTransmitting(false);
            toast.success('Transmisión completada. Se enviaron los documentos a Matias API.');
            
            // Update all pending to success
            setEmployees(prev => prev.map(emp => 
                emp.dianStatus === 'PENDING' ? { ...emp, dianStatus: 'SUCCESS' } : emp
            ));
        }, 3000);
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'SUCCESS':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 font-bold text-xs border border-green-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aceptado
                    </span>
                );
            case 'ERROR':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 font-bold text-xs border border-red-200">
                        <AlertCircle className="w-3.5 h-3.5" /> Rechazado
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-bold text-xs border border-orange-200">
                        <Clock className="w-3.5 h-3.5" /> Pendiente
                    </span>
                );
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(value);
    };

    const pendingCount = employees.filter(e => e.dianStatus === 'PENDING').length;
    const successCount = employees.filter(e => e.dianStatus === 'SUCCESS').length;
    const errorCount = employees.filter(e => e.dianStatus === 'ERROR').length;

    if (dianEnabled === false) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto text-center px-4">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 shadow-inner ring-8 ring-white">
                    <AlertCircle className="w-12 h-12" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">¡Módulo Bloqueado!</h1>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                    Estás a un paso de reportar tu nómina. Debes habilitarte ante la DIAN y registrar la información legal de tu empresa primero.
                </p>
                <button 
                    onClick={() => window.location.href = '/admin/payroll-electronic'}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-1 hover:shadow-2xl flex items-center gap-2 mx-auto"
                >
                    <Building2 className="w-6 h-6" />
                    Iniciar Configuración de DIAN
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Transmisión a la DIAN</h1>
                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> Consolidado mensual para emisión de Nómina Electrónica
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3">
                        <CalendarDays className="w-5 h-5 text-blue-600" />
                        <select 
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="bg-transparent font-bold text-gray-900 outline-none cursor-pointer"
                        >
                            <option value="2026-04">Abril 2026</option>
                            <option value="2026-03">Marzo 2026</option>
                            <option value="2026-02">Febrero 2026</option>
                        </select>
                    </div>

                    <button 
                        onClick={handleTransmitAll}
                        disabled={isTransmitting || pendingCount === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg transition-all
                            ${isTransmitting || pendingCount === 0 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 hover:-translate-y-0.5'
                            }
                        `}
                    >
                        <Send className={`w-5 h-5 ${isTransmitting ? 'animate-pulse' : ''}`} />
                        {isTransmitting ? 'Transmitiendo...' : `Emitir ${pendingCount} Nóminas`}
                    </button>
                </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-gray-500 mb-1">Total Empleados</p>
                        <p className="text-3xl font-black text-gray-900">{employees.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                        <FileText className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-orange-600 mb-1">Por Emitir (Pendientes)</p>
                        <p className="text-3xl font-black text-orange-700">{pendingCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-green-600 mb-1">Emitidas (DIAN)</p>
                        <p className="text-3xl font-black text-green-700">{successCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-red-600 mb-1">Con Errores</p>
                        <p className="text-3xl font-black text-red-700">{errorCount}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar empleado o Cédula..."
                            className="pl-10 pr-4 py-2 w-full sm:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-900 bg-white"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter className="w-4 h-4" /> Filtrar por estado
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="px-6 py-4">Empleado</th>
                                <th className="px-6 py-4">Cédula</th>
                                <th className="px-6 py-4 text-right">Neto a Pagar</th>
                                <th className="px-6 py-4 text-center">Estado DIAN</th>
                                <th className="px-6 py-4 text-center">Soportes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-500 mb-2" />
                                        Cargando nómina...
                                    </td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                        No hay empleados registrados en este periodo.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{emp.name}</div>
                                            <div className="text-xs text-gray-500">{emp.contractType === '1' ? 'Término Fijo' : 'Indefinido'}</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm text-gray-600">
                                            {emp.cedula}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-black text-gray-900">{formatCurrency(emp.totalPagar)}</div>
                                            <div className="text-[10px] text-gray-400">Total Dev: {formatCurrency(emp.totalDevengado)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                {getStatusBadge(emp.dianStatus)}
                                            </div>
                                            {emp.dianStatus === 'ERROR' && (
                                                <div className="text-[10px] text-red-500 mt-1 cursor-pointer hover:underline">Ver detalle (Regla 90)</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    disabled={emp.dianStatus !== 'SUCCESS'}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        emp.dianStatus === 'SUCCESS' 
                                                        ? 'text-red-500 hover:bg-red-50' 
                                                        : 'text-gray-300 cursor-not-allowed'
                                                    }`}
                                                    title="Descargar PDF Oficial"
                                                >
                                                    <FileText className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    disabled={emp.dianStatus !== 'SUCCESS'}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        emp.dianStatus === 'SUCCESS' 
                                                        ? 'text-blue-500 hover:bg-blue-50' 
                                                        : 'text-gray-300 cursor-not-allowed'
                                                    }`}
                                                    title="Descargar XML DIAN"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
