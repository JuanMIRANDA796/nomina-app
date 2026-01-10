'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, User, CreditCard, Briefcase, Trash2, Calendar, Pencil, ShieldAlert, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Employee {
    id: number;
    name: string;
    cedula: string;
    cargo: string;
    salary: number;
    riskClass: string;
    status: string;
}

export default function EmployeeManager() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        cedula: '',
        cargo: '',
        salary: '',
        riskClass: 'I'
    });

    const RISK_CLASSES = ['I', 'II', 'III', 'IV', 'V'];

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/employees');
            const data = await res.json();
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            toast.error('Error al cargar empleados');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (emp: Employee) => {
        setEditingId(emp.id);
        setFormData({
            name: emp.name,
            cedula: emp.cedula,
            cargo: emp.cargo,
            salary: emp.salary.toString(),
            riskClass: emp.riskClass || 'I'
        });
        setShowForm(true);
    };

    const handleNew = () => {
        setEditingId(null);
        setFormData({ name: '', cedula: '', cargo: '', salary: '', riskClass: 'I' });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de desactivar este empleado?')) return;

        try {
            const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Empleado desactivado');
                fetchEmployees();
            } else {
                toast.error('Error al eliminar');
            }
        } catch (error) {
            toast.error('Error de conexión');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/employees/${editingId}` : '/api/employees';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(editingId ? 'Empleado actualizado' : 'Empleado registrado');
                setShowForm(false);
                fetchEmployees();
            } else {
                const errorData = await res.json();
                toast.error('Error: ' + (errorData.error || 'Desconocido'));
            }
        } catch (error) {
            console.error('Error saving employee:', error);
            toast.error('Error de conexión');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestión de Empleados</h2>
                    <p className="text-gray-500">Administra tu equipo de trabajo</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nuevo Empleado</span>
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingId ? 'Editar Empleado' : 'Registrar Empleado'}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ej. Juan Pérez"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Cédula</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ej. 1234567890"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                                        value={formData.cedula}
                                        onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Cargo</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ej. Vendedor"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                                        value={formData.cargo}
                                        onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Salario Base</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                                        <input
                                            required
                                            type="number"
                                            placeholder="0"
                                            className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                                            value={formData.salary}
                                            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Clase Riesgo (ARL)</label>
                                    <div className="relative">
                                        <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 appearance-none bg-white"
                                            value={formData.riskClass}
                                            onChange={(e) => setFormData({ ...formData, riskClass: e.target.value })}
                                        >
                                            {RISK_CLASSES.map(r => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/20"
                                >
                                    {editingId ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Employee List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Empleado</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cédula</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cargo</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Salario</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">Cargando empleados...</td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">No hay empleados registrados</td>
                                </tr>
                            ) : (
                                employees.map((emp) => (
                                    <>
                                        <tr
                                            key={emp.id}
                                            className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${expandedId === emp.id ? 'bg-blue-50/30' : ''}`}
                                            onClick={() => setExpandedId(expandedId === emp.id ? null : emp.id)}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${expandedId === emp.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                                                        }`}>
                                                        {emp.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{emp.name}</p>
                                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                                            <ShieldAlert className="w-3 h-3" />
                                                            Nivel {emp.riskClass || 'I'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600 font-mono text-sm">{emp.cedula}</td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                                    {emp.cargo}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600 font-medium">
                                                ${emp.salary.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.status === 'ACTIVE'
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-red-50 text-red-700'
                                                    }`}>
                                                    {emp.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                        </tr>
                                        {expandedId === emp.id && (
                                            <tr className="bg-gray-50/30 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <td colSpan={5} className="p-0 border-b border-gray-100">
                                                    <div className="pl-[4.5rem] pr-6 py-4 grid gap-2 max-w-lg">
                                                        <Link
                                                            href={`/admin/reports/${emp.id}`}
                                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition-colors group"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <div className="p-2 bg-white rounded-lg border border-gray-100 group-hover:border-blue-200 shadow-sm text-blue-600">
                                                                <ClipboardList className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-sm">Reportes de Nómina</span>
                                                                <span className="text-xs text-gray-400">Ver desprendibles y pagos</span>
                                                            </div>
                                                        </Link>

                                                        <Link
                                                            href={`/admin/employees/${emp.id}`}
                                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 text-gray-600 hover:text-purple-700 transition-colors group"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <div className="p-2 bg-white rounded-lg border border-gray-100 group-hover:border-purple-200 shadow-sm text-purple-600">
                                                                <Calendar className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-sm">Historial de Asistencia</span>
                                                                <span className="text-xs text-gray-400">Ver entradas, salidas y ausencias</span>
                                                            </div>
                                                        </Link>

                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEdit(emp); }}
                                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50 text-gray-600 hover:text-amber-700 transition-colors group text-left w-full"
                                                        >
                                                            <div className="p-2 bg-white rounded-lg border border-gray-100 group-hover:border-amber-200 shadow-sm text-amber-600">
                                                                <Pencil className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-sm">Editar Información</span>
                                                                <span className="text-xs text-gray-400">Modificar datos personales y contrato</span>
                                                            </div>
                                                        </button>

                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(emp.id); }}
                                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-700 transition-colors group text-left w-full"
                                                        >
                                                            <div className="p-2 bg-white rounded-lg border border-gray-100 group-hover:border-red-200 shadow-sm text-red-600">
                                                                <Trash2 className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-sm">Desactivar Empleado</span>
                                                                <span className="text-xs text-gray-400">Archivar registro del sistema</span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
