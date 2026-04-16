import asyncio
import os
from playwright.async_api import async_playwright

# Directorio donde se guardarán los Excel descargados
DOWNLOAD_DIR = os.path.join(os.getcwd(), "descargas_supersoc")
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

async def scrape_supersociedades(nits_empresas):
    """
    Este script navega por el portal del SIIS de Supersociedades y automatiza 
    el flujo exacto de las capturas de pantalla para descargar los Excel.
    """
    async with async_playwright() as p:
        # headless=False para que puedas ver el navegador abriéndose e interactuando
        browser = await p.chromium.launch(headless=False) 
        context = await browser.new_context(accept_downloads=True)
        page = await context.new_page()

        for nit in nits_empresas:
            print(f"Buscando NIT: {nit}")
            try:
                # 1. Entrar al link inicial
                await page.goto("https://siis.ia.supersociedades.gov.co/#/dashboard", timeout=60000)
                
                # Opcional: Si queremos buscar por NIT específicamente, llenaríamos el buscador y pulsaríamos Enter.
                # await page.fill('input[placeholder*="Buscar en el Sistema"]', nit)
                # await page.keyboard.press("Enter")
                
                # Según tus instrucciones: darle click al botón azul BUSCAR
                # Esperamos a que el botón sea visible y le damos click
                await page.wait_for_selector("button:has-text('BUSCAR')", timeout=15000)
                await page.click("button:has-text('BUSCAR')")

                # Esperamos a que carguen los resultados y aparezca "VISTA 360"
                await page.wait_for_selector("text=VISTA 360", timeout=20000)

                # 2. Seleccionar la primera empresa haciendo click en VISTA 360 (Tal cual tu 1ª imagen)
                await page.locator("text=VISTA 360").first.click()

                # 3. Hacer scroll y dar click en el reporte (Tal cual tu 2ª imagen)
                # Por ejemplo, para "Situación Financiera"
                ver_situacion_boton = page.locator("button:has-text('Ver Situación Financiera')")
                await ver_situacion_boton.wait_for(state="visible", timeout=20000)
                await ver_situacion_boton.scroll_into_view_if_needed()
                await ver_situacion_boton.click()

                # 4. En la tercera interfaz, dar click al botón 'Descargar' y guardar Excel (Tal cual tu 3ª imagen)
                descargar_boton = page.locator("button:has-text('Descargar')")
                await descargar_boton.wait_for(state="visible", timeout=20000)
                
                # Interceptamos la descarga de Playwright
                async with page.expect_download() as download_info:
                    await descargar_boton.click()
                download = await download_info.value
                
                # Guardamos el archivo en nuestra carpeta local
                file_path = os.path.join(DOWNLOAD_DIR, download.suggested_filename)
                await download.save_as(file_path)
                print(f"  -> Archivo descargado exitosamente: {download.suggested_filename}")

            except Exception as e:
                print(f"  -> Error procesando NIT {nit}: {str(e)}")

        await browser.close()

if __name__ == "__main__":
    # Una lista de NITs de prueba (puedes agregar los que quieras buscar)
    # Por ahora simplemente el script buscará lo que esté por defecto o podríamos iterar las búsquedas.
    lista_nits = ["800000090"] # El NIT de la empresa de tu imagen
    
    asyncio.run(scrape_supersociedades(lista_nits))
