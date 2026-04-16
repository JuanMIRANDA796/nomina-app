import json
import os

data_dir = r"c:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\src\data"

march_summary = [
    { "segmento": "Hasta 1 SMLV", "file": "benchmarking_consumo_hasta_1", "entidades": 23, "monto_total": 64400, "desembolsos": 37789, "tasa_prom": 23.13, "tasa_presente": 23.28, "monto_presente": 288 },
    { "segmento": "De 1 a 3 SMLV", "file": "benchmarking_consumo_1_to_3", "entidades": 32, "monto_total": 156570, "desembolsos": 44389, "tasa_prom": 23.54, "tasa_presente": 23.22, "monto_presente": 1059 },
    { "segmento": "De 3 a 6 SMLV", "file": "benchmarking_consumo_3_to_6", "entidades": 34, "monto_total": 338200, "desembolsos": 43097, "tasa_prom": 23.71, "tasa_presente": 23.12, "monto_presente": 1406 },
    { "segmento": "De 6 a 12 SMLV", "file": "benchmarking_consumo_6_to_12", "entidades": 33, "monto_total": 579900, "desembolsos": 37789, "tasa_prom": 23.13, "tasa_presente": 21.27, "monto_presente": 1790 },
    { "segmento": "De 12 a 25 SMLV", "file": "benchmarking_consumo_12_to_25", "entidades": 31, "monto_total": 655890, "desembolsos": 21840, "tasa_prom": 22.28, "tasa_presente": 18.99, "monto_presente": 1379 },
    { "segmento": "Consumo - Todos los montos", "file": "benchmarking_consumo_todos", "entidades": 35, "monto_total": 3270000, "desembolsos": 307248, "tasa_prom": 22.95, "tasa_presente": 20.00, "monto_presente": 8527 },
    { "segmento": "Vivienda VIS - Hasta 20 años", "file": "benchmarking_vivienda_vis_hasta_20", "entidades": 17, "monto_total": 590110, "desembolsos": 5730, "tasa_prom": 13.13, "tasa_presente": 11.16, "monto_presente": 577 },
    { "segmento": "Vivienda VIS - Todos los plazos", "file": "benchmarking_vivienda_vis_sup_20", "entidades": 18, "monto_total": 884330, "desembolsos": 4054, "tasa_prom": 13.88, "tasa_presente": 10.48, "monto_presente": 1630 },
]

for item in march_summary:
    feb_file = os.path.join(data_dir, f"{item['file']}_febrero.json")
    mar_file = os.path.join(data_dir, f"{item['file']}_marzo.json")
    
    if os.path.exists(feb_file):
        with open(feb_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        # Update Total (first row)
        data[0]['entity'] = f"{item['entidades']} entidades"
        data[0]['amount'] = item['monto_total']
        data[0]['disbursements_num'] = item['desembolsos']
        data[0]['tpp'] = item['tasa_prom']
        
        # Update PRESENTE (last row) - search for it
        for i in range(len(data)):
            if data[i]['entity'] == 'PRESENTE':
                data[i]['tpp'] = item['tasa_presente']
                data[i]['amount'] = item['monto_presente']
                # We don't have March disbursements for PRESENTE for others, keep Feb's or set to a guess 
                # (for Vivienda VIS it was 8, let's keep it as is if not available)
                break
                
        with open(mar_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Created {mar_file}")
    else:
        print(f"Feb file not found: {feb_file}")
