import pandas as pd

file_path = 'c:/Users/Juan/.gemini/antigravity/scratch/nomina_colombia/web/interactive_presentation/3. Colocación_Diciembre.xlsx'

df1 = pd.read_excel(file_path, sheet_name='Tasa Desembolso Mensual', header=None)
df2 = pd.read_excel(file_path, sheet_name='Hoja1', header=None)

with open('debug_excel.txt', 'w') as f:
    f.write("--- TASA DESEMBOLSO ---\n")
    f.write(df1.iloc[:30, :20].to_string())
    f.write("\n\n--- HOJA 1 ---\n")
    f.write(df2.iloc[:30, :20].to_string())
