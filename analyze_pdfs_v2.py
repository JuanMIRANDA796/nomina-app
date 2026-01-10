import pdfplumber
import os

folder_path = r'c:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome'
files = [f for f in os.listdir(folder_path) if f.endswith('.pdf')]

keywords = {
    "ESF": ["estado de situacion financiera", "situacion financiera"],
    "ER": ["estado de resultados", "estado del resultado", "resultados integrales"]
}

print("START_ANALYSIS")
for file in files:
    path = os.path.join(folder_path, file)
    try:
        with pdfplumber.open(path) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    text_lower = text.lower().replace('\n', ' ')
                    
                    found_types = []
                    for k_type, k_list in keywords.items():
                        for k in k_list:
                            if k in text_lower:
                                found_types.append(k_type)
                                break
                    
                    if found_types:
                        # Check for years to confirm context
                        years = []
                        for y in range(2018, 2026):
                            if str(y) in text_lower:
                                years.append(y)
                        
                        print(f"File: {file} | Page: {i+1} | Type: {found_types} | Years: {years}")
    except Exception as e:
        print(f"Error: {file} - {e}")
print("END_ANALYSIS")
