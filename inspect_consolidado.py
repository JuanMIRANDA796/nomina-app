import pandas as pd
import openpyxl

file_path = r'C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome\Consolidado_Estados_Financieros_2020_2025.xlsx'

# Leer el archivo
wb = openpyxl.load_workbook(file_path)

print("="*80)
print("ANÁLISIS DEL ARCHIVO CONSOLIDADO")
print("="*80)

# Examinar cada hoja
for sheet_name in wb.sheetnames:
    print(f"\n{'='*80}")
    print(f"HOJA: {sheet_name}")
    print("="*80)
    
    # Leer con pandas para ver estructura
    df = pd.read_excel(file_path, sheet_name=sheet_name)
    
    print(f"\nDimensiones: {df.shape[0]} filas x {df.shape[1]} columnas")
    print(f"\nColumnas disponibles:")
    print(df.columns.tolist())
    
    print(f"\nPrimeras 20 filas:")
    print(df.head(20).to_string())
    
    print(f"\n\nÚltimas 10 filas:")
    print(df.tail(10).to_string())
