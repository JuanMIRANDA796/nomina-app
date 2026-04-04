const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando backup...');
    try {
        const employees = await prisma.employee.findMany();
        const attendances = await prisma.attendance.findMany();
        const absences = await prisma.absence.findMany();
        const holidays = await prisma.holiday.findMany();
        const payrollConfigs = await prisma.payrollConfig.findMany();
        
        const data = {
            employees,
            attendances,
            absences,
            holidays,
            payrollConfigs
        };

        fs.writeFileSync('db_backup.json', JSON.stringify(data, null, 2));
        console.log('Backup completado con éxito en db_backup.json');
        
        console.log(`Empleados: ${employees.length}`);
        console.log(`Asistencias: ${attendances.length}`);
    } catch (error) {
        console.error('Error durante el backup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
