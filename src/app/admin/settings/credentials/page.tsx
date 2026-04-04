'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function CredentialsSettingsPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            toast.error('Las contraseñas nuevas no coinciden');
            return;
        }

        if (!formData.currentPassword) {
            toast.error('Debes ingresar tu contraseña actual para confirmar los cambios');
            return;
        }

        setIsLoading(true);
        const companyId = localStorage.getItem('company_id') || '1';

        try {
            const res = await fetch('/api/settings/credentials', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: companyId,
                    username: formData.username,
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al actualizar credenciales');
            }

            toast.success('Credenciales actualizadas correctamente. Tu sesión podría expirar.');
            router.push('/admin/settings');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                    <KeyRound className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Credenciales de Acceso</h1>
                    <p className="text-gray-500 text-sm">Cambia tu usuario o contraseña</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nuevo Usuario (Opcional)
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Dejar en blanco para mantener el actual"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    />
                </div>

                <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Actualizar Contraseña</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nueva Contraseña (Opcional)
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Nueva contraseña"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmar Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirma tu nueva contraseña"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-6 bg-red-50 p-4 rounded-lg border border-red-100">
                    <label className="block text-sm font-medium text-red-800 mb-2">
                        Contraseña Actual <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-red-600 mb-2">Requerida para autorizar cualquier cambio</p>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        placeholder="Contraseña actual"
                        className="w-full px-4 py-3 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    />
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
                        className="px-6 py-3 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
}
