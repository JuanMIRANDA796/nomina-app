'use client';

import React, { useState, useEffect } from 'react';
import { usePresentation } from '@/context/PresentationContext';
import { Cloud, CloudCheck, CloudOff, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function SyncStatusIndicator() {
    const { isSaving, lastSyncedAt, syncError, refreshFromServer, isLoading } = usePresentation();
    const [timeAgo, setTimeAgo] = useState<string>('');
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!lastSyncedAt) return;
        
        const update = () => {
            setTimeAgo(formatDistanceToNow(lastSyncedAt, { addSuffix: true, locale: es }));
        };
        
        update();
        const interval = setInterval(update, 30000); // Actualizar cada 30s
        return () => clearInterval(interval);
    }, [lastSyncedAt]);

    if (isLoading) return null;

    return (
        <div 
            className="fixed bottom-6 left-6 z-[100]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.9 }}
                        className="absolute left-14 bottom-0 bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-2xl min-w-[200px]"
                    >
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estado de Nube</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${syncError ? 'bg-red-500 animate-pulse' : isSaving ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                                <span className="text-sm font-medium text-white">
                                    {syncError ? 'Error de conexión' : isSaving ? 'Guardando...' : 'Sincronizado'}
                                </span>
                            </div>
                            {lastSyncedAt && !isSaving && (
                                <span className="text-[10px] text-slate-400">
                                    Última vez: {timeAgo}
                                </span>
                            )}
                            {syncError && (
                                <span className="text-[10px] text-red-400 mt-1 leading-tight">
                                    {syncError}
                                </span>
                            )}
                            <button
                                onClick={() => refreshFromServer()}
                                disabled={isSaving}
                                className="mt-2 flex items-center justify-center gap-2 w-full py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[11px] font-bold text-white transition-all border border-white/5 disabled:opacity-50"
                            >
                                <RefreshCw className={`w-3 h-3 ${isSaving ? 'animate-spin' : ''}`} />
                                Forzar Sincronización
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => refreshFromServer()}
                className={`flex items-center justify-center p-3 rounded-2xl border backdrop-blur-xl shadow-lg transition-all
                    ${syncError 
                        ? 'bg-red-500/20 border-red-500/50 text-red-500 shadow-red-500/20' 
                        : isSaving 
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-amber-500/20' 
                            : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500 shadow-emerald-500/20'
                    }`}
            >
                {syncError ? (
                    <CloudOff className="w-6 h-6" />
                ) : isSaving ? (
                    <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                    <Cloud className="w-6 h-6" />
                )}
                
                {!syncError && !isSaving && (
                    <motion.div 
                        layoutId="status-dot"
                        className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-lg" 
                    />
                )}
            </motion.button>
        </div>
    );
}
