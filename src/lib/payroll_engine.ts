import { ShiftResult } from './payroll';

// Constants for 2024
export const SMLV_2024 = 1300000;
export const AUX_TRANSPORTE_2024 = 162000;
export const WORK_DAYS_MONTH = 30;
export const WORK_HOURS_DAY = 7.67;
export const WORK_HOURS_MONTH = 230;

// Risk Levels (ARL)
export const RISK_RATES = {
    'I': 0.00522,
    'II': 0.01044,
    'III': 0.02436,
    'IV': 0.0435,
    'V': 0.0696
};

// Rates
export const RATES = {
    HD: 1.0,
    HN: 1.35,
    HDD: 1.75,
    HND: 2.10,
    HED: 1.25,
    HEN: 1.75,
    HEDD: 2.00,
    HEND: 2.50
};

export interface PayrollResult {
    period: string;
    employeeId: number;
    salary: number;

    // Days
    daysWorked: number;
    daysAbsent: number;
    daysIncapacity: number;
    daysVacation: number;

    // Earnings
    basicPay: number;
    earningsBreakdown: {
        HD: number;
        HN: number;
        HDD: number;
        HND: number;
        HED: number;
        HEN: number;
        HEDD: number;
        HEND: number;
    };
    unitValues: {
        HD: number;
        HN: number;
        HDD: number;
        HND: number;
        HED: number;
        HEN: number;
        HEDD: number;
        HEND: number;
    };
    overtimePay: number;
    auxTransporte: number;
    totalDevengado: number;

    // Deductions
    healthDeduction: number;
    pensionDeduction: number;
    totalDeductions: number;

    netPay: number;

    // Employer Provisions
    cesantias: number;
    interesesCesantias: number;
    prima: number;
    vacaciones: number;
    totalProvisions: number;

    // Employer Security
    ibc: number;
    securityHealth: number;
    securityPension: number;
    securityARL: number;
    securityCaja: number;
    securityICBF: number;
    securitySENA: number;
    totalSecurity: number;

    hours: ShiftResult;
}

/**
 * Calculates full payroll for a month
 */
export function calculatePayroll(
    employee: { salary: number; riskClass: string },
    totalHours: ShiftResult,
    daysAbsent: number,
    daysIncapacity: number, // Medical leave
    daysVacation: number,    // Configuration
    periodDays: number = 30  // Default to full month
): PayrollResult {
    const { salary, riskClass } = employee;
    const hours = totalHours;

    const SMLVM_2026 = 1537446; // Assuming for reference, but user gave specific threshold
    const AUX_TRANSPORTE_VALUE = 249095;
    const AUX_THRESHOLD = 3501810; // User specified

    // 1. Calculate Earnings per Hour Type
    const hourlyRate = salary / 240;

    const earningsBreakdown = {
        HD: hours.HD * hourlyRate * 1.00,
        HN: hours.HN * hourlyRate * 1.35,
        HDD: hours.HDD * hourlyRate * 1.75,
        HND: hours.HND * hourlyRate * 2.10,
        HED: hours.HED * hourlyRate * 1.25,
        HEN: hours.HEN * hourlyRate * 1.75,
        HEDD: hours.HEDD * hourlyRate * 2.00,
        HEND: hours.HEND * hourlyRate * 2.50,
    };

    const unitValues = {
        HD: hourlyRate * 1.00,
        HN: hourlyRate * 1.35,
        HDD: hourlyRate * 1.75,
        HND: hourlyRate * 2.10,
        HED: hourlyRate * 1.25,
        HEN: hourlyRate * 1.75,
        HEDD: hourlyRate * 2.00,
        HEND: hourlyRate * 2.50,
    };

    // Total Earnings from Hours (matches Detail Table)
    // Note: User asked for "Basic Pay" to match. 
    // Usually "Basic Pay" == Salary * Days? 
    // But if we want it to match the table, it must be the sum of components.
    // The table shows EVERYTHING. 
    // So distinct "Basic Pay" in UI usually refers to HD. 
    // If the summary splits "Devengado (Tiempo)" and "Recargos", that's different.
    // But the current summary shows "Devengado (Tiempo)" then "Aux Transporte".
    // I will set 'basicPay' to be the SUM of all earningsBreakdown.
    // This ensures Total Devengado = Sum Table + Aux.

    const totalEarningsFromHours = Object.values(earningsBreakdown).reduce((a, b) => a + b, 0);
    const basicPay = totalEarningsFromHours; // Use this as the main earnings figure

    // 2. Auxilio Transporte (Prorated)
    // Paid if < Threshold AND worked days. 
    // Days worked = periodDays - absences.
    // Note: Paid Rest days were already added to 'hours.HD', so arguably they shouldn't reduce Days Worked.
    // My route.ts handles Paid Rest by NOT marking them as Absent, so daysAbsent is 0 for them.
    // Logic: Absent means UNPAID or Inability.

    const daysNotWorked = daysAbsent + daysIncapacity + daysVacation;
    // Actually, Vacation/Incapacity might pay Aux? No.
    // Usually Aux is only for days worked.

    const transportDays = periodDays - daysNotWorked;
    let auxTransporte = 0;

    if (salary <= AUX_THRESHOLD && transportDays > 0) {
        auxTransporte = (AUX_TRANSPORTE_VALUE / 30) * transportDays;
    }

    const totalDevengado = basicPay + auxTransporte;

    // Deductions (Employees pay 4% Health/Pension on IBC)
    // IBC = Total Earnings - AuxTransporte
    const ibc = totalDevengado - auxTransporte;

    const healthDeduction = ibc * 0.04;
    const pensionDeduction = ibc * 0.04;
    const totalDeductions = healthDeduction + pensionDeduction;

    const netPay = totalDevengado - totalDeductions;

    // Employer Provisions
    const baseProvisions = totalDevengado;
    const cesantias = baseProvisions * 0.0833;
    const interesesCesantias = baseProvisions * 0.01;
    const prima = baseProvisions * 0.0833;
    const vacaciones = (ibc) * 0.0417; // Vacation on Salary

    const totalProvisions = cesantias + interesesCesantias + prima + vacaciones;

    // Employer Security
    const riskRate = RISK_RATES[employee.riskClass as keyof typeof RISK_RATES] || 0.00522;

    const securityHealth = ibc * 0.085;
    const securityPension = ibc * 0.12;
    const securityARL = ibc * riskRate;
    const securityCaja = ibc * 0.04;
    const securityICBF = ibc * 0.03;
    const securitySENA = ibc * 0.02;

    const totalSecurity = securityHealth + securityPension + securityARL + securityCaja + securityICBF + securitySENA;

    const daysWorked = transportDays;

    return {
        period: '',
        employeeId: 0,
        salary: employee.salary,
        daysWorked,
        daysAbsent,
        daysIncapacity,
        daysVacation,

        basicPay: basicPay,
        earningsBreakdown,
        unitValues: {
            HD: hourlyRate * RATES.HD,
            HN: hourlyRate * RATES.HN,
            HDD: hourlyRate * RATES.HDD,
            HND: hourlyRate * RATES.HND,
            HED: hourlyRate * RATES.HED,
            HEN: hourlyRate * RATES.HEN,
            HEDD: hourlyRate * RATES.HEDD,
            HEND: hourlyRate * RATES.HEND,
        },
        overtimePay: 0,
        auxTransporte,
        totalDevengado,

        healthDeduction,
        pensionDeduction,
        totalDeductions,

        netPay,

        cesantias,
        interesesCesantias,
        prima,
        vacaciones,
        totalProvisions,

        ibc,
        securityHealth,
        securityPension,
        securityARL,
        securityCaja,
        securityICBF,
        securitySENA,
        totalSecurity,

        hours: totalHours
    };
}
