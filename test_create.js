const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        const employee = await prisma.employee.create({
            data: {
                name: 'TEST_JUAN',
                cedula: '123_test',
                cargo: 'Testing',
                salary: parseFloat(100),
                status: 'ACTIVE',
                companyId: 5,
                riskClass: 'I'
            },
        });
        console.log("Created:", employee);
    } catch (e) {
        console.error("Error creating:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
