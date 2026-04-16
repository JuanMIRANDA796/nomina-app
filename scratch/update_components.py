import os
import re

comp_dir = r"c:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\src\components\presentation"

files_to_update = [
    ("BenchmarkingConsumoHasta1Chart.tsx", "benchmarkingConsumoHasta1"),
    ("BenchmarkingConsumo1To3Chart.tsx", "benchmarkingConsumo1To3"),
    ("BenchmarkingConsumo3To6Chart.tsx", "benchmarkingConsumo3To6"),
    ("BenchmarkingConsumo6To12Chart.tsx", "benchmarkingConsumo6To12"),
    ("BenchmarkingConsumo12To25Chart.tsx", "benchmarkingConsumo12To25"),
    ("BenchmarkingConsumoTodosChart.tsx", "benchmarkingConsumoTodos"),
    ("BenchmarkingViviendaVisHasta20Chart.tsx", "benchmarkingViviendaVisHasta20"), # already done but script won't hurt
    ("BenchmarkingViviendaVisSup20Chart.tsx", "benchmarkingViviendaVisSup20"),
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
    old_data_pattern = f"const data = selectedMonth === 'diciembre'\s+\? globalData\.{base_key}\s+: selectedMonth === 'enero'\s+\? globalData\.{base_key}Enero\s+: globalData\.{base_key}Febrero;"
    new_data_content = f"const data = selectedMonth === 'diciembre'\n        ? globalData.{base_key}\n        : selectedMonth === 'enero'\n            ? globalData.{base_key}Enero\n            : selectedMonth === 'febrero'\n                ? globalData.{base_key}Febrero\n                : globalData.{base_key}Marzo;"
    
    content = re.sub(old_data_pattern, new_data_content, content)

    # 3. Update sectionKey logic
    old_key_pattern = f"const sectionKey = selectedMonth === 'diciembre'\s+\? '{base_key}'\s+: selectedMonth === 'enero'\s+\? '{base_key}Enero'\s+: '{base_key}Febrero';"
    new_key_content = f"const sectionKey = selectedMonth === 'diciembre' \n        ? '{base_key}' \n        : selectedMonth === 'enero' \n            ? '{base_key}Enero' \n            : selectedMonth === 'febrero'\n                ? '{base_key}Febrero'\n                : '{base_key}Marzo';"
    
    content = re.sub(old_key_pattern, new_key_content, content)
    
    # 4. Update monthLabel
    content = content.replace("monthLabel={selectedMonth === 'diciembre' ? 'Diciembre' : selectedMonth === 'enero' ? 'Enero' : 'Febrero'}", 
                              "monthLabel={selectedMonth === 'diciembre' ? 'Diciembre' : selectedMonth === 'enero' ? 'Enero' : selectedMonth === 'febrero' ? 'Febrero' : 'Marzo'}")

    # 5. Add Feb/Mar buttons if not there
    # Look for the Feb button line and add Mar after it
    if 'setSelectedMonth(\'marzo\')' not in content:
        # Search for Feb button and add Mar button
        feb_button_regex = r"(<button onClick=\{\(\) => setSelectedMonth\('febrero'\)\}.*?<\/button>)"
        def add_mar(match):
            feb_btn = match.group(1)
            # Find the color class to match UI (some use emerald, some slate)
            color_class = "emerald" if "bg-emerald-600" in feb_btn else "slate" if "bg-slate-600" in feb_btn else "pink"
            mar_btn = f"\n                        <button onClick={{() => setSelectedMonth('marzo')}} className={{`px-3 py-1.5 text-xs font-bold transition-all ${{selectedMonth === 'marzo' ? 'bg-{color_class}-600 text-white' : 'text-slate-400 hover:text-white'}}`}}>Mar</button>"
            return feb_btn + mar_btn
            
        content = re.sub(feb_button_regex, add_mar, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filename}")
