const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const holidays2025 = [
  { date: new Date('2025-01-01'), name: 'Año Nuevo' },
  { date: new Date('2025-01-06'), name: 'Día de los Reyes Magos' },
  { date: new Date('2025-03-24'), name: 'Día de San José' },
  { date: new Date('2025-04-17'), name: 'Jueves Santo' },
  { date: new Date('2025-04-18'), name: 'Viernes Santo' },
  { date: new Date('2025-05-01'), name: 'Día del Trabajo' },
  { date: new Date('2025-06-02'), name: 'Ascensión del Señor' },
  { date: new Date('2025-06-23'), name: 'Corpus Christi' },
  { date: new Date('2025-06-30'), name: 'Sagrado Corazón' },
  { date: new Date('2025-07-20'), name: 'Día de la Independencia' },
  { date: new Date('2025-08-07'), name: 'Batalla de Boyacá' },
  { date: new Date('2025-08-18'), name: 'Asunción de la Virgen' },
  { date: new Date('2025-10-13'), name: 'Día de la Raza' },
  { date: new Date('2025-11-03'), name: 'Todos los Santos' },
  { date: new Date('2025-11-17'), name: 'Independencia de Cartagena' },
  { date: new Date('2025-12-08'), name: 'Inmaculada Concepción' },
  { date: new Date('2025-12-25'), name: 'Navidad' },
];

async function main() {
  console.log('Seeding holidays...');
  for (const h of holidays2025) {
    await prisma.holiday.upsert({
      where: { date: h.date },
      update: {},
      create: h,
    });
  }
  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
