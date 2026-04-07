'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, QrCode, Shield, Zap, FileText, Headphones,  PieChart, ChevronRight, X, Phone } from 'lucide-react';
import Link from 'next/link';

export default function PricingCards() {
    const [isAnnual, setIsAnnual] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [checkoutStep, setCheckoutStep] = useState(1);

    const discountRate = 0.10; // 10% de descuento

    const baseBenefits = [
        { icon: Shield, text: 'Seguridad total de tus datos' },
        { icon: Zap, text: 'Automatización y control' },
        { icon: FileText, text: 'Respaldo legal de la nómina' },
        { icon: Headphones, text: 'Soporte constante y dedicado' },
        { icon: PieChart, text: 'Reportes interactivos del gasto' }
    ];

    const plans = [
        {
            name: 'Prueba Gratis',
            monthlyPrice: 0,
            employees: 'Hasta 10 empleados (por 30 días)',
            color: 'from-gray-400 to-gray-500',
            popular: false,
            benefits: baseBenefits,
            buttonText: 'Empezar mi Prueba',
            isFree: true
        },
        {
            name: 'Plan Emprendedor',
            monthlyPrice: 50000,
            extraEmployee: 5000,
            employees: 'Hasta 10 empleados (+$5.000 / empleado adicional)',
            color: 'from-blue-500 to-purple-600',
            popular: true,
            benefits: [{ icon: Check, text: 'Hasta 10 Empleados' }, ...baseBenefits],
            buttonText: 'Usar este plan',
            isFree: false
        },
        {
            name: 'Plan Empresarial',
            monthlyPrice: 79000,
            extraEmployee: 4000,
            employees: 'Hasta 20 empleados (+$4.000 / empleado extra después de 20)',
            color: 'from-indigo-600 to-violet-800',
            popular: false,
            benefits: [{ icon: Check, text: 'Hasta 20 Empleados' }, ...baseBenefits],
            buttonText: 'Usar este plan',
            isFree: false
        }
    ];

    const openCheckout = (plan: any) => {
        if (plan.isFree) {
            // Ir al landing page con el modal de registro abierto
            window.location.href = '/?mode=signup';
            return;
        }
        setSelectedPlan(plan);
        setCheckoutStep(1);
    };

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
                                    <span className={`text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r ${plan.color}`}>
                                        ${price.toLocaleString()}
                                    </span>
                                    {plan.monthlyPrice > 0 && <span className="text-gray-500 text-lg mb-1">/mes</span>}
                                </div>
                                {isAnnual && plan.monthlyPrice > 0 && (
                                    <p className="text-sm text-gray-400 mt-1 line-through">
                                        ${plan.monthlyPrice.toLocaleString()} /mes
                                    </p>
                                )}
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100 flex items-center justify-center text-center">
                                <p className="text-gray-700 font-medium">
                                    {plan.employees}
                                </p>
                            </div>

                            <button
                                onClick={() => openCheckout(plan)}
                                className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl mt-auto bg-gradient-to-r ${plan.color} hover:scale-[1.02]`}
                            >
                                {plan.buttonText}
                            </button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Checkput Modal */}
            <AnimatePresence>
                {selectedPlan && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
                        >
                            {/* Left Panel - Benefits */}
                            <div className="w-full md:w-5/12 bg-gray-50 p-6 md:p-8 border-r border-gray-200 hidden md:block overflow-y-auto max-h-[90vh]">
                                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Estás eligiendo</h3>
                                <h4 className={`text-3xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r ${selectedPlan.color}`}>
                                    {selectedPlan.name}
                                </h4>
                                
                                <p className="text-gray-600 font-medium mb-6">Al activar este plan, desbloqueas inmediatamente:</p>
                                
                                <div className="space-y-5">
                                    {selectedPlan.benefits.map((benefit: any, idx: number) => {
                                        const Icon = benefit.icon;
                                        return (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedPlan.color} text-white shadow-md`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-gray-700 font-medium">{benefit.text}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Right Panel - Action Steps */}
                            <div className="w-full md:w-7/12 p-6 md:p-8 relative flex flex-col justify-between min-h-[500px] max-h-[90vh] overflow-y-auto">
                                {/* Mobile Header */}
                                <div className="md:hidden text-center mb-6">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase">Suscripción a</h3>
                                    <h4 className={`text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r ${selectedPlan.color}`}>
                                        {selectedPlan.name}
                                    </h4>
                                </div>

                                {/* Step Content */}
                                <AnimatePresence mode="wait">
                                    {checkoutStep === 1 ? (
                                        <motion.div 
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex flex-col flex-1"
                                        >
                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold">1</div>
                                                <h3 className="text-xl font-bold text-gray-900">Realiza el pago</h3>
                                            </div>
                                            
                                            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6">
                                                <p className="text-gray-600 mb-4 text-center">Escanea este código QR desde tu App Bancolombia o Nequi para realizar el pago de <strong className="text-gray-900">${(isAnnual ? selectedPlan.monthlyPrice * (1 - discountRate) : selectedPlan.monthlyPrice).toLocaleString()}</strong></p>
                                                
                                                <div className="w-full max-w-[220px] md:max-w-[240px] aspect-square bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center shadow-inner mb-4 overflow-hidden relative group">
                                                    <img 
                                                        src="/qr_bancolombia.png" 
                                                        alt="QR Bancolombia" 
                                                        className="w-full h-full object-contain p-2"
                                                    />
                                                </div>

                                                <div className="text-center mb-4">
                                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1 text-blue-600">Cuenta de Ahorros Bancolombia</p>
                                                    <p className="text-xl font-black text-gray-900 tabular-nums">377-856141-10</p>
                                                </div>

                                                <div className="w-full bg-red-50 border border-red-200 p-4 rounded-xl">
                                                    <p className="text-red-800 text-sm text-center font-bold">
                                                        ⚠️ Importante: Para activar la suscripción, debes enviar el comprobante en el siguiente paso. No cierres esta ventana.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-auto">
                                                <button
                                                    onClick={() => setCheckoutStep(2)}
                                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
                                                >
                                                    Ya pagué, continuar <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex flex-col flex-1"
                                        >
                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white font-bold">2</div>
                                                <h3 className="text-xl font-bold text-gray-900">Envía el Comprobante</h3>
                                            </div>
                                            
                                            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6 flex-1">
                                                <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center mb-4 overflow-hidden shadow-sm">
                                                    <img 
                                                        src="/qr_whatsapp.png" 
                                                        alt="QR WhatsApp" 
                                                        className="w-full h-full object-contain p-2"
                                                    />
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900 text-center mb-2">¡Casi listo!</h4>
                                                <p className="text-gray-600 text-center mb-6 text-sm">
                                                    Escanea el código o dale clic al botón para enviar tu comprobante a nuestra línea <span className="font-bold text-green-600">320 794 1082</span>.
                                                </p>
                                                
                                                <a 
                                                    href={`https://wa.me/573207941082?text=Hola,%20adjunto%20comprobante%20de%20pago%20de%20$${(isAnnual ? selectedPlan.monthlyPrice * (1 - discountRate) : selectedPlan.monthlyPrice).toLocaleString()}%20para%20activar%20el%20${selectedPlan.name}.`} 
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-full shadow-lg shadow-green-600/30 transition-all hover:scale-105"
                                                >
                                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                                    Enviar WhatsApp a Soporte
                                                </a>
                                            </div>

                                            <div className="mt-auto">
                                                <button
                                                    onClick={() => setSelectedPlan(null)}
                                                    className="w-full py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all"
                                                >
                                                    Entendido, he enviado el comprobante
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
