
import sys
import os
from docx import Document
import re

file_path = r"C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Proyecto\Modelo_Proyecto_UdeA_Entrega 5.docx"

try:
    doc = Document(file_path)
    print(f"Document loaded. Searching for keywords...")
    
    keywords = ["presupuesto", "costo", "gasto", "total", "marketing", "producción", "administrativo", "legal", "ambiental", "servucción"]
    
    found_count = 0
    for i, p in enumerate(doc.paragraphs):
        text = p.text.lower()
        if any(k in text for k in keywords):
            print(f"\n[Para {i}]: {p.text.strip()}")
            found_count += 1
            if found_count > 20:
                print("... (Stopping after 20 matches) ...")
                break
    
    if found_count == 0:
        print("No keywords found.")

except Exception as e:
    print(f"Error: {e}")
