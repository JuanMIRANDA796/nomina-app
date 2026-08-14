# NominaX — contexto del proyecto

SaaS de gestión de nómina para PyMEs colombianas. Next.js 15 + Prisma + PostgreSQL (Supabase), desplegado en Vercel.

**Está en uso real.** A agosto de 2026 hay 10 empresas registradas, 21 empleados y más de 1.000 registros de asistencia; PERSIFAL marca entrada y salida a diario desde enero. Cualquier cambio que se despliegue afecta a gente que depende de esto para pagar nómina. Verificar antes de publicar, siempre.

## Coordenadas

| Recurso | Valor |
|---|---|
| Producción | https://nomina-x.vercel.app |
| Repositorio | https://github.com/JuanMIRANDA796/nomina-app (rama `main`) |
| Código local | `C:\Users\Juan\dev\nomina-app` |
| Vercel | proyecto `nomina-app` (`prj_ypS2Wr97Sl7u2BNCxZcEMk2e6o4w`) |
| Supabase | https://supabase.com/dashboard/project/yeguvhnuenrpaiuqvmkx |

El despliegue es **por CLI, no por Git**: `git push` no publica nada. Se publica con `npx vercel --prod` desde esta carpeta, que está enlazada al proyecto correcto vía `.vercel/project.json`.

## Historia reciente

Hasta el 14 de agosto de 2026 este repositorio contenía cuatro proyectos sin relación entre sí: NominaX, la presentación del Comité de Precios, Rodaflex y unos 40 scripts de Python de un modelo de score crediticio. Compartían build, así que un error en un gráfico de benchmarking tumbaba la nómina en producción.

Se separaron. La presentación vive ahora en `C:\Users\Juan\dev\presentacion-comite` (repo propio, base de datos propia, proyecto Vercel `presentacion-comite-2025`). El resto quedó archivado en la carpeta original `C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web`, que sigue intacta como respaldo. **Este repositorio ya es solo NominaX.**

## Stack

Next.js 15.5.7 (App Router, TS) · React 18.3.1 · Prisma 5.22.0 · Tailwind v4 · Framer Motion · Lucide · Sonner · date-fns (locale es) · jsPDF + html2canvas (exportar informes a PDF)

## Autenticación — y su agujero

Sistema propio, sin JWT. El `company_id` vive en `localStorage` y se envía como header `x-company-id`. Toda la validación server-side es `getCompanyId()` en [src/lib/auth.ts](src/lib/auth.ts): lee el header y lo parsea a entero.

**No hay verificación de ningún tipo. Quien cambie ese header a mano lee y escribe los datos de otra empresa.** Con clientes reales adentro, es la deuda técnica más seria del proyecto.

Superadmin: usuario `NominaX` / contraseña `NominaX` → redirige a `/superadmin` (solo lectura).

## Rutas

**Páginas:** `/` · `/clock` · `/planes` · `/superadmin` · `/admin/dashboard` · `/admin/employees` · `/admin/employees/form` · `/admin/employees/[id]` · `/admin/reports` · `/admin/reports/[id]` · `/admin/payroll-electronic` · `/admin/payroll-electronic/transmission` · `/admin/settings` · `/admin/settings/company` · `/admin/settings/credentials` · `/admin/subscription` (stub de 9 líneas, solo renderiza `PricingCards`)

**APIs:** `auth/{login,register,session}` · `clock` · `employees` + `[id]` + `[id]/attendance` · `payroll/[id]` + `[id]/absence` · `dashboard` · `reports` · `settings/{company,credentials}` · `superadmin/companies`

## Modelos Prisma

`Company` · `Employee` · `Attendance` · `Absence` · `Holiday` · `PayrollConfig` · `PayrollSubmission`

Claves: `Company.name` es único y hace de usuario de login. `Employee` es único por `[companyId, cedula]`. `Attendance` es único por `[employeeId, date]`.

Estado real de los datos: `Absence`, `Holiday` y `PayrollSubmission` están vacías. Es decir, **la nómina electrónica DIAN está construida pero nunca se ha transmitido nada**, y ausencias y festivos no se usan todavía. Las tablas de la presentación y de Rodaflex siguen existiendo vacías en Supabase; ya no están en el esquema y se pueden borrar a mano cuando se quiera.

## Lógica de nómina (ley laboral colombiana)

Motor en [src/lib/payroll_engine.ts](src/lib/payroll_engine.ts) y [src/lib/payroll.ts](src/lib/payroll.ts).

Jornada ordinaria 7.67 h/día (46 h semanales). Recargos: HED +25% · HEN +75% · HN +35% (9pm–6am) · HDD +75% · HND +110% · HEDD +100% · HEND +150%.
Provisiones: vacaciones 4.17% · prima 8.33% · cesantías 8.33% · intereses 1%.
Seguridad social empleador: salud 8.5% · pensión 12% · ARL según clase de riesgo (I–V).
Parafiscales: SENA 2% · ICBF 3% · Caja 4%.
Auxilio de transporte si salario ≤ 2 SMLV. Dotación según rango salarial. SMLV/UVT/AUX_TRANSPORTE son configurables por empresa en `PayrollConfig`.

## Reglas de negocio que NO se deben romper

1. **Zona horaria.** Colombia es UTC-5. Las fechas canónicas de asistencia se guardan a las **12:00 UTC** para evitar desfases de día. El frontend usa `exitTime` o `entryTime` para decidir a qué día pertenece un registro cuando falta `entryTime`. (Commits `0f54982`, `e8c5368`.)
2. **Sin auto-corrección de 8 horas.** Si falta entrada o salida, el campo queda en `null` y se muestra "Incompleto". Nunca rellenar automáticamente — esto se removió a propósito. Hoy hay 38 registros así.
3. **Upsert atómico** en el marcaje de reloj, con fallback a `update` ante error P2002 (carrera de concurrencia).
4. **Multi-tenant estricto.** Toda operación verifica que el `employeeId` pertenezca al `companyId` del header antes de escribir.
5. **Cold start de Supabase.** Prisma usa singleton persistido en producción + `withRetry` en [src/lib/prisma.ts](src/lib/prisma.ts). Un timeout intermitente en la primera petición es esto, no un bug nuevo (commit `6b3c357`).
6. **Secuencias de PostgreSQL.** Si se insertan filas directo en la BD, los autoincrementos se desincronizan. Corregir con `node fix_sequences.js`.

## Planes

`SEMILLA` (prueba 30 días, banner de cuenta regresiva) · `EMPRENDEDOR` · `EMPRESARIAL` (ilimitado). `Company.extraEmployees` da cupos adicionales sobre el plan. Las 10 empresas registradas están en SEMILLA: **no hay ningún cobro activo**, y `/admin/subscription` no tiene flujo de pago.

## Comandos

```bash
npm run dev
```

```bash
npm run build
```

```bash
npx vercel --prod
```
