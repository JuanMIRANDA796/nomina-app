'use client';

import React, { useState } from 'react';

interface EditableChartTitleProps {
    mainTitle: string;
    subtitle?: string;
    monthLabel: string;
    onTitleChange?: (newTitle: string) => void;
    onSubtitleChange?: (newSubtitle: string) => void;
    subtitleColor?: string;
    monthColor?: string;
}

export default function EditableChartTitle({
    mainTitle,
    subtitle,
    monthLabel,
    onTitleChange,
    onSubtitleChange,
    subtitleColor = 'text-slate-400',
    monthColor = 'text-slate-200',
}: EditableChartTitleProps) {
    const [editingMain, setEditingMain] = useState(false);
    const [editingSubtitle, setEditingSubtitle] = useState(false);
    const [localMain, setLocalMain] = useState(mainTitle);
    const [localSubtitle, setLocalSubtitle] = useState(subtitle ?? '');

    const commitMain = () => {
        setEditingMain(false);
        onTitleChange?.(localMain);
    };

    const commitSubtitle = () => {
        setEditingSubtitle(false);
        onSubtitleChange?.(localSubtitle);
    };

    return (
        <div className="flex flex-col gap-1">
            {/* Main Title */}
            {editingMain ? (
                <input
                    autoFocus
                    className="text-2xl font-bold text-white bg-white/10 border border-white/20 rounded-lg px-2 py-0.5 outline-none focus:border-pink-500 w-full"
                    value={localMain}
                    onChange={(e) => setLocalMain(e.target.value)}
                    onBlur={commitMain}
                    onKeyDown={(e) => e.key === 'Enter' && commitMain()}
                />
            ) : (
                <h3
                    className="text-2xl font-bold text-white cursor-pointer group flex items-center gap-2"
                    onDoubleClick={() => setEditingMain(true)}
                    title="Doble clic para editar"
                >
                    {localMain}{' '}
                    <span className={monthColor}>{monthLabel}</span>
                    <span className="opacity-0 group-hover:opacity-40 transition-opacity text-xs text-slate-400 ml-1">✎</span>
                </h3>
            )}

            {/* Subtitle */}
            {subtitle !== undefined && (
                editingSubtitle ? (
                    <input
                        autoFocus
                        className={`font-semibold text-lg bg-white/10 border border-white/20 rounded-lg px-2 py-0.5 outline-none focus:border-pink-500 w-full ${subtitleColor}`}
                        value={localSubtitle}
                        onChange={(e) => setLocalSubtitle(e.target.value)}
                        onBlur={commitSubtitle}
                        onKeyDown={(e) => e.key === 'Enter' && commitSubtitle()}
                    />
                ) : (
                    <p
                        className={`font-semibold text-lg uppercase tracking-widest cursor-pointer group flex items-center gap-1 ${subtitleColor}`}
                        onDoubleClick={() => setEditingSubtitle(true)}
                        title="Doble clic para editar"
                    >
                        {localSubtitle}
                        <span className="opacity-0 group-hover:opacity-40 transition-opacity text-xs text-slate-400 ml-1">✎</span>
                    </p>
                )
            )}
        </div>
    );
}
