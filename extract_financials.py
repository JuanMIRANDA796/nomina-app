import pdfplumber
import pandas as pd
import os
import re

# Configuration of files and expected years
FILES_CONFIG = [
    {
        "file": "EEFF-Notas-Anio-2021.pdf",
        "years": [2021, 2020],
        "type": "combined" 
    },
    {
        "file": "5_EEFF_ISAGEN_2022.pdf",
        "years": [2022], # Often compares with previous year, we need to check
        "type": "combined"
    },
    {
        "file": "1EstadosFinancierosConsolidadosOrganized.pdf",
        "years": [2023],
        "type": "combined"
    },
    {
        "file": "3_2509_Estados_Financieros_Consolidado_Ok.pdf",
        "years": [2025, 2024],
        "type": "combined"
    }
]

BASE_PATH = r'c:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome'

def clean_text(text):
    if not isinstance(text, str):
        return ""
    # Fix common PDF extraction issues
    text = text.replace('\n', ' ').strip()
    # Fix broken words like "PA,TRIMONIO" -> "PATRIMONIO" if comma is inside word
    # This is risky for numbers, so be careful. 
    # Only remove comma if surrounded by letters
    text = re.sub(r'(?<=[a-zA-Z]),(?=[a-zA-Z])', '', text)
    return text

def parse_number(value):
    if isinstance(value, (int, float)):
        return value
    if not isinstance(value, str):
        return None
    
    value = value.strip()
    if not value or value == '-':
        return 0
        
    # Handle parentheses for negative
    is_negative = False
    if '(' in value and ')' in value:
        is_negative = True
        value = value.replace('(', '').replace(')', '')
    
    # Remove currency and spaces
    value = value.replace('$', '').replace(' ', '')
    
    # Try to determine format
    try:
        # If it has comma and dot: 1.234,56 -> 1234.56
        if ',' in value and '.' in value:
            value = value.replace('.', '').replace(',', '.')
        elif ',' in value: 
            # 1,234 or 1,234,567 -> 1234 or 1234567 (US format) OR 12,34 (Decimal comma)
            # This is ambiguous. Let's assume Colombian/European: Comma is decimal if it's at the end?
            # Or usually financial statements in Colombia use dots for thousands.
            # Let's assume dot = thousand, comma = decimal
            value = value.replace('.', '').replace(',', '.')
        elif '.' in value:
            # 1.234 -> 1234
            # But 1.23 could be 1.23
            # If there are multiple dots, it's thousands: 1.234.567
            if value.count('.') > 1:
                value = value.replace('.', '')
            else:
                # Hard to say. 
                # If the number is "small" (like < 100) it might be a percentage or ratio, but here we expect large numbers.
                # Let's assume it's thousands separator for now.
                value = value.replace('.', '')
                
        return float(value) * (-1 if is_negative else 1)
    except:
        return None

def process_file(config):
    filepath = os.path.join(BASE_PATH, config["file"])
    print(f"Processing {config['file']}...")
    
    extracted_rows = []
    
    with pdfplumber.open(filepath) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue
            
            text_lower = text.lower()
            
            # Identify table type
            table_type = None
            if "estado de situación financiera" in text_lower or "situación financiera" in text_lower:
                table_type = "ESF"
            elif "estado de resultados" in text_lower or "estado del resultado" in text_lower or "resultados integrales" in text_lower:
                table_type = "ER"
            
            if not table_type:
                continue

            # Extract table with lenient settings
            table = page.extract_table({
                "vertical_strategy": "text", 
                "horizontal_strategy": "text",
                "snap_tolerance": 4,
            })
            
            if not table:
                continue
                
            df = pd.DataFrame(table)
            
            # Find header row containing years
            header_idx = -1
            years_found = []
            
            for idx, row in df.iterrows():
                row_str = " ".join([str(x) for x in row if x])
                # Check for at least one year from config
                current_years = [y for y in config["years"] if str(y) in row_str]
                if current_years:
                    header_idx = idx
                    years_found = current_years
                    break
            
            if header_idx == -1:
                continue
                
            print(f"  Found {table_type} on page {page.page_number} with years {years_found}")
            
            # Process data rows
            # We need to map columns to years.
            # This is tricky because columns might be shifted.
            # Strategy: Identify which columns contain the year numbers in the header row.
            
            header_row = df.iloc[header_idx]
            year_col_indices = {} # year -> list of col indices (could be multiple if side-by-side)
            
            for col_idx, val in enumerate(header_row):
                val_str = str(val)
                for y in config["years"]:
                    if str(y) in val_str:
                        if y not in year_col_indices:
                            year_col_indices[y] = []
                        year_col_indices[y].append(col_idx)
            
            # Iterate over data rows
            for idx in range(header_idx + 1, len(df)):
                row = df.iloc[idx]
                
                # Check if this row has data for the years
                # We assume the account name is in the first non-empty text column to the left of data
                
                # Split row into potential "blocks" if it's a side-by-side table
                # If we have multiple indices for the same year, it's likely side-by-side
                
                # Simplified approach: Iterate over each year's column(s) and find the corresponding label
                
                for year, col_indices in year_col_indices.items():
                    for col_idx in col_indices:
                        val_raw = row[col_idx]
                        val = parse_number(val_raw)
                        
                        if val is not None:
                            # Find label: look backwards from col_idx
                            label = None
                            for i in range(col_idx - 1, -1, -1):
                                txt = clean_text(row[i])
                                if txt and not parse_number(txt): # It's text, not a number
                                    label = txt
                                    break
                            
                            if label:
                                extracted_rows.append({
                                    "Source_File": config["file"],
                                    "Table_Type": table_type,
                                    "Year": year,
                                    "Account": label,
                                    "Value": val,
                                    "Raw_Value": val_raw
                                })

    return pd.DataFrame(extracted_rows)

def main():
    all_data = pd.DataFrame()
    for config in FILES_CONFIG:
        df = process_file(config)
        if not df.empty:
            all_data = pd.concat([all_data, df], ignore_index=True)
    
    if not all_data.empty:
        print(f"Extracted {len(all_data)} rows.")
        output_path = os.path.join(BASE_PATH, "extracted_financials.csv")
        all_data.to_csv(output_path, index=False)
        print(f"Saved to {output_path}")
        
        # Preview
        print(all_data.head())
        print(all_data.groupby(['Year', 'Table_Type']).size())
    else:
        print("No data extracted.")

if __name__ == "__main__":
    main()

