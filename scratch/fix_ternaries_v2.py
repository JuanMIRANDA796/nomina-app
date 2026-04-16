import os
import re

dir_path = r'c:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\src\components\presentation'
files = [f for f in os.listdir(dir_path) if f.startswith('Benchmarking') and f.endswith('.tsx')]

for filename in files:
    full_path = os.path.join(dir_path, filename)
    with open(full_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    skip_next = False
    
    # We want to find the sequence of ternary assignments and normalize them.
    # The structure we want is:
    # const data = selectedMonth === 'diciembre'
    #     ? globalData.key
    #     : ...
    #     : globalData.keyMarzo;
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Detect the start of the data declaration
        if 'const data = selectedMonth' in line or '    ? globalData' in line:
            # Look ahead to find all ternary lines
            ternary_block = []
            j = i
            # If we started with a broken line (just ?), we go back a bit if possible or just start here
            if '    ? globalData' in line and 'const data' not in line:
                 # It's broken. We will synthesize the start.
                 pass
            
            # Find the end of the assignment (the semicolon)
            while j < len(lines) and ';' not in lines[j]:
                ternary_block.append(lines[j])
                j += 1
            if j < len(lines):
                ternary_block.append(lines[j]) # add the line with ;
            
            # Now analyze this block. 
            # We want to identify the base key (e.g. benchmarkingConsumo3To6)
            block_str = "".join(ternary_block)
            match = re.search(r'globalData\.(\w+Marzo)', block_str)
            if match:
                marzo_key = match.group(1)
                base_key = marzo_key.replace('Marzo', '')
                
                # Reconstruct the block perfectly
                # Handle cases where base key might not have "Enero" or "Febrero" in a simple way
                # But usually they follow a pattern.
                
                # Check if it's a Chart or a Table
                if 'Chart' in filename:
                     # Charts usually have Enero/Febrero suffixes
                     new_block = [
                         f"    const data = selectedMonth === 'diciembre'\n",
                         f"        ? globalData.{base_key}\n",
                         f"        : selectedMonth === 'enero'\n",
                         f"            ? globalData.{base_key}Enero\n",
                         f"            : selectedMonth === 'febrero'\n",
                         f"                ? globalData.{base_key}Febrero\n",
                         f"                : globalData.{base_key}Marzo;\n"
                     ]
                else:
                     # Tables often have Enero/Febrero as separate keys
                     # Actually most follow the same pattern now.
                     new_block = [
                         f"    const data = selectedMonth === 'diciembre'\n",
                         f"        ? globalData.{base_key}\n",
                         f"        : selectedMonth === 'enero'\n",
                         f"            ? globalData.{base_key}Enero\n",
                         f"            : selectedMonth === 'febrero'\n",
                         f"                ? globalData.{base_key}Febrero\n",
                         f"                : globalData.{base_key}Marzo;\n"
                     ]
                
                new_lines.extend(new_block)
                i = j + 1
                continue
        
        new_lines.append(line)
        i += 1
        
    with open(full_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Processed {filename}")
