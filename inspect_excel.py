import pandas as pd
import os

folder_path = r'c:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome'
files = [f for f in os.listdir(folder_path) if f.endswith('.xlsx')]

if files:
    first_file = os.path.join(folder_path, files[0])
    print(f"Analizando archivo: {files[0]}")
    
    xls = pd.ExcelFile(first_file)
    print(f"Hojas encontradas: {xls.sheet_names}")
    
    for sheet in xls.sheet_names:
        print(f"\n--- Hoja: {sheet} ---")
        df = pd.read_excel(first_file, sheet_name=sheet, nrows=5)
        print(df.to_string())
else:
    print("No se encontraron archivos .xlsx en la carpeta.")
