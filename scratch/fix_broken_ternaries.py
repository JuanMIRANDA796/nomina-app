import os
import re

dir_path = r'c:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\src\components\presentation'
files = [f for f in os.listdir(dir_path) if f.startswith('Benchmarking') and f.endswith('.tsx')]

pattern = re.compile(r'(\s+)const \[isEditing, setIsEditing\] = useState\(false\);\s*\n\s*\n\s+\? globalData', re.MULTILINE)

for filename in files:
    full_path = os.path.join(dir_path, filename)
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if it has the broken structure
    if '\n        ? globalData.' in content:
        print(f"Fixing {filename}")
        # Find where it's broken. It's usually after setIsEditing
        new_content = content.replace('\n        ? globalData.', '\n    const data = selectedMonth === \'diciembre\'\n        ? globalData.')
        
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
    else:
        print(f"Skipping {filename}")
