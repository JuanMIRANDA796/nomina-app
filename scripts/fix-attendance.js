/**
 * Script de limpieza: elimina registros de asistencia duplicados o en estado
 * inconsistente para un empleado específico.
 *
 * Uso:
 *   node scripts/fix-attendance.js <cedula> [companyId]
 *
 * Ejemplo:
 *   node scripts/fix-attendance.js 98648155
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const cedula = process.argv[2];
    const companyId = parseInt(process.argv[3] ?? '1');

    if (!cedula) {
        console.error('❌ Uso: node scripts/fix-attendance.js <cedula> [companyId]');
        process.exit(1);
    }

    console.log(`\n🔍 Buscando empleado con cédula ${cedula} (empresa ${companyId})...`);

    const employee = await prisma.employee.findUnique({
        where: { companyId_cedula: { companyId, cedula } },
    });

    if (!employee) {
        console.error(`❌ Empleado con cédula ${cedula} no encontrado en empresa ${companyId}.`);
        process.exit(1);
    }

    console.log(`✅ Empleado encontrado: ${employee.name} (ID: ${employee.id})\n`);

    // Fetch ALL attendance records for this employee
    const records = await prisma.attendance.findMany({
        where: { employeeId: employee.id },
        orderBy: { date: 'asc' },
    });

    console.log(`📋 Total registros de asistencia: ${records.length}`);

    // Group records by date (truncated to the day) to find duplicates
    const byDay = new Map();
    for (const r of records) {
        const dayKey = new Date(r.date).toISOString().split('T')[0];
        if (!byDay.has(dayKey)) byDay.set(dayKey, []);
        byDay.get(dayKey).push(r);
    }

    let fixedCount = 0;

    for (const [day, dayRecords] of byDay) {
        if (dayRecords.length > 1) {
            console.log(`\n⚠️  Duplicado detectado en ${day}: ${dayRecords.length} registros`);
            dayRecords.forEach((r, i) => {
                console.log(`   [${i}] id=${r.id} date=${r.date.toISOString()} entry=${r.entryTime?.toISOString() ?? 'null'} exit=${r.exitTime?.toISOString() ?? 'null'}`);
            });

            // Keep the record with most data (prefer one with both entry and exit, then with entry)
            dayRecords.sort((a, b) => {
                const scoreA = (a.entryTime ? 2 : 0) + (a.exitTime ? 1 : 0);
                const scoreB = (b.entryTime ? 2 : 0) + (b.exitTime ? 1 : 0);
                return scoreB - scoreA;
            });

            const keep = dayRecords[0];
            const toDelete = dayRecords.slice(1);

            console.log(`   ✅ Conservando id=${keep.id}`);
            for (const r of toDelete) {
                console.log(`   🗑️  Eliminando id=${r.id}`);
                await prisma.attendance.delete({ where: { id: r.id } });
                fixedCount++;
            }
        }
    }

    // Check for records with null entryTime AND null exitTime (orphaned records)
    const orphaned = records.filter(r => !r.entryTime && !r.exitTime);
    if (orphaned.length > 0) {
        console.log(`\n⚠️  Registros huérfanos (sin entrada ni salida): ${orphaned.length}`);
        for (const r of orphaned) {
            console.log(`   🗑️  Eliminando id=${r.id} date=${r.date.toISOString()}`);
            await prisma.attendance.delete({ where: { id: r.id } });
            fixedCount++;
        }
    }

    if (fixedCount === 0) {
        console.log('\n✅ No se encontraron registros problemáticos. La BD está limpia.');
        console.log('   El error 500 puede ser por credenciales de BD expiradas (ver correo de Vercel/Prisma).');
    } else {
        console.log(`\n✅ Limpieza completada. ${fixedCount} registro(s) eliminado(s).`);
    }

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error('\n❌ Error durante la limpieza:', e.message);
    await prisma.$disconnect();
    process.exit(1);
});
