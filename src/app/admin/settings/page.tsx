'use client';

import Link from 'next/link';
import { Building2, KeyRound } from 'lucide-react';

export default function SettingsHubPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Configuración</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link
                    href="/admin/settings/company"
                    className="block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-blue-300 transition-all group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Datos Básicos</h2>
                    </div>
                    <p className="text-gray-600 mb-4 h-12">
                        Edita los datos básicos de tu empresa como nombre, razón social, NIT y contacto.
                    </p>
                    <div className="text-blue-600 font-medium flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        Editar <span aria-hidden="true">&rarr;</span>
                    </div>
                </Link>

                <Link
                    href="/admin/settings/credentials"
                    className="block p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:emerald-300 transition-all group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg group-hover:scale-110 transition-transform">
                            <KeyRound className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Credenciales de Acceso</h2>
                    </div>
                    <p className="text-gray-600 mb-4 h-12">
                        Cambia tu usuario o contraseña para acceder al panel administrativo.
                    </p>
                    <div className="text-emerald-600 font-medium flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        Editar <span aria-hidden="true">&rarr;</span>
                    </div>
                </Link>
            </div>
        </div>
    );
}
