import pdfplumber
import os

files = [
    ("1EstadosFinancierosConsolidadosOrganized.pdf", [2023, 2024]),
    ("3_2509_Estados_Financieros_Consolidado_Ok.pdf", [2025, 2024])
]
BASE_PATH = r'c:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome'

keywords = ["balance", "estado de situacion", "situacion financiera", "activos", "pasivos", "patrimonio"]

for filename, years in files:
    path = os.path.join(BASE_PATH, filename)
    print(f"\n{'='*60}")
    print(f"File: {filename}")
    print(f"Expected years: {years}")
    print('='*60)
    
    with pdfplumber.open(path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                text_lower = text.lower()
                # Check for balance sheet keywords
                found_keywords = [k for k in keywords if k in text_lower]
                # Check for years
                found_years = [y for y in years if str(y) in text]
                
                if found_keywords or found_years:
                    print(f"\nPage {i+1}:")
                    print(f"  Keywords found: {found_keywords}")
                    print(f"  Years found: {found_years}")
                    # Show first 300 chars
                    print(f"  Preview: {text[:300]}")
