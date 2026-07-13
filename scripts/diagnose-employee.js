const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const cedula = '98648155';
    const companyId = 1;

    const emp = await prisma.employee.findUnique({
        where: { companyId_cedula: { companyId, cedula } }
    });
    console.log('\nEmployee:', JSON.stringify(emp, null, 2));
    if (!emp) { console.log('NOT FOUND'); return; }

    const records = await prisma.attendance.findMany({
        where: { employeeId: emp.id },
        orderBy: { date: 'desc' },
        take: 15
    });

    console.log(`\nLast ${records.length} attendance records:`);
    records.forEach(r => {
        console.log(`  id=${r.id}  date=${r.date.toISOString()}  entry=${r.entryTime?.toISOString() ?? 'null'}  exit=${r.exitTime?.toISOString() ?? 'null'}`);
    });

    // Check for today specifically
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setUTCHours(23, 59, 59, 999);

    const todayRecords = await prisma.attendance.findMany({
        where: {
            employeeId: emp.id,
            date: { gte: todayStart, lte: todayEnd }
        }
    });
    console.log(`\nRecords for today (UTC ${todayStart.toISOString()} to ${todayEnd.toISOString()}):`, todayRecords.length);
    todayRecords.forEach(r => {
        console.log(`  id=${r.id}  date=${r.date.toISOString()}  entry=${r.entryTime?.toISOString() ?? 'null'}  exit=${r.exitTime?.toISOString() ?? 'null'}`);
    });

    // Check colombia-offset window (UTC-5)
    const colombia5Start = new Date(now.getTime() - 5 * 3600000);
    colombia5Start.setUTCHours(0, 0, 0, 0);
    const colombia5End = new Date(colombia5Start.getTime() + 86400000 - 1);

    const colombiaRecords = await prisma.attendance.findMany({
        where: {
            employeeId: emp.id,
            date: { gte: colombia5Start, lte: colombia5End }
        }
    });
    console.log(`\nRecords for Colombia today (UTC-5: ${colombia5Start.toISOString()} to ${colombia5End.toISOString()}):`, colombiaRecords.length);
    colombiaRecords.forEach(r => {
        console.log(`  id=${r.id}  date=${r.date.toISOString()}  entry=${r.entryTime?.toISOString() ?? 'null'}  exit=${r.exitTime?.toISOString() ?? 'null'}`);
    });

    await prisma.$disconnect();
}

main().catch(async e => {
    console.error('\nError:', e.message);
    await prisma.$disconnect();
    process.exit(1);
});
