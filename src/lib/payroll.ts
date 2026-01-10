import { differenceInMinutes, addDays, format } from 'date-fns';

export interface ShiftResult {
    // Ordinary Hours
    HD: number;   // Hora Diurna (Ordinary Day)
    HN: number;   // Hora Nocturna (Ordinary Night)
    HDD: number;  // Hora Dominical/Festiva Diurna
    HND: number;  // Hora Dominical/Festiva Nocturna

    // Overtime Hours
    HED: number;  // Hora Extra Diurna
    HEN: number;  // Hora Extra Nocturna
    HEDD: number; // Hora Extra Dominical/Festiva Diurna
    HEND: number; // Hora Extra Dominical/Festiva Nocturna
}

// Configuration matching VBA logic
const DAY_START = 6;  // 06:00
const NIGHT_START = 19; // 19:00 (7 PM) - Updated for 2026
const MAX_ORDINARY_HOURS = 7.67; // 7h 40m approx
const MAX_ORDINARY_MINUTES = 460; // 7.67 * 60 = 460.2 -> Using 460 for integer precision in loop

export const HOLIDAYS_2026 = [
    '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03',
    '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29',
    '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02',
    '2026-11-16', '2026-12-08', '2026-12-25'
];

export function isHoliday(date: Date): boolean {
    const dateString = format(date, 'yyyy-MM-dd');
    return HOLIDAYS_2026.includes(dateString);
}

/**
 * Calculates payroll hours replicating exact VBA logic
 */
export function calculateShiftHours(
    entryTime: Date,
    exitTime: Date,
    isSundayOrHoliday: boolean = false
): ShiftResult {
    // Initialize result buckets
    const result: ShiftResult = {
        HD: 0, HN: 0, HDD: 0, HND: 0,
        HED: 0, HEN: 0, HEDD: 0, HEND: 0
    };

    // Normalize dates
    let exit = new Date(exitTime);
    const entry = new Date(entryTime);

    if (exit < entry) {
        exit = addDays(exit, 1);
    }

    const totalMinutes = differenceInMinutes(exit, entry);
    // Determine how many minutes are ordinary vs overtime
    // VBA logic: If totalHours <= 7.67 then all are ordinary, else 7.67 are ordinary and rest are extra

    let ordinaryMinutesLimit = totalMinutes;
    if (totalMinutes > MAX_ORDINARY_MINUTES) {
        ordinaryMinutesLimit = MAX_ORDINARY_MINUTES;
    }

    let remainingOrdinaryMinutes = ordinaryMinutesLimit;

    // Iterate minute by minute
    let current = new Date(entry);
    for (let i = 0; i < totalMinutes; i++) {
        // Calculate decimal hour (e.g., 14.5 for 14:30)
        const hour = current.getHours() + current.getMinutes() / 60;

        // Check is Day (06:00 - 21:00)
        const isDay = hour >= DAY_START && hour < NIGHT_START;

        // Determine if this minute is Ordinary or Extra
        const isOrdinary = remainingOrdinaryMinutes > 0;

        if (isOrdinary) {
            // ORDINARY BUCKETS
            if (isDay) {
                if (isSundayOrHoliday) result.HDD += 1 / 60;
                else result.HD += 1 / 60;
            } else { // Night
                if (isSundayOrHoliday) result.HND += 1 / 60;
                else result.HN += 1 / 60;
            }
            remainingOrdinaryMinutes--;
        } else {
            // OVERTIME BUCKETS
            if (isDay) {
                if (isSundayOrHoliday) result.HEDD += 1 / 60;
                else result.HED += 1 / 60;
            } else { // Night
                if (isSundayOrHoliday) result.HEND += 1 / 60;
                else result.HEN += 1 / 60;
            }
        }

        // Advance 1 minute
        current = new Date(current.getTime() + 60000);
    }

    return result;
}
