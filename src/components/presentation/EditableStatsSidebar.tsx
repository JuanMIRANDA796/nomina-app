'use client';

import React, { useState } from 'react';

interface EditableStatsSidebarProps {
    totals: any;
    onUpdate: (field: string, value: string) => void;
    /** 'milM' (default) = divide/1000, show "mil M" | 'bill' = divide/1000000, show "bill." */
    amountUnit?: 'milM' | 'bill';
}

interface EditableStatProps {
    label: string;
    displayValue: React.ReactNode;
    editValue: string;
    color: string;
    field: string;
    editingField: string | null;
    onStartEdit: (field: string, val: string) => void;
    onCommit: () => void;
    onChange: (v: string) => void;
    currentEditValue: string;
}

function EditableStat({
    label, displayValue, editValue, color, field,
    editingField, onStartEdit, onCommit, onChange, currentEditValue
}: EditableStatProps) {
    return (
        <div>
            <p className="text-xs text-slate-400 uppercase font-bold mb-1">{label}</p>
            {editingField === field ? (
                <input
                    autoFocus
                    className={`text-2xl font-bold ${color} bg-white/10 border border-white/20 rounded-lg px-2 py-0.5 w-full outline-none focus:border-white/50`}
                    value={currentEditValue}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onCommit}
                    onKeyDown={(e) => e.key === 'Enter' && onCommit()}
                />
            ) : (
                <p
                    className={`text-2xl font-bold ${color} cursor-pointer group flex items-center gap-1 hover:opacity-80 transition-opacity`}
                    onDoubleClick={() => onStartEdit(field, editValue)}
                    title="Doble clic para editar"
                >
                    {displayValue}
                    <span className="opacity-0 group-hover:opacity-40 transition-opacity text-xs text-slate-400">✎</span>
                </p>
            )}
        </div>
    );
}

export default function EditableStatsSidebar({ totals, onUpdate, amountUnit = 'milM' }: EditableStatsSidebarProps) {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const startEdit = (field: string, val: string) => {
        setEditingField(field);
        setEditValue(val);
    };

    const commitEdit = () => {
        if (editingField) {
            onUpdate(editingField, editValue);
            setEditingField(null);
        }
    };

    const entityCount = totals?.entity?.split(' ')[0] ?? '-';
    const amount = totals?.amount;
    const amountDisplay = amount != null
        ? amountUnit === 'bill'
            ? `$${(amount / 1000000).toLocaleString('es-CO', { maximumFractionDigits: 2 })} bill.`
            : `$${(amount / 1000).toFixed(2)} mil M`
        : '-';
    const disbursements = totals?.disbursements_num;
    const tpp = totals?.tpp;
    const tppDisplay = tpp != null ? `${tpp.toFixed(2).replace('.', ',')}%` : '-';

    return (
        <div className="w-48 flex flex-col justify-center gap-6 border-r border-white/10 pr-6">
            <EditableStat
                label="Entidades"
                displayValue={entityCount}
                editValue={totals?.entity ?? ''}
                color="text-sky-400"
                field="entity"
                editingField={editingField}
                onStartEdit={startEdit}
                onCommit={commitEdit}
                onChange={setEditValue}
                currentEditValue={editValue}
            />
            <EditableStat
                label="Monto Total"
                displayValue={amountDisplay}
                editValue={amount?.toString() ?? ''}
                color="text-orange-400"
                field="amount"
                editingField={editingField}
                onStartEdit={startEdit}
                onCommit={commitEdit}
                onChange={setEditValue}
                currentEditValue={editValue}
            />
            <EditableStat
                label="Desembolsos"
                displayValue={disbursements?.toLocaleString() ?? '-'}
                editValue={disbursements?.toString() ?? ''}
                color="text-slate-200"
                field="disbursements_num"
                editingField={editingField}
                onStartEdit={startEdit}
                onCommit={commitEdit}
                onChange={setEditValue}
                currentEditValue={editValue}
            />
            <EditableStat
                label="Tasa Prom. EA"
                displayValue={tppDisplay}
                editValue={tpp?.toString() ?? ''}
                color="text-emerald-400"
                field="tpp"
                editingField={editingField}
                onStartEdit={startEdit}
                onCommit={commitEdit}
                onChange={setEditValue}
                currentEditValue={editValue}
            />
        </div>
    );
}
