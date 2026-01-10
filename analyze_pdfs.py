import pdfplumber
import os
import re

folder_path = r'c:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome'
files = [f for f in os.listdir(folder_path) if f.endswith('.pdf')]

keywords = [
    "Estado de Situación Financiera",
    "Estado de Resultados",
    "Estado del Resultado",
    "Situación Financiera",
    "Resultados Integrales"
]

for file in files:
    print(f"\nAnalyzing: {file}")
    path = os.path.join(folder_path, file)
    try:
        with pdfplumber.open(path) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    # Normalize text for search
                    text_lower = text.lower()
                    found = []
                    for k in keywords:
                        if k.lower() in text_lower:
                            found.append(k)
                    
                    if found:
                        print(f"  Page {i+1}: Found {found}")
                        # Print first few lines to verify context
                        lines = text.split('\n')[:5]
                        print(f"    Context: {lines}")
    except Exception as e:
        print(f"  Error reading {file}: {e}")
