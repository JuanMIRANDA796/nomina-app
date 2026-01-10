import { calculateShiftHours } from './payroll';
import { set } from 'date-fns';

function test(name: string, entry: Date, exit: Date, expected: any) {
    console.log(`Running test: ${name}`);
    const result = calculateShiftHours(entry, exit);
    console.log('Result:', JSON.stringify(result, null, 2));
    // Add assertions here if needed, for now visual inspection
    console.log('-----------------------------------');
}

const baseDate = new Date();
const setTime = (h: number, m: number) => set(baseDate, { hours: h, minutes: m, seconds: 0, milliseconds: 0 });

// 1. Standard Day (08:00 - 17:00) -> 9h total -> 8h Ord Day + 1h OT Day
test('Standard Day (9h)', setTime(8, 0), setTime(17, 0), {});

// 2. Standard Night (22:00 - 06:00) -> 8h total -> 8h Ord Night
test('Standard Night (8h)', setTime(22, 0), setTime(6, 0), {});

// 3. Mixed (14:00 - 22:00) -> 8h total -> 7h Day (14-21) + 1h Night (21-22)
test('Mixed Shift', setTime(14, 0), setTime(22, 0), {});

// 4. Crossing Midnight (20:00 - 04:00) -> 8h total -> 1h Day (20-21) + 7h Night (21-04)
test('Crossing Midnight', setTime(20, 0), setTime(4, 0), {});

// 5. Long Shift (06:00 - 20:00) -> 14h total -> 8h Ord Day + 6h OT Day
test('Long Day Shift', setTime(6, 0), setTime(20, 0), {});
