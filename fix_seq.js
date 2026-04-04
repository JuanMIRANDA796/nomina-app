const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Employee"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "Employee";`);
        
        // Also fix Company just in case
        await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Company"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "Company";`);
        
        console.log("Sequences fixed!");
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
