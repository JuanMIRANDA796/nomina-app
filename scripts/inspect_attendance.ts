
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Need to find the employee ID. Lists all to be sure.
    const employees = await prisma.employee.findMany();
    console.log('Employees:', employees.map(e => ({ id: e.id, name: e.name })));

    if (employees.length === 0) return;

    const empId = employees[0].id;
    console.log(`Inspecting attendance for Employee ${empId} (${employees[0].name})...`);

    const records = await prisma.attendance.findMany({
        where: { employeeId: empId },
        orderBy: { date: 'asc' }
    });

    console.log('Raw Records:');
    records.forEach(r => {
        console.log({
            id: r.id,
            dateBucket: r.date.toISOString(),
            entryTime: r.entryTime?.toISOString(),
            exitTime: r.exitTime?.toISOString()
        });
    });
}

main();
