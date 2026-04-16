import os
import re

comp_dir = r"c:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\src\components\presentation"

files_to_update = [
    ("BenchmarkingCDATsTable.tsx", "benchmarkingCDATs"),
    ("BenchmarkingCreditsTable.tsx", "benchmarkingCredits"),
]

for filename, base_key in files_to_update:
    filepath = os.path.join(comp_dir, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filename}")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update useState
    content = content.replace("useState<'diciembre' | 'enero' | 'febrero'>('febrero')", "useState<'diciembre' | 'enero' | 'febrero' | 'marzo'>('marzo')")
    
    # 2. Update data logic
    pattern_data = f"const data = selectedMonth === 'diciembre'\s+\? globalData\.{base_key}\s+: selectedMonth === 'enero'\s+\? globalData\.{base_key}Enero\s+: globalData\.{base_key}Febrero;"
    new_data = f"const data = selectedMonth === 'diciembre'\n        ? globalData.{base_key}\n        : selectedMonth === 'enero'\n            ? globalData.{base_key}Enero\n            : selectedMonth === 'febrero'\n                ? globalData.{base_key}Febrero\n                : globalData.{base_key}Marzo;"
    content = re.sub(pattern_data, new_data, content)

    # 3. Update sectionKey logic
    pattern_key = f"const sectionKey = selectedMonth === 'diciembre'\s+\? '{base_key}'\s+: selectedMonth === 'enero'\s+\? '{base_key}Enero'\s+: '{base_key}Febrero';"
    new_key = f"const sectionKey = selectedMonth === 'diciembre'\n        ? '{base_key}'\n        : selectedMonth === 'enero'\n            ? '{base_key}Enero'\n            : selectedMonth === 'febrero'\n                ? '{base_key}Febrero'\n                : '{base_key}Marzo';"
    content = re.sub(pattern_key, new_key, content)
    
    # 4. Update month list in buttons
    content = content.replace("(['diciembre', 'enero', 'febrero'] as const).map", "(['diciembre', 'enero', 'febrero', 'marzo'] as const).map")
    
    # Optional: Update titles/dates if they reference Feb
    content = content.replace("selectedMonth === 'febrero' ? '19/03/2026'", "selectedMonth === 'marzo' ? '16/04/2026' : selectedMonth === 'febrero' ? '19/03/2026'")
    content = content.replace("selectedMonth === 'febrero' ? '16/03/2026'", "selectedMonth === 'marzo' ? '16/04/2026' : selectedMonth === 'febrero' ? '16/03/2026'")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
