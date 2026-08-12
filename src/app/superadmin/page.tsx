'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Users, Calendar, Phone, Mail, Shield, LogOut, TrendingUp, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import NominaXLogo from '@/components/NominaXLogo';

interface Company {
    id: number;
    name: string;
    companyName: string | null;
    email: string | null;
    phone: string | null;
    plan: string;
    createdAt: string;
    _count: { employees: number };
}

export default function SuperAdminPage() {
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        const role = localStorage.getItem('user_role');
        if (role !== 'SUPERADMIN') {
            router.replace('/');
            return;
        }
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/superadmin/companies', {
                headers: { 'x-superadmin-key': 'NominaX' }
            });
            const data = await res.json();
            if (res.ok) {
                setCompanies(data.companies);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('company_id');
        localStorage.removeItem('company_name');
        localStorage.removeItem('user_role');
        localStorage.removeItem('auth_token');
        router.push('/');
    };

    const planBadge = (plan: string) => {
        const styles: Record<string, string> = {
            SEMILLA: 'bg-amber-50 text-amber-700 border border-amber-200',
            EMPRENDEDOR: 'bg-blue-50 text-blue-700 border border-blue-200',
            EMPRESARIAL: 'bg-purple-50 text-purple-700 border border-purple-200',
        };
        return styles[plan] || 'bg-gray-50 text-gray-700 border border-gray-200';
    };

    const trialCompanies = companies.filter(c => c.plan === 'SEMILLA');
    const paidCompanies = companies.filter(c => c.plan !== 'SEMILLA');

    return (
        <div className="min-h-screen bg-[#0f1014] font-sans">
            {/* Header */}
            <header className="border-b border-gray-800 bg-[#13151a]">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <NominaXLogo className="scale-75 origin-left" lightTheme={true} />
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-900/40 border border-indigo-700/50 rounded-full">
                            <Shield className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Portal Propietario</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchCompanies}
                            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-gray-700 rounded-lg transition-all text-sm"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-white bg-red-900/20 hover:bg-red-900/40 border border-red-800/50 rounded-lg transition-all text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Salir
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Title */}
                <div>
                    <h1 className="text-2xl font-bold text-white">Panel de Control</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Vista general de todas las empresas registradas en NominaX
                        {lastUpdated && (
                            <span className="ml-2 text-gray-600">
                                · Actualizado {format(lastUpdated, "HH:mm:ss")}
                            </span>
                        )}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#13151a] border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-900/40 border border-blue-700/50 rounded-xl flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">{companies.length}</p>
                            <p className="text-gray-400 text-sm">Empresas totales</p>
                        </div>
                    </div>
                    <div className="bg-[#13151a] border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-900/40 border border-amber-700/50 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">{trialCompanies.length}</p>
                            <p className="text-gray-400 text-sm">En prueba (Semilla)</p>
                        </div>
                    </div>
                    <div className="bg-[#13151a] border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-900/40 border border-green-700/50 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white">
                                {companies.reduce((acc, c) => acc + c._count.employees, 0)}
                            </p>
                            <p className="text-gray-400 text-sm">Empleados registrados</p>
                        </div>
                    </div>
                </div>

                {/* Companies Table */}
                <div className="bg-[#13151a] border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                        <h2 className="text-white font-semibold">Empresas Registradas</h2>
                        <span className="text-xs text-gray-500">{companies.length} registros</span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                        </div>
                    ) : companies.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p>No hay empresas registradas aún</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800/60">
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Empresa</th>
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contacto</th>
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Empleados</th>
                                        <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registro</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/40">
                                    {companies.map((company, idx) => (
                                        <tr key={company.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-4 px-6 text-gray-600 text-sm">{idx + 1}</td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                        {company.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium text-sm">{company.name}</p>
                                                        {company.companyName && (
                                                            <p className="text-gray-500 text-xs">{company.companyName}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1">
                                                    {company.email ? (
                                                        <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                                                            <Mail className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                                                            {company.email}
                                                        </div>
                                                    ) : null}
                                                    {company.phone ? (
                                                        <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                                                            <Phone className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                                                            {company.phone}
                                                        </div>
                                                    ) : null}
                                                    {!company.email && !company.phone && (
                                                        <span className="text-gray-600 text-xs italic">Sin contacto</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${planBadge(company.plan)}`}>
                                                    {company.plan}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                                                    <Users className="w-3.5 h-3.5 text-gray-500" />
                                                    {company._count.employees}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                                    <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                                                    {format(new Date(company.createdAt), "d MMM yyyy", { locale: es })}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
