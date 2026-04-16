import asyncio
import os
from playwright.async_api import async_playwright

DOWNLOAD_DIR = os.path.join(os.getcwd(), "descargas_masivas_final")
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

TARGET_IDS = [1, 2, 3, 5, 8, 14, 16]
YEARS = [str(y) for y in range(2017, 2025)]
TIPOS_ENTRADA = [
    "Plenas individuales",
    "Plenas separados",
    "Pymes individuales",
    "Pymes separados"
]

async def run_bot():
    print("==================================================")
    print("=== BOT MASIVO OPTIMIZADO - VERSION ATAJO       ===")
    print("==================================================")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(accept_downloads=True)
        page = await context.new_page()

        # 1. ENTRAR UNA SOLA VEZ AL INICIO (Para mantener el estado de los chulitos)
        print("[INICIO] Cargando portal de Supersociedades...")
        await page.goto("https://siis.ia.supersociedades.gov.co/#/massivereports", timeout=60000)
        await asyncio.sleep(6)
        
        es_primera_vez = True

        for anio in YEARS:
            for tipo in TIPOS_ENTRADA:
                print(f"\n>>> PROCESANDO: Ano {anio} | Sector: {tipo}")
                
                try:
                    # --- PASO A: CAMBIAR FILTROS (Se hace siempre) ---
                    # 1. Ano
                    input_anio = page.locator("input").first
                    await input_anio.click()
                    await input_anio.fill(anio)
                    await asyncio.sleep(1)
                    await page.mouse.click(700, 50) 
                    await asyncio.sleep(1)
                    
                    # 2. Tipo
                    await page.locator("select").first.select_option(label=tipo)
                    await asyncio.sleep(1)
                    
                    # 3. Aplicar
                    await page.get_by_role("button", name="APLICAR FILTROS").click(force=True)
                    print("  -> Aplicando filtros...")
                    await asyncio.sleep(10) # Esperar carga de datos
                    
                    # --- PASO B: CONFIGURACION INICIAL (Solo se hace la primera vez) ---
                    if es_primera_vez:
                        print("  [CONFIGURACION] Ajustando Ver 20 y marcando archivos por unica vez...")
                        
                        # Cambiar a Ver 20
                        try:
                            sel_paginacion = page.locator("select").last
                            await sel_paginacion.click()
                            await asyncio.sleep(0.5)
                            await page.keyboard.press("ArrowDown")
                            await page.keyboard.press("Enter")
                            await asyncio.sleep(4)
                        except:
                            print("  ! No pude cambiar a Ver 20.")

                        # Marcar los 7 reportes (IDs fijos por posicion)
                        checkboxes = page.locator("input[type='checkbox']")
                        n_total = await checkboxes.count()
                        for target_id in TARGET_IDS:
                            if target_id < n_total:
                                await checkboxes.nth(target_id).click(force=True)
                                await asyncio.sleep(0.3)
                        
                        print("  [OK] Configuracion guardada en la sesion.")
                        es_primera_vez = False

                    # --- PASO C: DESCARGA (Se hace siempre) ---
                    # Verificar si hay resultados antes de bajar
                    no_results = await page.get_by_text("No se encuentran resultados").is_visible()
                    if no_results:
                        print(f"  [AVISO] No hay datos para descargar en esta combinacion.")
                        continue

                    print("  -> Iniciando descarga de la seleccion...")
                    try:
                        btn_desc = page.locator("button:has-text('DESCARGAR SELECC')").first
                        async with page.expect_download(timeout=180000) as d_info:
                            await btn_desc.click(force=True)
                        d = await d_info.value
                        
                        filename = f"{anio}_{tipo.replace(' ', '_').lower()}.zip"
                        filepath = os.path.join(DOWNLOAD_DIR, filename)
                        await d.save_as(filepath)
                        print(f"  [EXITO] Guardado: {filename}")
                    except Exception as de:
                        print(f"  [ERROR] El boton de descarga no respondio: {str(de)[:50]}")
                    
                except Exception as e:
                    print(f"  [FALLO] Saltando por error tecnico: {str(e)[:100]}")
                    # Si algo sale muy mal, forzamos un reload en la siguiente vuelta por seguridad
                    if "Target closed" in str(e): break 

        print("\n==================================================")
        print("===        BOT FINALIZADO CON EL ATAJO        ===")
        print("==================================================")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_bot())
