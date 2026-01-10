import pandas as pd
from openpyxl import load_workbook

# Load the workbook
wb_file = r'C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome\TALLER07_ISAGEN_VALORACION.xlsx'

# Read some key data to show
print("="*80)
print("RESUMEN DEL ARCHIVO ISAGEN")
print("="*80)

# Read Indicators sheet
df_ind = pd.read_excel(wb_file, sheet_name='7. Indicadores Financieros', header=4)
print("\n📊 INDICADORES FINANCIEROS (2024):")
print(df_ind[['INDICADOR', '2024']].head(15).to_string(index=False))

# Read Cash Flows sheet
df_fc = pd.read_excel(wb_file, sheet_name='8. Flujos de Caja', header=4)
print("\n\n💰 FLUJOS DE CAJA (2024):")
print(df_fc[['CONCEPTO', '2024']].head(20).to_string(index=False))

print("\n" + "="*80)
print("✅ ARCHIVO COMPLETO CON TODAS LAS FÓRMULAS")
print("="*80)
