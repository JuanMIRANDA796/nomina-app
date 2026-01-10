import pandas as pd
import os
import re

BASE_PATH = r'c:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome'
INPUT_FILE = os.path.join(BASE_PATH, "extracted_financials.csv")
OUTPUT_FILE = os.path.join(BASE_PATH, "Consolidado_Estados_Financieros_2020_2025.xlsx")

def clean_account_name(name):
    if not isinstance(name, str):
        return "UNKNOWN"
    # Uppercase and remove extra spaces
    name = name.upper().strip()
    # Remove common noise
    name = re.sub(r'[.,;:]$', '', name) # Remove trailing punctuation
    name = re.sub(r'\s+', ' ', name) # Multiple spaces to one
    return name

def main():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: {INPUT_FILE} not found.")
        return

    print("Loading data...")
    df = pd.read_csv(INPUT_FILE)
    
    # Clean account names
    df['Account_Clean'] = df['Account'].apply(clean_account_name)
    
    # Filter out likely garbage rows (e.g. names that are just numbers or too short)
    df = df[df['Account_Clean'].str.len() > 3]
    df = df[~df['Account_Clean'].str.match(r'^\d+$')] # Remove rows that are just numbers
    
    # Separate by type
    esf_df = df[df['Table_Type'] == 'ESF'].copy()
    er_df = df[df['Table_Type'] == 'ER'].copy()
    
    print(f"ESF Rows: {len(esf_df)}")
    print(f"ER Rows: {len(er_df)}")
    
    # Pivot tables: Index=Account, Columns=Year, Values=Value
    # We use 'sum' aggregation because sometimes the same account appears multiple times (e.g. in notes vs main table)
    # Ideally we should take the one from the main table, but sum might double count if duplicates exist.
    # Let's try 'max' or 'first' if we assume duplicates are identical. 
    # But 'sum' is safer if split across pages? No, accounts shouldn't be split.
    # Let's use 'max' to avoid double counting if the same table is extracted twice (e.g. from different pages).
    
    esf_pivot = esf_df.pivot_table(index='Account_Clean', columns='Year', values='Value', aggfunc='max')
    er_pivot = er_df.pivot_table(index='Account_Clean', columns='Year', values='Value', aggfunc='max')
    
    # Sort columns (Years)
    esf_pivot = esf_pivot.reindex(sorted(esf_pivot.columns), axis=1)
    er_pivot = er_pivot.reindex(sorted(er_pivot.columns), axis=1)
    
    # Fill NaN with 0
    esf_pivot = esf_pivot.fillna(0)
    er_pivot = er_pivot.fillna(0)
    
    # Save to Excel
    print(f"Saving to {OUTPUT_FILE}...")
    with pd.ExcelWriter(OUTPUT_FILE, engine='openpyxl') as writer:
        esf_pivot.to_excel(writer, sheet_name='Estado de Situación Financiera')
        er_pivot.to_excel(writer, sheet_name='Estado de Resultados')
        
    print("Done!")

if __name__ == "__main__":
    main()
