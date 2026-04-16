import os
import pandas as pd
import zipfile
import re

# Carpetas de trabajo
INPUT_DIR = os.path.join(os.getcwd(), "descargas_masivas_final")
OUTPUT_DIR = os.path.join(os.getcwd(), "bases_consolidadas")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Mapeo de IDs a nombres legibles para los archivos finales
REPORT_MAP = {
    "1": "01_caratula",
    "2": "02_esf_balance",
    "3": "03_estado_resultados",
    "5": "05_flujo_efectivo",
    "8": "08_notas_efectivo",
    "14": "14_cuentas_por_pagar",
    "16": "16_cuentas_por_cobrar"
}

def consolidar():
    # Diccionario para guardar listas de dataframes por tipo de reporte
    data_stacks = {report_id: [] for report_id in REPORT_MAP.keys()}
    
    # 1. Listar todos los ZIPs descargados
    zip_files = [f for f in os.listdir(INPUT_DIR) if f.endswith('.zip')]
    print(f"Detectados {len(zip_files)} archivos ZIP para procesar...")

    for zip_name in zip_files:
        # Extraer metadatos del nombre del archivo (ej: 2023_plenas_individuales.zip)
        parts = zip_name.replace('.zip', '').split('_')
        anio = parts[0]
        categoria = " ".join(parts[1:]).capitalize()
        
        print(f" -> Procesando {anio} | {categoria}...")
        
        zip_path = os.path.join(INPUT_DIR, zip_name)
        
        with zipfile.ZipFile(zip_path, 'r') as z:
            # Listar archivos dentro del ZIP
            for excel_name in z.namelist():
                # Extraer el ID del nombre del archivo (suele empezar con el ID)
                # Formato tipico: "1_Nombre.xlsx" o "10000_Caratula.xlsx"
                # Pero en reportes masivos el ID es el numero de prioridad que definimos
                
                # Buscamos coincidencias con nuestros IDs mediante inspeccion del nombre
                matched_id = None
                
                # Intentamos detectar el ID basado en los nombres estandar de Supersociedades
                if "10000" in excel_name or excel_name.startswith("1_"): matched_id = "1"
                elif "210030" in excel_name or excel_name.startswith("2_"): matched_id = "2"
                elif "310030" in excel_name or excel_name.startswith("3_"): matched_id = "3"
                elif "520000" in excel_name or excel_name.startswith("5_"): matched_id = "5"
                elif "800010" in excel_name or excel_name.startswith("8_"): matched_id = "8"
                elif "110000" in excel_name: matched_id = "14" # Pasivos
                elif "210000" in excel_name: matched_id = "16" # Activos/Cartera
                
                if matched_id and matched_id in data_stacks:
                    try:
                        # Leer el Excel directamente desde el ZIP
                        with z.open(excel_name) as f:
                            # Nota: Usamos engine='openpyxl' para Excels modernos
                            df = pd.read_excel(f)
                            
                            # Agregar metadatos de origen
                            df['METADATO_ANIO'] = anio
                            df['METADATO_CATEGORIA'] = categoria
                            df['METADATO_ARCHIVO_ORIGEN'] = excel_name
                            
                            data_stacks[matched_id].append(df)
                    except Exception as e:
                        print(f"    [!] Error leyendo {excel_name}: {e}")

    # 2. Consolidar y guardar en Parquet
    print("\n📦 Guardando bases de datos finales...")
    for report_id, df_list in data_stacks.items():
        name = REPORT_MAP[report_id]
        if df_list:
            print(f" -> Consolidando {name} ({len(df_list)} archivos)...")
            final_df = pd.concat(df_list, ignore_index=True)
            
            # Limpiar nombres de columnas (quitar espacios raros)
            final_df.columns = [str(c).strip().replace('\n', ' ') for c in final_df.columns]
            
            # Guardar en Parquet
            parquet_path = os.path.join(OUTPUT_DIR, f"{name}.parquet")
            final_df.to_parquet(parquet_path, index=False)
            
            # Tambien guardamos una version CSV pequeña para vista previa
            final_df.head(100).to_csv(os.path.join(OUTPUT_DIR, f"{name}_preview.csv"), index=False)
            
            print(f"    ✅ Guardado: {name}.parquet (Filas: {len(final_df)})")
        else:
            print(f"    [?] No se encontraron archivos para {name}.")

    print(f"\n¡PROCESO COMPLETADO! Revisa la carpeta: {OUTPUT_DIR}")

if __name__ == "__main__":
    # Asegurarnos de tener las librerias necesarias
    try:
        import openpyxl
        import pyarrow
        consolidar()
    except ImportError:
        print("Instalando librerias faltantes (pandas, openpyxl, pyarrow)...")
        os.system("pip install pandas openpyxl pyarrow fastparquet")
        consolidar()
