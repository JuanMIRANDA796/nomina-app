import pandas as pd

file_path = r'C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome\Consolidado_Estados_Financieros_2020_2025.xlsx'

# Leer ESF
print("ESTADO DE SITUACION FINANCIERA (Balance General)")
print("="*100)
df_esf = pd.read_excel(file_path, sheet_name='ESF')
print(df_esf.to_string())

print("\n\n")
print("ESTADO DE RESULTADOS")
print("="*100)
df_er = pd.read_excel(file_path, sheet_name='ER')
print(df_er.to_string())

# Guardar a CSV para mejor lectura
df_esf.to_csv('esf_data.csv', index=False, encoding='utf-8')
df_er.to_csv('er_data.csv', index=False, encoding='utf-8')
print("\n\nArchivos CSV guardados para revisión")
