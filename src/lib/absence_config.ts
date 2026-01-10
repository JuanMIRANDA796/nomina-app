export const ABSENCE_CONFIG: Record<string, number> = {
    'Incapacidad médica común (día 1-2)': 0.6667,
    'Incapacidad médica común (día 3 en adelante)': 0.6667,
    'Incapacidad laboral (ARL)': 1,
    'Licencia de maternidad': 1,
    'Licencia de paternidad': 1,
    'Licencia remunerada': 1, // (matrimonio, duelo, calamidad)
    'Vacaciones': 1,
    'Permiso no remunerado': 0,
    'Suspensión disciplinaria': 0,
    'Falta injustificada': 0,
    'Licencia no remunerada prolongada': 0,
    'Día de descanso obligatorio': 1, // domingo/festivo no trabajado
    'Descanso': 1
};

export const ABSENCE_REASONS = Object.keys(ABSENCE_CONFIG);

export function getAbsencePercentage(reason: string): number {
    // Normalize string handling if needed
    // Assuming exact match from dropdown
    return ABSENCE_CONFIG[reason] ?? 0;
}
