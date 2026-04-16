import asyncio
import os
from playwright.async_api import async_playwright

DOWNLOAD_DIR = os.path.join(os.getcwd(), "descargas_masivas_test")
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Los 7 reportes estratégicos para el Score de Factoring
# ID del reporte = posicion en la tabla (empezando en 1)
TARGET_IDS = [1, 2, 3, 5, 8, 14, 16]

async def run_test():
    print("[PASO 1] Bot v18 - Posicion + Click humano en Ver 20...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(accept_downloads=True)
        page = await context.new_page()

        print("[PASO 2] Cargando Reportes Masivos...")
        await page.goto("https://siis.ia.supersociedades.gov.co/#/massivereports", timeout=60000)
        await asyncio.sleep(6)

        # --- FILTROS ---
        print("[PASO 3] Aplicando filtros (2023 / Plenas individuales)...")
        await page.locator("input").first.click()
        await page.locator("input").first.fill("2023")
        await asyncio.sleep(1)
        await page.mouse.click(700, 50)
        await asyncio.sleep(1.5)
        await page.locator("select").first.select_option(label="Plenas individuales")
        await asyncio.sleep(1)
        await page.get_by_role("button", name="APLICAR FILTROS").click(force=True)

        print("[PASO 4] Esperando que la pagina cargue los resultados (15 seg)...")
        await asyncio.sleep(15)

        # --- VER 20: Click humano en el select de paginacion ---
        print("[PASO 5] Cambiando a Ver 20 (metodo click humano)...")
        try:
            # El select de paginacion es el ULTIMO en el DOM
            sel_paginacion = page.locator("select").last
            # Click directo en el elemento select para que reciba foco
            await sel_paginacion.click()
            await asyncio.sleep(0.5)
            # ArrowDown para pasar de "10" a "20"
            await page.keyboard.press("ArrowDown")
            await asyncio.sleep(0.3)
            await page.keyboard.press("Enter")
            print(" -> Ver 20 aplicado con teclas.")
            await asyncio.sleep(4)  # Esperar que la tabla se re-renderice
        except Exception as e:
            print(f" -> Error Ver 20: {str(e)[:60]}. Continuando con Ver 10.")

        # --- CONTAR CHECKBOXES DISPONIBLES ---
        print("[PASO 6] Contando checkboxes en la pagina...")
        n_checks = await page.locator("input[type='checkbox']").count()
        print(f" -> Total checkboxes encontrados: {n_checks}")

        # Tomar captura para verificar el estado
        await page.screenshot(path=os.path.join(DOWNLOAD_DIR, "estado_v18.png"))

        # --- MARCAR POR POSICION ---
        # Asumimos: checkbox[0] = header (seleccionar todo)
        # checkbox[N] = fila con ID = N
        # Nuestros targets: [1, 2, 3, 5, 8, 14, 16]
        print("[PASO 7] Marcando checkboxes por posicion...")
        marcados = 0
        checkboxes = page.locator("input[type='checkbox']")

        for target_id in TARGET_IDS:
            # El indice del checkbox = target_id (porque checkbox 0 es el header)
            idx = target_id  
            if idx < n_checks:
                print(f" -> Marcando checkbox en posicion {idx} (ID {target_id})...")
                chk = checkboxes.nth(idx)
                await chk.scroll_into_view_if_needed()
                await chk.click(force=True)
                marcados += 1
                await asyncio.sleep(0.4)
            else:
                print(f" -> Checkbox {idx} fuera de rango (total: {n_checks}). ID {target_id} no disponible.")

        print(f"[PASO 8] Total marcados: {marcados} / {len(TARGET_IDS)}")
        
        # Captura del estado después de marcar
        await page.screenshot(path=os.path.join(DOWNLOAD_DIR, "marcados_v18.png"))
        print(" -> Captura guardada: marcados_v18.png")

        if marcados > 0:
            print("[PASO 9] Ejecutando DESCARGAR SELECCION...")
            try:
                btn_desc = page.locator("button:has-text('DESCARGAR SELECC')").first
                async with page.expect_download(timeout=180000) as d_info:
                    await btn_desc.click(force=True)
                d = await d_info.value
                await d.save_as(os.path.join(DOWNLOAD_DIR, d.suggested_filename))
                print(f"\n[LOGRADO] Guardado: {d.suggested_filename}")
            except Exception as e:
                print(f" -> Error al descargar: {str(e)[:80]}")
        else:
            print("[ALERTA] No se marcaron archivos. Revisa las capturas.")

        print("\nBot finalizado. Cerrando en 8 segundos...")
        await asyncio.sleep(8)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_test())
