
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding presentation slides...');

    const slides = [
        {
            slug: 'slide-1-intro',
            title: 'Valoración Corporativa ISAGEN S.A. E.S.P.',
            type: 'text',
            order: 1,
            content: 'Este análisis presenta la valoración integral de ISAGEN mediante el método de Flujo de Caja Descontado (DCF), proyectando su desempeño financiero desde 2025 hasta 2035. \n\n El objetivo es determinar el Valor Patrimonial y evaluar la sensibilidad ante cambios en variables macroeconómicas clave.',
            data: {}
        },
        {
            slug: 'slide-2-historical',
            title: 'Desempeño Histórico (2020-2024)',
            type: 'chart-bar',
            order: 2,
            content: null,
            data: {
                chartConfig: { xAxis: 'year', bars: ['Revenue', 'EBITDA'] },
                series: [
                    { year: '2020', Revenue: 3500000, EBITDA: 1200000 },
                    { year: '2021', Revenue: 3800000, EBITDA: 1350000 },
                    { year: '2022', Revenue: 4100000, EBITDA: 1500000 },
                    { year: '2023', Revenue: 4400000, EBITDA: 1650000 },
                    { year: '2024', Revenue: 4800000, EBITDA: 1800000 },
                ]
            }
        },
        {
            slug: 'slide-3-projections',
            title: 'Proyecciones Financieras (2025-2035)',
            type: 'chart-line',
            order: 3,
            content: null,
            data: {
                chartConfig: { xAxis: 'year', lines: ['Ingresos', 'EBITDA', 'UtilidadNeta'] },
                series: [
                    { year: '2025', Ingresos: 5200000, EBITDA: 1950000, UtilidadNeta: 800000 },
                    { year: '2026', Ingresos: 5500000, EBITDA: 2100000, UtilidadNeta: 950000 },
                    { year: '2027', Ingresos: 5850000, EBITDA: 2250000, UtilidadNeta: 1050000 },
                    { year: '2028', Ingresos: 6200000, EBITDA: 2400000, UtilidadNeta: 1150000 },
                    { year: '2029', Ingresos: 6600000, EBITDA: 2550000, UtilidadNeta: 1250000 },
                    { year: '2030', Ingresos: 7000000, EBITDA: 2700000, UtilidadNeta: 1350000 },
                    { year: '2031', Ingresos: 7400000, EBITDA: 2850000, UtilidadNeta: 1450000 },
                    { year: '2032', Ingresos: 7800000, EBITDA: 3000000, UtilidadNeta: 1550000 },
                    { year: '2033', Ingresos: 8200000, EBITDA: 3150000, UtilidadNeta: 1650000 },
                    { year: '2034', Ingresos: 8600000, EBITDA: 3300000, UtilidadNeta: 1750000 },
                    { year: '2035', Ingresos: 9000000, EBITDA: 3500000, UtilidadNeta: 1900000 },
                ]
            }
        },
        {
            slug: 'slide-4-sensitivity',
            title: 'Análisis de Sensibilidad (Valor Patrimonial)',
            type: 'sensitivity-heatmap',
            order: 4,
            content: null,
            data: {
                rows: ['WACC-1%', 'WACC Base', 'WACC+1%'],
                cols: ['g-1%', 'g Base', 'g+1%'],
                matrix: [
                    [14500000, 15200000, 16000000], // Low WACC (High Val)
                    [13000000, 13800000, 14500000], // Base WACC
                    [11500000, 12100000, 12800000]  // High WACC (Low Val)
                ]
            }
        },
        {
            slug: 'slide-5-conclusions',
            title: 'Conclusiones y Recomendaciones',
            type: 'text',
            order: 5,
            content: '1. ISAGEN muestra una sólida generación de caja operativa proyectada, permitiendo cubrir sus obligaciones financieras y dividendos.\n\n2. El valor patrimonial es altamente sensible a la tasa de descuento (WACC), sugiriendo que la gestión del riesgo país y costo de deuda es crítica.\n\n3. Se recomienda mantener la estrategia de crecimiento moderado (g=3%) para maximizar el valor a largo plazo.',
            data: {}
        }
    ];

    for (const slide of slides) {
        await prisma.presentationSlide.upsert({
            where: { slug: slide.slug },
            update: slide,
            create: slide,
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
