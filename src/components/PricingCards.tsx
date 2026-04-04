'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PricingCards() {
    const [isAnnual, setIsAnnual] = useState(false);

    const discountRate = 0.10; // 10% de descuento

    const plans = [
        {
            name: 'Plan Semilla',
            monthlyPrice: 0,
            employees: 'Hasta 2 empleados',
            color: 'from-gray-400 to-gray-500',
            popular: false
        },
        {
            name: 'Plan Emprendedor',
            monthlyPrice: 50000,
            employees: 'Hasta 10 empleados',
            color: 'from-blue-500 to-purple-600',
            popular: true
        },
        {
            name: 'Plan Empresarial',
            monthlyPrice: 75000,
            extraEmployee: 7000,
            employees: 'Empleados sin límite ($7,000 por empleado extra despúes de 10)',
            color: 'from-indigo-600 to-violet-800',
            popular: false
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto p-4 py-12">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                    Precios transparentes
                </h2>
                
                <div className="flex items-center justify-center gap-4">
                    <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>Mensual</span>
                    <button 
                        onClick={() => setIsAnnual(!isAnnual)}
                        className="relative w-16 h-8 rounded-full bg-gray-200 p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                        style={{ backgroundColor: isAnnual ? '#8b5cf6' : '#e5e7eb' }}
                    >
                        <motion.div 
                            className="w-6 h-6 bg-white rounded-full shadow-md"
                            layout
                            animate={{ x: isAnnual ? 32 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    </button>
                    <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                        Anual <span className="ml-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">-10%</span>
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                {plans.map((plan, idx) => {
                    const price = isAnnual && plan.monthlyPrice > 0 
                        ? plan.monthlyPrice * (1 - discountRate)
                        : plan.monthlyPrice;

                    return (
                        <motion.div 
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative bg-white rounded-3xl p-8 border ${plan.popular ? 'border-purple-400 shadow-2xl shadow-purple-500/20 scale-105 z-10' : 'border-gray-200 shadow-lg'} flex flex-col`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    Más Elegido
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            
                            <div className="my-6">
                                <div className="flex items-end gap-1">
                                    <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r ${plan.color}" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
                                        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${plan.color}`}>
                                            ${price.toLocaleString()}
                                        </span>
                                    </span>
                                    {plan.monthlyPrice > 0 && <span className="text-gray-500 text-lg mb-1">/mes</span>}
                                </div>
                                {isAnnual && plan.monthlyPrice > 0 && (
                                    <p className="text-sm text-gray-400 mt-1 line-through">
                                        ${plan.monthlyPrice.toLocaleString()} /mes
                                    </p>
                                )}
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 mt-auto border border-gray-100 flex-grow flex items-center justify-center text-center">
                                <p className="text-gray-700 font-medium">
                                    {plan.employees}
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
