
import re

input_file = r'C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome\INFORME_VALORACION_ISAGEN.md'
output_file = r'C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Salome\INFORME_VALORACION_ISAGEN.html'

with open(input_file, 'r', encoding='utf-8') as f:
    md_text = f.read()

# Basic Markdown to HTML conversion
html_text = f"""
<html>
<head>
<meta charset="utf-8">
<style>
body {{ font-family: Arial, sans-serif; line-height: 1.5; margin: 2.5cm; }}
h1 {{ color: #2E74B5; font-size: 16pt; margin-top: 20px; }}
h2 {{ color: #2E74B5; font-size: 14pt; margin-top: 15px; border-bottom: 1px solid #ccc; }}
p {{ margin-bottom: 10px; text-align: justify; }}
li {{ margin-bottom: 5px; }}
strong {{ font-weight: bold; }}
</style>
</head>
<body>
"""

for line in md_text.split('\n'):
    line = line.strip()
    if not line:
        continue
        
    # Headers
    if line.startswith('# '):
        html_text += f"<h1>{line[2:]}</h1>\n"
    elif line.startswith('## '):
        html_text += f"<h2>{line[3:]}</h2>\n"
    # Lists
    elif line.startswith('* '):
        # Bold inside list
        content = line[2:]
        content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', content)
        html_text += f"<ul><li>{content}</li></ul>\n"
    # Separator
    elif line.startswith('---'):
        html_text += "<hr>\n"
    # Paragraphs
    else:
        # Bold
        content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
        html_text += f"<p>{content}</p>\n"

html_text += "</body></html>"

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html_text)

print(f"HTML generado: {output_file}")
