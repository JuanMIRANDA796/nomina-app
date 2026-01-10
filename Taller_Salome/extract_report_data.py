import openpyxl
import pandas as pd

file_path = r'C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome\TALLER07_ISAGEN_VALORACION.xlsx'
wb = openpyxl.load_workbook(file_path, data_only=True)

print("--- EXTRACCIÓN DE DATOS PARA INFORME ---")

# 1. Macro / WACC
ws_wacc = wb['9. Costo de Capital WACC'] # or 14
wacc_2024 = ws_wacc['F39'].value
ke_2024 = ws_wacc['F37'].value
beta_l = ws_wacc['F36'].value
print(f"WACC 2024: {wacc_2024}")
print(f"Ke 2024: {ke_2024}")
print(f"Beta Levered: {beta_l}")

# 2. Valuation
ws_dcf = wb['10. Valoración DCF']
ev = ws_dcf['N28'].value
equity = ws_dcf['N32'].value
print(f"Enterprise Value: {ev}")
print(f"Equity Value: {equity}")

# 3. Indicators (Sheet 7)
ws_ind = wb['7. Indicadores Financieros']
# EBITDA History (Row 6) - Cols B(2020) to G(2025)
ebitda_2020 = ws_ind['B6'].value
ebitda_2024 = ws_ind['F6'].value
print(f"EBITDA 2020: {ebitda_2020}")
print(f"EBITDA 2024: {ebitda_2024}")

# KTNO (Row 11)
ktno_2024 = ws_ind['F11'].value
print(f"KTNO 2024: {ktno_2024}")

# 4. Margins (Sheet 5 Vertical Analysis ER)
ws_va = wb['5. Análisis Vertical ER']
# Net Margin 2024 (Row ? Need to find Net Income row)
# Assuming Net Income is steady row.
print("Check margins in Vertical Analysis...")

# 5. Sensitivity
ws_sens = wb['11. Análisis Sensibilidad']
base_val = ws_sens.cell(9, 6).value # Center of table approx
print(f"Base Sensitivity Value: {base_val}")

