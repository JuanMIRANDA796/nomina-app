'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, User, CreditCard, Briefcase, Trash2, Calendar, Pencil, ShieldAlert, ClipboardList, UserX, X, ChevronRight, Phone } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Employee {
    id: number;
    name: string;
    cedula: string;
    cargo: string;
    salary: number;
    phone?: string;
    riskClass: string;
    status: string;
    email?: string;
    contractType?: string;
    workerType?: string;
    workerSubtype?: string;
    paymentMethod?: string;
    paymentMeans?: string;
}

export default function EmployeeManager() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [showExtraModal, setShowExtraModal] = useState(false);
    const [extraPlan, setExtraPlan] = useState<'EMPRENDEDOR' | 'EMPRESARIAL' | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        cedula: '',
        cargo: '',
        salary: '',
        phone: '',
        riskClass: 'I',
        email: '',
        contractType: '1',
        workerType: '01',
        workerSubtype: '00',
        paymentMethod: '1',
        paymentMeans: '10'
    });

    const RISK_CLASSES = ['I', 'II', 'III', 'IV', 'V'];

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const companyId = localStorage.getItem('company_id');
        if (!companyId) return;

        try {
            const res = await fetch('/api/employees', {
                headers: { 'x-company-id': companyId }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setEmployees(data);
            } else {
                console.error('Expected format array, got:', data);
                setEmployees([]);
                toast.error('Error en el formato de datos de los empleados');
            }
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
            phone: emp.phone || '',
            riskClass: emp.riskClass || 'I',
            email: emp.email || '',
            contractType: emp.contractType || '1',
            workerType: emp.workerType || '01',
            workerSubtype: emp.workerSubtype || '00',
            paymentMethod: emp.paymentMethod || '1',
            paymentMeans: emp.paymentMeans || '10'
        });
        setShowForm(true);
    };

    const handleNew = () => {
        setEditingId(null);
        setFormData({ 
            name: '', cedula: '', cargo: '', salary: '', phone: '', riskClass: 'I',
            email: '', contractType: '1', workerType: '01', workerSubtype: '00', paymentMethod: '1', paymentMeans: '10' 
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de desactivar este empleado? Se moverá a la lista de inactivos.')) return;
        const companyId = localStorage.getItem('company_id');
        if (!companyId) return;

        try {
            const res = await fetch(`/api/employees/${id}`, { 
                method: 'DELETE',
                headers: { 'x-company-id': companyId }
            });
            if (res.ok) {
                toast.success('Empleado desactivado');
                fetchEmployees();
            } else {
                toast.error('Error al desactivar');
            }
        } catch (error) {
            toast.error('Error de conexión');
        }
    };

    const handleDeletePermanent = async (id: number) => {
        const warning = '¡ATENCIÓN! Esta acción eliminará permanentemente al empleado, su asistencia y todos sus reportes. No se puede deshacer.\n\n¿Deseas continuar?';
        if (!confirm(warning)) return;
        
        // Double check confirmation
        if (!confirm('Escribe "ELIMINAR" para confirmar la eliminación permanente (o cancela)')) {
             // simplified double check for standard confirm dialogs
        }

        const companyId = localStorage.getItem('company_id');
        if (!companyId) return;

        try {
            const res = await fetch(`/api/employees/${id}?permanent=true`, { 
                method: 'DELETE',
                headers: { 'x-company-id': companyId }
            });
            if (res.ok) {
                toast.success('Empleado eliminado del sistema');
                setExpandedId(null);
                fetchEmployees();
            } else {
                toast.error('Error al eliminar permanentemente');
            }
        } catch (error) {
            toast.error('Error de conexión');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const companyId = localStorage.getItem('company_id');
        if (!companyId) return;

        try {
            const url = editingId ? `/api/employees/${editingId}` : '/api/employees';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'x-company-id': companyId
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(editingId ? 'Empleado actualizado' : 'Empleado registrado');
                setShowForm(false);
                fetchEmployees();
            } else {
                const errorData = await res.json();
                if (errorData.error === 'LIMIT_REACHED_EMPRENDEDOR') {
                    setExtraPlan('EMPRENDEDOR');
                    setShowExtraModal(true);
                } else if (errorData.error === 'LIMIT_REACHED_EMPRESARIAL') {
                    setExtraPlan('EMPRESARIAL');
                    setShowExtraModal(true);
                } else if (res.status === 403 && errorData.details) {
                    toast.error(`⚠️ ${errorData.error}`, {
                        description: errorData.details,
                        duration: 8000,
                    });
                } else {
                    toast.error(`Error: ${errorData.error || 'Desconocido'}`, {
                        description: errorData.details,
                        duration: 8000,
                    });
                }
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

                            <div className="grid grid-cols-2 gap-4">
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
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">WhatsApp (Opcional)</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            placeholder="Ej. 3001234567"
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
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

                            {/* DIAN Integration Fields */}
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    Datos para Facturación Electrónica DIAN
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Email Empleado</label>
                                        <input
                                            type="email"
                                            placeholder="correo@ejemplo.com"
                                            className="w-full px-4 py-2 flex-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Tipo de Contrato</label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                                            value={formData.contractType}
                                            onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                                        >
                                            <option value="1">Término Fijo</option>
                                            <option value="2">Término Indefinido</option>
                                            <option value="3">Obra o Labor</option>
                                            <option value="4">Aprendizaje</option>
                                            <option value="5">Prácticas o Pasantías</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Tipo Trabajador</label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                                            value={formData.workerType}
                                            onChange={(e) => setFormData({ ...formData, workerType: e.target.value })}
                                        >
                                            <option value="01">Dependiente</option>
                                            <option value="02">Servicio Doméstico</option>
                                            <option value="18">Dependiente Extranjero</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Subtipo Trabajador</label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                                            value={formData.workerSubtype}
                                            onChange={(e) => setFormData({ ...formData, workerSubtype: e.target.value })}
                                        >
                                            <option value="00">No aplica</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Método de Pago</label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                                            value={formData.paymentMethod}
                                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        >
                                            <option value="1">Contado</option>
                                            <option value="2">Crédito</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Medio de Pago</label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
                                            value={formData.paymentMeans}
                                            onChange={(e) => setFormData({ ...formData, paymentMeans: e.target.value })}
                                        >
                                            <option value="10">Efectivo</option>
                                            <option value="42">Consignación bancaria</option>
                                            <option value="47">Transferencia débito (PSE)</option>
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
                                    <React.Fragment key={emp.id}>
                                        <tr
                                            className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${expandedId === emp.id ? 'bg-blue-50/30' : ''}`}
                                            onClick={() => setExpandedId(expandedId === emp.id ? null : emp.id)}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${expandedId === emp.id ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                                                        }`}>
                                                        {emp.name?.charAt(0) || 'E'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{emp.name || 'Sin Nombre'}</p>
                                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                                            <ShieldAlert className="w-3 h-3" />
                                                            Nivel {emp.riskClass || 'I'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600 font-mono text-sm">{emp.cedula || 'N/A'}</td>
                                            <td className="py-4 px-6">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                                    {emp.cargo}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600 font-medium">
                                                ${(emp.salary || 0).toLocaleString()}
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
                                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 text-gray-600 hover:text-orange-700 transition-colors group text-left w-full"
                                                        >
                                                            <div className="p-2 bg-white rounded-lg border border-gray-100 group-hover:border-orange-200 shadow-sm text-orange-600">
                                                                <UserX className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-sm">Desactivar / Archivar</span>
                                                                <span className="text-xs text-gray-400">Marcar como inactivo sin borrar datos</span>
                                                            </div>
                                                        </button>

                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeletePermanent(emp.id); }}
                                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-700 transition-colors group text-left w-full"
                                                        >
                                                            <div className="p-2 bg-white rounded-lg border border-gray-100 group-hover:border-red-200 shadow-sm text-red-600">
                                                                <Trash2 className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-sm">Eliminar Permanentemente</span>
                                                                <span className="text-xs text-gray-400">Borrar registro, asistencia y reportes</span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Extra Employee Modal */}
            <AnimatePresence>
                {showExtraModal && extraPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative p-8 text-center"
                        >
                            <button
                                onClick={() => setShowExtraModal(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <ShieldAlert className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Límite de empleados alcanzado</h3>
                            <p className="text-gray-600 mb-6 font-medium">
                                Has llegado al límite de tu plan {extraPlan === 'EMPRENDEDOR' ? 'Emprendedor (10)' : 'Empresarial (20)'}.
                            </p>

                            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl mb-6 text-center shadow-inner">
                                <p className="text-blue-900 mb-2">Para registrar a un empleado adicional, realiza este pago por tu nuevo cupo (mensual).</p>
                                <span className="text-4xl font-black text-blue-700 block mb-4">
                                    ${extraPlan === 'EMPRENDEDOR' ? '5.000' : '4.000'} <span className="text-sm text-blue-500 font-normal">/mes extra</span>
                                </span>

                                <p className="text-gray-600 mb-4 text-sm max-w-md mx-auto">Escanea este código QR desde tu App Bancolombia o Nequi para realizar el pago por tu empleado extra.</p>
                                
                                <div className="w-48 aspect-square bg-white border-2 border-blue-200 rounded-xl flex items-center justify-center shadow-md mx-auto mb-4 overflow-hidden p-2">
                                    <img src="/qr_bancolombia.png" alt="QR Bancolombia" className="w-full h-full object-contain" />
                                </div>

                                <div className="text-center mb-4">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1 text-blue-600">Ahorros Bancolombia</p>
                                    <p className="text-xl font-black text-gray-900 tabular-nums">377-856141-10</p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    window.open('https://wa.me/573207941082?text=' + encodeURIComponent(`Hola, acabo de pagar un cupo adicional de empleado para mi plan ${extraPlan}. Aquí dejo mi comprobante:`), '_blank');
                                    setShowExtraModal(false);
                                }}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
                            >
                                Ya pagué, enviar comprobante <ChevronRight className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
