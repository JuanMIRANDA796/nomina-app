import pdfplumber
import sys

pdf_path = r'C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome\TALLER 07 - VALORACIÓN INTEGRAL DE EMPRESAS 2.pdf'

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total de páginas: {len(pdf.pages)}\n")
    
    all_text = ""
    for i, page in enumerate(pdf.pages):
        text = page.extract_text()
        if text:
            all_text += f"\n{'='*80}\nPÁGINA {i+1}\n{'='*80}\n{text}\n"
    
    # Save to file for easier reading
    with open('taller_completo.txt', 'w', encoding='utf-8') as f:
        f.write(all_text)
    
    print(all_text)
