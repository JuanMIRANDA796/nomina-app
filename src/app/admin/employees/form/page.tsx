'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, CreditCard, Briefcase, Phone, ShieldAlert, Save, Building2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function EmployeeFormPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEditing = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditing);

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
        if (isEditing && id) {
            fetchEmployee(id);
        }
    }, [isEditing, id]);

    const fetchEmployee = async (employeeId: string) => {
        const companyId = localStorage.getItem('company_id');
        if (!companyId) return;

        try {
            const res = await fetch(`/api/employees/${employeeId}`, {
                headers: { 'x-company-id': companyId }
            });
            if (res.ok) {
                const emp = await res.json();
                setFormData({
                    name: emp.name || '',
                    cedula: emp.cedula || '',
                    cargo: emp.cargo || '',
                    salary: emp.salary?.toString() || '',
                    phone: emp.phone || '',
                    riskClass: emp.riskClass || 'I',
                    email: emp.email || '',
                    contractType: emp.contractType || '1',
                    workerType: emp.workerType || '01',
                    workerSubtype: emp.workerSubtype || '00',
                    paymentMethod: emp.paymentMethod || '1',
                    paymentMeans: emp.paymentMeans || '10'
                });
            } else {
                toast.error('Gresca el empleado no existe o no tienes acceso.');
                router.push('/admin/employees');
            }
        } catch (error) {
            console.error('Error fetching employee:', error);
            toast.error('Error al cargar empleado');
        } finally {
            setIsFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const companyId = localStorage.getItem('company_id');
        if (!companyId) {
            setIsLoading(false);
            return;
        }

        try {
            const url = isEditing ? `/api/employees/${id}` : '/api/employees';
            const method = isEditing ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'x-company-id': companyId
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(isEditing ? 'Empleado actualizado exitosamente' : 'Empleado registrado exitosamente');
                router.push('/admin/employees');
            } else {
                const errorData = await res.json();
                if (errorData.error === 'LIMIT_REACHED_EMPRENDEDOR' || errorData.error === 'LIMIT_REACHED_EMPRESARIAL') {
                    toast.error(`⚠️ Límite de plan alcanzado`, {
                        description: errorData.details,
                        duration: 8000,
                    });
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
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="p-8 text-center text-gray-500">Cargando información del empleado...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button 
                onClick={() => router.back()}
                className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-4 group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Volver a Empleados</span>
            </button>

            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <User className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isEditing ? `Datos de ${formData.name}` : 'Datos nuevo empleado'}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        {isEditing ? 'Actualiza los datos personales y contractuales' : 'Configura los detalles del nuevo ingreso'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-semibold text-blue-600 mb-6">Información General</h3>
                
                <div className="space-y-6">
                    {/* Nombre y Cédula */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre Completo<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej. Juan Pérez"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cédula<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    required
                                    type="text"
                                    name="cedula"
                                    value={formData.cedula}
                                    onChange={handleChange}
                                    placeholder="Ej. 1234567890"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cargo y WhatsApp */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cargo<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    required
                                    type="text"
                                    name="cargo"
                                    value={formData.cargo}
                                    onChange={handleChange}
                                    placeholder="Ej. Vendedor"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                WhatsApp (Opcional)
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Ej. 3001234567"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Salario y Riesgo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Salario Base<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                                <input
                                    required
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Clase Riesgo ARL<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <select
                                    name="riskClass"
                                    value={formData.riskClass}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 appearance-none bg-white"
                                >
                                    {RISK_CLASSES.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DIAN Integration Fields */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-purple-600 mb-6 flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Datos para Facturación Electrónica DIAN
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Empleado
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            />
                        </div>

                        {/* Tipo Contrato */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Contrato
                            </label>
                            <select
                                name="contractType"
                                value={formData.contractType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            >
                                <option value="1">Término Fijo</option>
                                <option value="2">Término Indefinido</option>
                                <option value="3">Obra o Labor</option>
                                <option value="4">Aprendizaje</option>
                                <option value="5">Prácticas o Pasantías</option>
                            </select>
                        </div>

                        {/* Tipo Trabajador */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo Trabajador
                            </label>
                            <select
                                name="workerType"
                                value={formData.workerType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            >
                                <option value="01">Dependiente</option>
                                <option value="02">Servicio Doméstico</option>
                                <option value="18">Dependiente Extranjero</option>
                            </select>
                        </div>

                        {/* Subtipo Trabajador */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subtipo Trabajador
                            </label>
                            <select
                                name="workerSubtype"
                                value={formData.workerSubtype}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            >
                                <option value="00">No aplica</option>
                            </select>
                        </div>

                        {/* Metodo Pago */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Método de Pago
                            </label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            >
                                <option value="1">Contado</option>
                                <option value="2">Crédito</option>
                            </select>
                        </div>

                        {/* Medio Pago */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Medio de Pago
                            </label>
                            <select
                                name="paymentMeans"
                                value={formData.paymentMeans}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            >
                                <option value="10">Efectivo</option>
                                <option value="42">Consignación bancaria</option>
                                <option value="47">Transferencia débito (PSE)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/employees')}
                        className="px-6 py-3 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Registrar Empleado')}
                    </button>
                </div>
            </form>
        </div>
    );
}
