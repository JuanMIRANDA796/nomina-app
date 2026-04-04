'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Save, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

export default function CompanySettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [formData, setFormData] = useState({
        companyName: '',
        businessName: '',
        documentType: 'Cédula de ciudadanía',
        documentNumber: '',
        phone: '',
    });

    useEffect(() => {
        const fetchCompanyData = async () => {
            const companyId = localStorage.getItem('company_id') || '1';
            try {
                const res = await fetch(`/api/settings/company?companyId=${companyId}`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        companyName: data.companyName || '',
                        businessName: data.businessName || '',
                        documentType: data.documentType || 'Cédula de ciudadanía',
                        documentNumber: data.documentNumber || '',
                        phone: data.phone || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching company data:', error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchCompanyData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const companyId = localStorage.getItem('company_id') || '1';
        
        try {
            const res = await fetch('/api/settings/company', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: companyId, ...formData }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al actualizar');
            }

            toast.success('Datos actualizados correctamente');
            router.push('/admin/settings');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="p-8 text-center text-gray-500">Cargando...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Building2 className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Datos Básicos</h1>
                    <p className="text-gray-500 text-sm">Edita los datos básicos de tu empresa</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-semibold text-purple-600 mb-6">Datos básicos de tu empresa</h3>
                
                <div className="space-y-6">
                    {/* Nombre de la empresa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre de la empresa<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            placeholder="Ej. Mi Empresa Web"
                        />
                    </div>
                    
                    {/* Razón Social */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Razón social<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tipo de Documento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de documento<span className="text-red-500">*</span>
                            </label>
                            <select
                                name="documentType"
                                value={formData.documentType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            >
                                <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                                <option value="NIT">NIT</option>
                                <option value="Cédula de extranjería">Cédula de extranjería</option>
                                <option value="Pasaporte">Pasaporte</option>
                            </select>
                        </div>

                        {/* Número de Documento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Número de documento<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="documentNumber"
                                value={formData.documentNumber}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Número Celular */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número celular<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                    </div>

                    {/* RUT */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <label className="block text-sm font-medium text-gray-700">RUT</label>
                            <div className="w-4 h-4 rounded-full border border-purple-500 flex items-center justify-center text-purple-500 text-xs cursor-help" title="Registro Único Tributario">i</div>
                        </div>
                        <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                            <UploadCloud className="w-8 h-8 text-purple-400 group-hover:text-purple-600 mb-2 transition-colors" />
                            <span className="text-gray-500 text-sm">Arrastrar aquí o hacer clic para subir</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/settings')}
                        className="px-6 py-3 rounded-lg font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20 flex items-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
}
