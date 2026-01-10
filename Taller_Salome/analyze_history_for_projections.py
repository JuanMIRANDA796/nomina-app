import pandas as pd

# Load previous file
file_path = r'C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome\TALLER07_ISAGEN_VALORACION.xlsx'

# Read Income Statement (ER) and Balance Sheet (BSC) to calculate ratios
# Skip rows to get to data (headers are likely on row 5 or 6)
df_er = pd.read_excel(file_path, sheet_name='2. Estado de Resultados', header=4)
df_bsc = pd.read_excel(file_path, sheet_name='1. Balance General', header=4)
df_ind = pd.read_excel(file_path, sheet_name='7. Indicadores Financieros', header=4)
df_wacc = pd.read_excel(file_path, sheet_name='9. Costo de Capital WACC', header=4)

print("Historical Data Loaded.")
print("ER Columns:", df_er.columns)
print("BSC Columns:", df_bsc.columns)

# We need to extract key drivers:
# 1. Revenue Growth Rate
# 2. COGS as % of Revenue
# 3. Expenses as % of Revenue
# 4. Tax Rate
# 5. Accounts Receivable Days (Cartera)
# 6. Inventory Days
# 7. Accounts Payable Days (Proveedores)
# 8. Kd (Cost of Debt)
# 9. Ke (Cost of Equity) parameters

# Let's inspect the data slightly to make sure we grab correct rows
print("\n--- ER Head ---")
print(df_er.head())
print("\n--- BSC Head ---")
print(df_bsc.head())
print("\n--- WACC Head ---")
print(df_wacc.head())
