# NominaX — contexto del proyecto

SaaS de gestión de nómina para PyMEs colombianas. Next.js 15 + Prisma + PostgreSQL (Supabase), desplegado en Vercel.

**Está en uso real.** A agosto de 2026 hay 10 empresas registradas, 20 empleados y cerca de 900 registros de asistencia; PERSIFAL marca entrada y salida a diario desde enero. Cualquier cambio que se despliegue afecta a gente que depende de esto para pagar nómina. Verificar antes de publicar, siempre.

## Coordenadas

| Recurso | Valor |
|---|---|
| Producción | https://nomina-x.vercel.app |
| Repositorio | https://github.com/JuanMIRANDA796/nomina-app (rama `main`) |
| Código local | `C:\Users\Juan\dev\nomina-app` |
| Vercel | proyecto `nomina-app` (`prj_ypS2Wr97Sl7u2BNCxZcEMk2e6o4w`) |
| Supabase | https://supabase.com/dashboard/project/yeguvhnuenrpaiuqvmkx |

Hay **dos** caminos a producción, y esto importa:

1. `npx vercel --prod` desde esta carpeta, que está enlazada al proyecto vía `.vercel/project.json`.
2. **Un `git push` a `main` despliega solo.** El repositorio de GitHub tiene integración con Vercel.

Hasta el 14 de agosto de 2026 había **tres** proyectos de Vercel conectados a este mismo repositorio: `nomina-app`, `presentacion-comite-2025` y `web`. Un push a `main` con el código ya separado desplegó NominaX encima de `presentacion-comite-2025.vercel.app` y tumbó la presentación del Comité durante unos 25 minutos. Los otros dos proyectos quedaron desconectados ese mismo día, así que hoy un push a `main` solo despliega `nomina-app`. Si algún día vuelve a aparecer un despliegue inesperado en otro dominio, empezar por ahí:

```bash
npx vercel project ls
```

## Historia reciente

Hasta el 14 de agosto de 2026 este repositorio contenía cuatro proyectos sin relación entre sí: NominaX, la presentación del Comité de Precios, Rodaflex y unos 40 scripts de Python de un modelo de score crediticio. Compartían build, así que un error en un gráfico de benchmarking tumbaba la nómina en producción.

Se separaron. La presentación vive ahora en `C:\Users\Juan\dev\presentacion-comite` (repo propio, base de datos propia, proyecto Vercel `presentacion-comite-2025`). El resto quedó archivado en la carpeta original `C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web`, que sigue intacta como respaldo. **Este repositorio ya es solo NominaX.**

## Stack

Next.js 15.5.7 (App Router, TS) · React 18.3.1 · Prisma 5.22.0 · Tailwind v4 · Framer Motion · Lucide · Sonner · date-fns (locale es) · jsPDF + html2canvas (exportar informes a PDF)

## Autenticación

Sistema propio, sin JWT. Desde el 14 de agosto de 2026 la sesión es un token firmado con HMAC-SHA256 que viaja en una cookie `httpOnly` llamada `nx_session`. La firma y el manejo de contraseñas están en [src/lib/session.ts](src/lib/session.ts); quien resuelve la identidad de cada petición es `getSession()` / `getCompanyId()` en [src/lib/auth.ts](src/lib/auth.ts).

- **Contraseñas:** hasheadas con scrypt y sal por contraseña. Las que quedaban en texto plano se migran solas en el siguiente ingreso de cada empresa.
- **Superadmin:** usuario y contraseña salen de `SUPERADMIN_USER` y `SUPERADMIN_PASSWORD`, no del código. El rol viaja firmado dentro de la cookie, así que ya no se puede ascender editando `localStorage`.
- **`/api/superadmin/*`** exige rol `SUPERADMIN` firmado. Antes bastaba con mandar el header `x-superadmin-key: NominaX`, y ese texto viajaba dentro del JavaScript público.

**Falta cerrar una cosa.** `ALLOW_LEGACY_HEADER` en `src/lib/auth.ts` sigue en `true`: si no hay cookie, se acepta el header `x-company-id` sin firmar, como antes. Es deliberado, porque los relojes de marcación guardan la sesión vieja en `localStorage` y cortarlos dejaría a empleados sin poder registrar entrada. **Mientras siga en `true`, cambiar ese número da acceso a los datos de otra empresa.** Cada uso queda registrado; cuando deje de aparecer en los logs, pasarlo a `false` y desplegar.

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
2. **Sin auto-corrección de 8 horas.** Si falta entrada o salida, el campo queda en `null` y se muestra "Incompleto". Nunca rellenar automáticamente — esto se removió a propósito. Suele haber varias decenas de registros así.
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

### El autor del commit tiene que ser Juan

Vercel mira el correo del autor del commit que está en HEAD —también en los despliegues por CLI, porque la CLI adjunta los datos de git de la carpeta— y **bloquea el despliegue si ese correo no pertenece a alguien del equipo**. El estado que aparece en el panel es `Blocked`, y la CLI lo reporta como un `read ECONNRESET` confuso, esperando un build que nunca arranca.

El 14 de agosto de 2026 esto bloqueó varias horas de despliegues: los commits salían como `Nomina Admin <admin@nomina.com>`, una identidad heredada del repositorio original. Verificar antes de desplegar:

```bash
git log -1 --format="%an <%ae>"
```

## Si algo devuelve "Error interno del servidor"

Antes de sospechar del código, comprobar si la base de datos y `schema.prisma` se salieron de sincronía. El síntoma es un **P2022** en los registros (`The column X does not exist in the current database`), y es engañoso: la ruta que falla suele ser el login, no porque la autenticación esté rota, sino porque **es la primera que consulta la tabla `Company`**.

Pasó el 19 de agosto de 2026: la columna `Company.email` desapareció de la base mientras seguía declarada en el esquema, y con ella se cayó todo inicio de sesión. El resto de la aplicación seguía respondiendo 200, porque ninguna otra ruta lee esa columna. La reparación está en [prisma/manual/20260819_add_company_email.sql](prisma/manual/20260819_add_company_email.sql).

Para ver la desalineación completa, sin ejecutar nada:

```bash
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script
```

**No ejecutes esa salida tal cual.** Incluye `DROP TABLE` para las tablas `Rodaflex*` y `Presentation*`, que siguen existiendo vacías en Supabase desde la separación de los proyectos. Aplicar solo las sentencias `ALTER TABLE ... ADD COLUMN` que hagan falta.

Este proyecto **no usa migraciones de Prisma**: están archivadas en `prisma/migrations_bak/` y el build solo corre `prisma generate`. Los cambios de esquema se aplican a mano y se dejan registrados en `prisma/manual/`. Crear una carpeta `prisma/migrations/` cambiaría el comportamiento de la CLI de Prisma, así que no se hace.

### Cuidado con quien más apunta a esta base

La columna no la borró nadie desde este repositorio: entre el 14 y el 19 de agosto no hubo un solo commit, y aun así desaparecieron la columna, un empleado y 118 registros de asistencia. Una herramienta externa conectada a la misma Supabase puede borrar columnas sin avisar — un `prisma db push` desde otro proyecto con un esquema distinto hace exactamente eso.

Cualquier herramienta que solo necesite **leer** esta base (por ejemplo un tablero de KPIs que consuma la asistencia) debe conectarse con un usuario **de solo lectura**, nunca con la cadena de conexión de la aplicación.
