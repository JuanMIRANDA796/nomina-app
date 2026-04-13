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
    Save
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function PayrollElectronicOnboarding() {
    const [currentStep, setCurrentStep] = useState(0); // 0: Intro, 1: Co Info, 2: Habilitacion, 3: Resumen
    const [isLoading, setIsLoading] = useState(false);
    const [companyData, setCompanyData] = useState<any>(null);

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
        testSetId: ''
    });

    useEffect(() => {
        fetchCompany();
    }, []);

    const fetchCompany = async () => {
        const companyId = localStorage.getItem('company_id') || '1';
        try {
            const res = await fetch(`/api/settings/company?companyId=${companyId}`);
            if (res.ok) {
                const data = await res.json();
                setCompanyData(data);
                setFormData({
                    businessName: data.businessName || '',
                    nit: data.nit || '',
                    dv: data.dv || '',
                    email: '', // Not in DB yet? 
                    department: data.departmentCode || '', 
                    city: data.cityCode || '',
                    address: '', // To be added
                    documentType: data.documentType || 'NIT',
                    testSetId: ''
                });
            }
        } catch (error) {
            console.error('Error fetching company:', error);
        }
    };

    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handleSaveInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call to update company DIAN info
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Información de empresa guardada');
            handleNext();
        }, 1000);
    };

    const handleHabilitar = async () => {
        if (!formData.testSetId) {
            toast.error('Debes ingresar el código TestSetID');
            return;
        }
        setIsLoading(true);
        // This will eventually call our API to send the set de pruebas
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Set de pruebas enviado a la DIAN');
            handleNext();
        }, 2000);
    };

    // Render Steps
    const renderIntro = () => (
        <div className="max-w-4xl mx-auto">
            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                        <Rocket className="w-5 h-5" /> Configuración de Nómina Electrónica
                    </h2>
                    <p className="text-purple-700 text-sm mt-1">
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
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                <CheckCircle2 className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                            </div>
                            <span className="text-gray-700 font-medium">Datos de acceso al portal de la DIAN - MUISCA</span>
                        </li>
                        <li className="flex items-center gap-4 group">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                <CheckCircle2 className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                            </div>
                            <span className="text-gray-700 font-medium">Datos legales de la empresa (NIT, Datos del representante legal)</span>
                        </li>
                        <li className="flex items-center gap-4 group">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                <CheckCircle2 className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                            </div>
                            <span className="text-gray-700 font-medium">Acceso al correo registrado en el RUT</span>
                        </li>
                    </ul>

                    <button 
                        onClick={handleNext}
                        className="mt-12 bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-purple-600/20 transition-all hover:scale-105 active:scale-95"
                    >
                        Comenzar configuración
                    </button>
                </div>
                
                <div className="hidden md:flex flex-1 items-center justify-center opacity-80">
                    <img src="https://cdni.iconscout.com/illustration/premium/thumb/business-startup-concept-4347432-3614132.png" alt="Onboarding" className="max-w-xs" />
                </div>
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Información de la empresa</h2>
                <p className="text-gray-500">Por favor verifica y completa la información de tu empresa. Esta debe ser la misma que tienes registrada en la DIAN.</p>
            </div>

            <form onSubmit={handleSaveInfo} className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Razón social*</label>
                        <input 
                            type="text" 
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            value={formData.businessName}
                            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Correo electrónico del RUT*</label>
                        <input 
                            type="email" 
                            required
                            placeholder="ejemplo@correo.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Tipo de documento*</label>
                        <select 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none bg-white transition-all"
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
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
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
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                value={formData.department}
                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Ciudad*</label>
                            <input 
                                type="text" 
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-700">Dirección*</label>
                            <input 
                                type="text" 
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
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
                        className="px-8 py-3 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all font-medium"
                    >
                        Regresar
                    </button>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 rounded-full font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
                    >
                        {isLoading ? 'Guardando...' : 'Guardar y continuar'}
                    </button>
                </div>
            </form>
        </div>
    );

    const renderStep2 = () => (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Proceso de habilitación para emitir Nómina Electrónica</h2>
                <p className="text-gray-500">A continuación te presentamos una guía para que realices tu proceso de habilitación de forma simple.</p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 space-y-10">
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                        <p className="text-sm text-blue-800">
                            <strong>Paso 1 - Habilitarse como emisor de Nómina Electrónica:</strong> Ingresa al portal de la DIAN y registra tu empresa como emisor de Nómina Electrónica usando NóminaX como software.
                        </p>
                    </div>

                    <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
                        <p className="text-sm text-purple-800">
                            <strong>Paso 2 - Enviar set de pruebas a la DIAN:</strong> Envía el set de pruebas para sincronizar NóminaX con tu Nómina Electrónica.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-700">Código TestSetID*</label>
                    <input 
                        type="text" 
                        required
                        placeholder="Ingresa el código TestSetID"
                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none transition-all font-mono text-gray-900"
                        value={formData.testSetId}
                        onChange={(e) => setFormData({...formData, testSetId: e.target.value})}
                    />
                    <p className="text-xs text-gray-400">Este código lo obtienes en el portal de la DIAN al registrar el software.</p>
                </div>

                <div className="flex gap-4 pt-6">
                    <button 
                        type="button" 
                        disabled={isLoading}
                        onClick={handleHabilitar}
                        className={`flex-1 px-8 py-4 rounded-full font-bold text-white transition-all shadow-lg ${
                            isLoading ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                        }`}
                    >
                        {isLoading ? 'Procesando set de pruebas...' : 'Guardar y continuar'}
                    </button>
                    <button 
                        type="button" 
                        onClick={handleBack}
                        className="px-8 py-4 rounded-full font-bold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all font-medium"
                    >
                        Regresar
                    </button>
                </div>
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="max-w-xl mx-auto text-center space-y-6 pt-10">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-gray-900">¡Habilitación Exitosa!</h2>
            <p className="text-gray-600 text-lg">Tu empresa ha sido habilitada exitosamente ante la DIAN. A partir de ahora podrás reportar tu nómina con un solo clic.</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-200 text-left mt-8">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-gray-800">Resumen de vinculación</span>
                </div>
                <div className="space-y-2 text-sm text-gray-500">
                    <p><strong>Estado DIAN:</strong> Habilitado</p>
                    <p><strong>Software:</strong> NóminaX S.A.S</p>
                    <p><strong>CUNE:</strong> Activo para próxima emisión</p>
                </div>
            </div>

            <button 
                onClick={() => window.location.href = '/admin/dashboard'}
                className="w-full mt-10 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl"
            >
                Ir al Dashboard
            </button>
        </div>
    );

    return (
        <div className="min-h-full py-6 px-4">
            {/* Steps Progress Bar (Only show if not in success/intro) */}
            {currentStep > 0 && currentStep < 4 && (
                <div className="max-w-5xl mx-auto mb-12">
                    <div className="flex items-center justify-between relative">
                        {/* Line bg */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2"></div>
                        {/* Progress Line */}
                        <div 
                            className="absolute top-1/2 left-0 h-0.5 bg-purple-600 -translate-y-1/2 transition-all duration-500"
                            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                        ></div>

                        {[1, 2, 3].map((step) => (
                            <div key={step} className="relative z-10 flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                    currentStep === step 
                                    ? 'bg-purple-600 text-white ring-4 ring-purple-100' 
                                    : currentStep > step 
                                    ? 'bg-purple-600 text-white' 
                                    : 'bg-white border-2 border-gray-200 text-gray-400'
                                }`}>
                                    {currentStep > step ? <CheckCircle2 className="w-6 h-6" /> : step}
                                </div>
                                <span className={`absolute -bottom-8 whitespace-nowrap text-xs font-bold uppercase tracking-tighter ${
                                    currentStep === step ? 'text-purple-600' : 'text-gray-400'
                                }`}>
                                    {step === 1 ? 'Información' : step === 2 ? 'Habilitación' : 'Finalizar'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {currentStep === 0 && renderIntro()}
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderSuccess()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
