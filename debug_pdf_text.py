import pdfplumber
import os

files = [
    "1EstadosFinancierosConsolidadosOrganized.pdf",
    "3_2509_Estados_Financieros_Consolidado_Ok.pdf"
]
BASE_PATH = r'c:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome'

for f in files:
    path = os.path.join(BASE_PATH, f)
    print(f"\n--- {f} ---")
    with pdfplumber.open(path) as pdf:
        for i, page in enumerate(pdf.pages[:5]): # Check first 5 pages
            text = page.extract_text()
            print(f"Page {i+1}:")
            if text:
                print(text[:500]) # Print first 500 chars
            else:
                print("[No text extracted]")
