import os
import re

comp_dir = r"c:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\src\components\presentation"

# Get all chart files
chart_files = [f for f in os.listdir(comp_dir) if f.startswith("Benchmarking") and f.endswith("Chart.tsx")]

for filename in chart_files:
    filepath = os.path.join(comp_dir, filename)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract base_key
    # Example: const data = selectedMonth === 'diciembre' ? globalData.benchmarkingConsumoHasta1 ...
    match = re.search(r"globalData\.(\w+)", content)
    if not match:
        continue
    base_key = match.group(1)
    # Remove Enero/Febrero if it's the specific month key
    base_key = base_key.replace("Enero", "").replace("Febrero", "").replace("Marzo", "")

    # 1. Update useState
    content = content.replace("useState<'diciembre' | 'enero' | 'febrero'>('febrero')", "useState<'diciembre' | 'enero' | 'febrero' | 'marzo'>('marzo')")
    content = content.replace("useState<'diciembre' | 'enero' | 'febrero'>('marzo')", "useState<'diciembre' | 'enero' | 'febrero' | 'marzo'>('marzo')")

    # 2. Update data logic
    pattern_data = f"const data = selectedMonth === 'diciembre'\s+\? globalData\.{base_key}\s+: selectedMonth === 'enero'\s+\? globalData\.{base_key}Enero\s+: globalData\.{base_key}Febrero;"
    new_data = f"const data = selectedMonth === 'diciembre'\n        ? globalData.{base_key}\n        : selectedMonth === 'enero'\n            ? globalData.{base_key}Enero\n            : selectedMonth === 'febrero'\n                ? globalData.{base_key}Febrero\n                : globalData.{base_key}Marzo;"
    content = re.sub(pattern_data, new_data, content)

    # 3. Update sectionKey logic
    pattern_key = f"const sectionKey = selectedMonth === 'diciembre'\s+\? '{base_key}'\s+: selectedMonth === 'enero'\s+\? '{base_key}Enero'\s+: '{base_key}Febrero';"
    new_key = f"const sectionKey = selectedMonth === 'diciembre'\n        ? '{base_key}'\n        : selectedMonth === 'enero'\n            ? '{base_key}Enero'\n            : selectedMonth === 'febrero'\n                ? '{base_key}Febrero'\n                : '{base_key}Marzo';"
    content = re.sub(pattern_key, new_key, content)
    
    # 4. Update monthLabel
    content = content.replace("monthLabel={selectedMonth === 'diciembre' ? 'Diciembre' : selectedMonth === 'enero' ? 'Enero' : 'Febrero'}", 
                              "monthLabel={selectedMonth === 'diciembre' ? 'Diciembre' : selectedMonth === 'enero' ? 'Enero' : selectedMonth === 'febrero' ? 'Febrero' : 'Marzo'}")

    # 5. Add Feb/Mar buttons if not there
    if 'setSelectedMonth(\'marzo\')' not in content:
        feb_button_regex = r"(<button onClick=\{\(\) => setSelectedMonth\('febrero'\)\}.*?<\/button>)"
        def add_mar(match):
            feb_btn = match.group(1)
            color_class = "emerald" if "bg-emerald-600" in feb_btn else "slate" if "bg-slate-600" in feb_btn else "pink"
            mar_btn = f"\n                        <button onClick={{() => setSelectedMonth('marzo')}} className={{`px-3 py-1.5 text-xs font-bold transition-all ${{selectedMonth === 'marzo' ? 'bg-{color_class}-600 text-white' : 'text-slate-400 hover:text-white'}}`}}>Mar</button>"
            return feb_btn + mar_btn
        content = re.sub(feb_button_regex, add_mar, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
