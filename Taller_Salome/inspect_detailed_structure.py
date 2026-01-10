import pandas as pd

file_path = r'C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome\TALLER07_ISAGEN_VALORACION.xlsx'

# Read sheets 1 and 2 to get the Concept columns
df_bsc = pd.read_excel(file_path, sheet_name='1. Balance General', header=4)
df_er = pd.read_excel(file_path, sheet_name='2. Estado de Resultados', header=4)

print("--- 1. Balance General Structure ---")
print(df_bsc['CONCEPTO'].head(60).to_string())

print("\n--- 2. Estado de Resultados Structure ---")
print(df_er['CONCEPTO'].head(40).to_string())
