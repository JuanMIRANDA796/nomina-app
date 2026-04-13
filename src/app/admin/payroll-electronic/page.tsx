'use client';

import { useState, useEffect } from 'react';
import { 
    CheckCircle2, 
    ChevronRight, 
    ChevronLeft, 
    Building2, 
    ShieldCheck, 
    FileText, 
    Rocket,
    Globe,
    Mail,
    MapPin,
    CreditCard,
    Save,
    UploadCloud,
    Settings,
    FileSignature,
    RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function PayrollElectronicOnboarding() {
    // 0: Intro, 1: Info, 2: Habilitacion, 3: Verificacion, 4: Firma, 5: Configuracion, 6: Success
    const [currentStep, setCurrentStep] = useState(0); 
    const [isLoading, setIsLoading] = useState(false);
    
    // Form states
    const [formData, setFormData] = useState({
        businessName: '',
        nit: '',
        dv: '',
        email: '',
        department: '',
        city: '',
        address: '',
        documentType: 'NIT',
        testSetId: '',
        authSignature: false,
        prefix: 'NE',
        startNumber: '1',
    });

    const handleNext = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => setCurrentStep(prev => prev - 1);

    // Simulated action for the verification process
    const handleSimulateVerification = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Verificación exitosa. DIAN ha aceptado el set de pruebas.');
            handleNext();
        }, 1500);
    };

    // INTRO
    const renderIntro = () => (
        <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                        <Rocket className="w-5 h-5" /> Configuración de Nómina Electrónica
                    </h2>
                    <p className="text-blue-700 text-sm mt-1">
                        Sonríe. En este paso a paso, debes mostrarle a la DIAN que el software que elegiste funciona ¡al pelo!
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Estás a punto de configurar tu nómina electrónica</h3>
                    <p className="text-gray-600 mb-8">Antes de comenzar es importante que tengas esta información a la mano:</p>
                    
                    <ul className="space-y-6">
                        <li className="flex items-center gap-4 group">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <CheckCircle2 className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                            </div>
                            <span className="text-gray-700 font-medium">Datos de acceso al portal de la DIAN - MUISCA</span>
                        </li>
                        <li className="flex items-center gap-4 group">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <CheckCircle2 className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                            </div>
                            <span className="text-gray-700 font-medium">Datos legales de la empresa (NIT, Datos del representante legal)</span>
                        </li>
                        <li className="flex items-center gap-4 group">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <CheckCircle2 className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                            </div>
                            <span className="text-gray-700 font-medium">Acceso al correo registrado en el RUT</span>
                        </li>
                    </ul>

                    <button 
                        onClick={() => handleNext()}
                        className="mt-12 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                    >
                        Comenzar configuración
                    </button>
                </div>
            </div>
        </div>
    );

    // STEP 1
    const renderStep1 = () => (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Información de la empresa</h2>
                <p className="text-gray-500">Por favor verifica y completa la información de tu empresa. Esta debe ser la misma que tienes registrada en la DIAN.</p>
            </div>

            <form onSubmit={(e) => handleNext(e)} className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Razón social*</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 font-medium"
                            value={formData.businessName}
                            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Correo electrónico del RUT*</label>
                        <input 
                            type="email" 
                            placeholder="ejemplo@correo.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 font-medium"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Tipo de documento*</label>
                        <select 
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all text-gray-900 font-medium"
                            value={formData.documentType}
                            onChange={(e) => setFormData({...formData, documentType: e.target.value})}
                        >
                            <option value="NIT">NIT</option>
                            <option value="CC">Cédula de ciudadanía</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Número de documento*</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 font-medium"
                            value={formData.nit}
                            onChange={(e) => setFormData({...formData, nit: e.target.value})}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">Datos de ubicación</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Departamento*</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 font-medium"
                                value={formData.department}
                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Ciudad*</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 font-medium"
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-700">Dirección*</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 font-medium"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                placeholder="Escribe la dirección registrada en el RUT"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button 
                        type="button" 
                        onClick={handleBack}
                        className="px-8 py-3 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                    >
                        Regresar
                    </button>
                    <button 
                        type="submit"
                        className="px-8 py-3 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                    >
                        Siguiente paso
                    </button>
                </div>
            </form>
        </div>
    );

    // STEP 2
    const renderStep2 = () => (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Habilitación en la DIAN</h2>
                <p className="text-gray-500">Ingresa el código que te proporciona el portal MUISCA de la DIAN.</p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 space-y-10">
                <div className="space-y-4">
                    <div className="p-4 bg-sky-50 border-l-4 border-sky-500 rounded-r-lg">
                        <p className="text-sm text-sky-800">
                            <strong>Instrucción:</strong> Ingresa al portal de la DIAN y registra tu empresa como emisor de Nómina Electrónica usando NóminaX como software tecnológico. La DIAN te arrojará el código a continuación.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700">Código TestSetID*</label>
                    <input 
                        type="text" 
                        placeholder="Ej: 7889bcab-4355-8900-bcaa-90887654"
                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-500 outline-none transition-all font-mono text-gray-900 text-lg"
                        value={formData.testSetId}
                        onChange={(e) => setFormData({...formData, testSetId: e.target.value})}
                    />
                    <p className="text-xs text-gray-500">Asegúrate de copiar y pegar el código completo sin espacios.</p>
                </div>

                <div className="flex gap-4 pt-6">
                    <button 
                        type="button" 
                        onClick={(e) => handleNext(e)}
                        className="flex-1 px-8 py-4 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 transition-all shadow-lg text-center"
                    >
                        Guardar y continuar
                    </button>
                    <button 
                        type="button" 
                        onClick={handleBack}
                        className="px-8 py-4 rounded-full font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        Regresar
                    </button>
                </div>
            </div>
        </div>
    );

    // STEP 3
    const renderStep3 = () => (
        <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Verificación en la DIAN</h2>
                <p className="text-gray-500">En este paso enviaremos los documentos de prueba obligatorios a tu portal de la DIAN.</p>
            </div>

            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <RefreshCw className={`w-10 h-10 ${isLoading ? 'animate-spin' : ''}`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">Set de Pruebas DIAN</h3>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                    Presiona el botón para que NóminaX emita y envíe automáticamente 4 documentos de nómina y 4 de ajuste para completar el requisito legal en tu TestSetID.
                </p>

                <div className="flex gap-4 w-full justify-center">
                    <button 
                        type="button" 
                        onClick={handleBack}
                        className="px-8 py-4 rounded-full font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        Regresar
                    </button>
                    <button 
                        type="button" 
                        disabled={isLoading}
                        onClick={handleSimulateVerification}
                        className="px-8 py-4 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                    >
                        {isLoading ? 'Enviando Pruebas a la DIAN...' : 'Iniciar Verificación DIAN'}
                    </button>
                </div>
            </div>
        </div>
    );

    // STEP 4
    const renderStep4 = () => (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Firma Electrónica</h2>
                <p className="text-gray-500">Configuración obligatoria para firmar digitalmente cada nómina emitida.</p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 space-y-8">
                
                <div className="border border-blue-100 bg-blue-50/50 rounded-2xl p-6 flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-full shadow-sm text-blue-600 shrink-0">
                            <FileSignature className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">Autorización a Proveedor Tecnológico</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Al habilitar esta opción, estás permitiendo que NóminaX (en conjunto con el Proveedor Tecnológico autorizado) firme digitalmente por ti los documentos XML de la Nómina Electrónica que envías a la DIAN mes a mes, evitando que tengas que tramitar un certificado digital propio.
                            </p>
                        </div>
                    </div>

                    <label className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                        <input 
                            type="checkbox" 
                            className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            checked={formData.authSignature}
                            onChange={(e) => setFormData({...formData, authSignature: e.target.checked})}
                        />
                        <span className="font-bold text-gray-800">
                            Autorizo a firmar digitalmente mis documentos de nómina electrónica.
                        </span>
                    </label>
                </div>

                <div className="flex gap-4 pt-6">
                    <button 
                        type="button" 
                        onClick={(e) => handleNext(e)}
                        className="flex-1 px-8 py-4 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-blue-600/20 transition-all shadow-lg text-center"
                    >
                        Aceptar y continuar
                    </button>
                    <button 
                        type="button" 
                        onClick={handleBack}
                        className="px-8 py-4 rounded-full font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        Regresar
                    </button>
                </div>
            </div>
        </div>
    );

    // STEP 5
    const renderStep5 = () => (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Configuración de emisión NE</h2>
                <p className="text-gray-500">Define cómo se estructurará tu consecutivo legal para los envíos mensuales.</p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Prefijo</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 font-medium uppercase"
                            value={formData.prefix}
                            onChange={(e) => setFormData({...formData, prefix: e.target.value.toUpperCase()})}
                            placeholder="Ej. NE"
                        />
                        <p className="text-xs text-gray-500">Letras que acompañarán al número (Ej: NE).</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Número de inicio</label>
                        <input 
                            type="number" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 font-medium"
                            value={formData.startNumber}
                            onChange={(e) => setFormData({...formData, startNumber: e.target.value})}
                            placeholder="Ej. 1"
                        />
                        <p className="text-xs text-gray-500">Desde qué número arranca el contador.</p>
                    </div>
                </div>

                {/* Vista previa */}
                <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                    <span className="text-sm text-gray-500 font-bold block mb-2">Vista previa de tu primer número de nómina</span>
                    <span className="text-3xl font-black text-gray-900 tracking-widest">{formData.prefix || 'NE'} - {formData.startNumber || '1'}</span>
                </div>

                <div className="flex gap-4 pt-6">
                    <button 
                        type="button" 
                        onClick={(e) => handleNext(e)}
                        className="flex-1 px-8 py-4 rounded-full font-bold text-white bg-green-600 hover:bg-green-700 shadow-green-600/20 transition-all shadow-lg text-center"
                    >
                        ¡Finalizar Configuración!
                    </button>
                    <button 
                        type="button" 
                        onClick={handleBack}
                        className="px-8 py-4 rounded-full font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all"
                    >
                        Regresar
                    </button>
                </div>
            </div>
        </div>
    );

    // STEP 6 (Success)
    const renderSuccess = () => (
        <div className="max-w-xl mx-auto text-center space-y-6 pt-10">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-gray-900">¡Configuración Exitosa!</h2>
            <p className="text-gray-600 text-lg">Tu empresa ha completado todo el proceso de Habilitación. A partir de ahora podrás reportar tu nómina mensualmente con un solo clic.</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-200 text-left mt-8">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-gray-800">Resumen de habilitación DIAN</span>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Estado:</strong> Habilitado y Sincronizado</p>
                    <p><strong>Software:</strong> NóminaX S.A.S</p>
                    <p><strong>Firma Electrónica:</strong> Autorización registrada</p>
                    <p><strong>Listos para usar prefijo:</strong> {formData.prefix}</p>
                </div>
            </div>

            <button 
                onClick={() => window.location.href = '/admin/payroll-electronic/transmission'}
                className="w-full mt-10 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl"
            >
                Ir a Transmitir Nómina
            </button>
        </div>
    );

    // Array of steps labels to render in stepper
    const STEPS = [
        "Información", 
        "Habilitación", 
        "Verificación", 
        "Firma", 
        "Configuración"
    ];

    return (
        <div className="min-h-full py-6 px-4">
            {/* Steps Progress Bar (Only show if not in intro or success) */}
            {currentStep > 0 && currentStep <= STEPS.length && (
                <div className="max-w-5xl mx-auto mb-12 overflow-x-auto pb-4">
                    <div className="min-w-[600px] flex items-center justify-between relative px-4">
                        {/* Line bg */}
                        <div className="absolute top-5 left-10 right-10 h-1 bg-gray-200 -translate-y-1/2"></div>
                        
                        {/* Progress Line */}
                        <div 
                            className="absolute top-5 left-10 h-1 bg-blue-600 -translate-y-1/2 transition-all duration-500"
                            style={{ width: `calc(${((currentStep - 1) / (STEPS.length - 1)) * 100}% - 40px)` }}
                        ></div>

                        {STEPS.map((label, index) => {
                            const stepNumber = index + 1;
                            const isActive = currentStep === stepNumber;
                            const isPast = currentStep > stepNumber;

                            return (
                                <div key={stepNumber} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                        isActive 
                                        ? 'bg-blue-600 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.2)]' 
                                        : isPast 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white border-[3px] border-gray-200 text-gray-400'
                                    }`}>
                                        {isPast ? <CheckCircle2 className="w-6 h-6" /> : stepNumber}
                                    </div>
                                    <span className={`absolute -bottom-7 whitespace-nowrap text-[11px] font-black uppercase tracking-wider ${
                                        isActive ? 'text-blue-600' : isPast ? 'text-gray-800' : 'text-gray-400'
                                    }`}>
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {currentStep === 0 && renderIntro()}
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                    {currentStep === 5 && renderStep5()}
                    {currentStep === 6 && renderSuccess()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
