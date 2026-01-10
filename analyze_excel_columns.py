import openpyxl
import sys

sys.stdout.reconfigure(encoding='utf-8')

file_path = r"C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\legacy_excel\REGISTRO HORAS  (1).xlsm"
output_file = r"C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\excel_analysis_columns.txt"

try:
    with open(output_file, 'w', encoding='utf-8') as f:
        wb = openpyxl.load_workbook(file_path, data_only=False)
        ws = wb["HOJA_BASE"]
        
        f.write("--- HOJA_BASE Columns AQ and AW ---\n")
        
        # Check headers (Row 1) and values (Row 2, 3) for AQ(43) and AW(49)
        # AQ is 43 (A=1...Z=26, AA=27...AQ=43)
        # AW is 49
        
        cols_to_check = [43, 49]
        col_names = {43: 'AQ', 49: 'AW'}
        
        for row in range(1, 25): # First 24 rows covers headers and the summary table area
            row_data = []
            for col in cols_to_check:
                cell = ws.cell(row=row, column=col)
                val = cell.value
                row_data.append(f"{col_names[col]}{row}={val}")
            f.write(f"Row {row}: {', '.join(row_data)}\n")

    print("Done.")
except Exception as e:
    print(f"Error: {e}")
