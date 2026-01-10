'use client';

import { useState, useEffect } from 'react';
import { Users, Clock, DollarSign, TrendingUp, Activity, UserCheck, UserX } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardStats {
    employees: {
        total: number;
        inactive: number;
        active: number;
    };
    attendance: {
        present: number;
        workingNow: number;
        absent: number;
    };
    financials: {
        projectedMonthly: number;
    };
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/dashboard');
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Refresh every minute for "Real-time" feel
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!stats) return null;

    // Calculate percentages
    const activePercent = stats.employees.total > 0
        ? Math.round((stats.employees.active / stats.employees.total) * 100)
        : 0;

    const attendancePercent = stats.employees.active > 0
        ? Math.round((stats.attendance.workingNow / stats.employees.active) * 100)
        : 0;

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Resumen en tiempo real de tu organización</p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. Real-time Attendance Card (Circular) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="font-semibold text-gray-700">Asistencia en Vivo</h3>
                            <p className="text-xs text-gray-400">Empleados trabajando ahora</p>
                        </div>
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full animate-pulse">
                            <Activity className="w-3 h-3" /> LIVE
                        </span>
                    </div>

                    <div className="flex items-center justify-center py-4">
                        <div className="relative w-40 h-40">
                            {/* Background Circle */}
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-gray-100"
                                />
                                {/* Progress Circle */}
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={440} // 2 * pi * 70
                                    strokeDashoffset={440 - (440 * attendancePercent) / 100}
                                    className="text-blue-600 transition-all duration-1000 ease-out"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-gray-900">{attendancePercent}%</span>
                                <span className="text-xs text-gray-500 font-medium">Activos</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-2">
                        <p className="text-sm text-gray-600">
                            <span className="font-bold text-gray-900">{stats.attendance.workingNow}</span> de {stats.employees.active} empleados
                        </p>
                    </div>
                </motion.div>

                {/* 2. Employee Status Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between"
                >
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-700">Estado del Personal</h3>
                        <p className="text-xs text-gray-400">Distribución de contratos</p>
                    </div>

                    <div className="space-y-6">
                        {/* Active Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 flex items-center gap-2">
                                    <UserCheck className="w-4 h-4 text-blue-500" /> Activos
                                </span>
                                <span className="font-bold text-gray-900">{stats.employees.active}</span>
                            </div>
                            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(stats.employees.active / stats.employees.total) * 100}%` }}
                                    className="h-full bg-blue-500 rounded-full"
                                />
                            </div>
                        </div>

                        {/* Inactive Bar */}
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600 flex items-center gap-2">
                                    <UserX className="w-4 h-4 text-red-400" /> Inactivos
                                </span>
                                <span className="font-bold text-gray-900">{stats.employees.inactive}</span>
                            </div>
                            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(stats.employees.inactive / stats.employees.total) * 100}%` }}
                                    className="h-full bg-red-400 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 3. Payroll Projection (Metric Card) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <DollarSign className="w-24 h-24 text-white" />
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="p-2 bg-white/10 w-fit rounded-lg mb-4">
                                <TrendingUp className="w-6 h-6 text-green-400" />
                            </div>
                            <h3 className="text-gray-300 font-medium">Nómina Mensual (Est.)</h3>
                            <div className="mt-2 text-3xl font-bold tracking-tight">
                                ${stats.financials.projectedMonthly.toLocaleString()}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Proyección base salarial</p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <Clock className="w-4 h-4 text-blue-400" />
                                <span>Corte al {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity Section (Placeholder for future) */}
            <div className="grid grid-cols-1">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-4">Resumen Rápido</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl text-center">
                            <div className="text-2xl font-bold text-gray-900">{stats.employees.total}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total Empleados</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl text-center">
                            <div className="text-2xl font-bold text-green-700">{stats.attendance.present}</div>
                            <div className="text-xs text-green-600 uppercase tracking-wide mt-1">Asistieron Hoy</div>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl text-center">
                            <div className="text-2xl font-bold text-blue-700">{stats.attendance.workingNow}</div>
                            <div className="text-xs text-blue-600 uppercase tracking-wide mt-1">En Turno</div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-xl text-center">
                            <div className="text-2xl font-bold text-red-700">{stats.employees.total - stats.attendance.present}</div>
                            <div className="text-xs text-red-600 uppercase tracking-wide mt-1">Ausentes / Libres</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
