import pdfplumber

pdf_path = r'C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome\TALLER 07 - VALORACIÓN INTEGRAL DE EMPRESAS 2.pdf'

with pdfplumber.open(pdf_path) as pdf:
    for i, page in enumerate(pdf.pages):
        print(f'\n{"="*80}')
        print(f'PÁGINA {i+1}')
        print("="*80)
        text = page.extract_text()
        if text:
            print(text)
