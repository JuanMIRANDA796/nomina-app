
import xlsxwriter
import os

output_path = r"C:\Users\Juan\.gemini\antigravity\scratch\nomina_colombia\web\Taller_Proyecto\Presupuesto_Proyecto_Template.xlsx"

# Create content
workbook = xlsxwriter.Workbook(output_path)

# Formats
header_fmt = workbook.add_format({'bold': True, 'bg_color': '#D3D3D3', 'border': 1, 'align': 'center', 'valign': 'vcenter'})
currency_fmt = workbook.add_format({'num_format': '"$"#,##0', 'border': 1})
text_border_fmt = workbook.add_format({'border': 1})
title_fmt = workbook.add_format({'bold': True, 'font_size': 14, 'align': 'center'})
total_fmt = workbook.add_format({'bold': True, 'bg_color': '#EFEFEF', 'num_format': '"$"#,##0', 'border': 1})

# --- Sheet 1: Información General ---
ws_info = workbook.add_worksheet("Información General")
ws_info.set_column('A:A', 25)
ws_info.set_column('B:B', 50)

ws_info.write('A1', 'NOMBRE DEL PROYECTO', header_fmt)
ws_info.write('B1', '[Nombre del Proyecto Aquí]', text_border_fmt)
ws_info.write('A2', 'AUTORES', header_fmt)
ws_info.write('B2', '[Nombres de los Autores]', text_border_fmt)
ws_info.write('A3', 'FECHA', header_fmt)
ws_info.write('B3', '2025', text_border_fmt)
ws_info.write('A5', 'INSTRUCCIONES', title_fmt)
ws_info.write('A6', '1. Vaya a la hoja "Presupuestos_Areas" y diligencie los valores estimados para cada rubro.')
ws_info.write('A7', '2. Puede agregar o eliminar filas según sea necesario, pero asegúrese de actualizar las fórmulas de suma.')
ws_info.write('A8', '3. La hoja "Resumen_Grafico" se actualizará automáticamente.')

# --- Sheet 2: Presupuestos_Areas ---
ws_data = workbook.add_worksheet("Presupuestos_Areas")
ws_data.set_column('A:A', 30) # Concepto
ws_data.set_column('B:B', 20) # Valor

rubros = {
    "MARKETING": [
        "Publicidad Digital", "Eventos y Ferias", "Material POP", "Agencia Marketing", "Otros Marketing"
    ],
    "PRODUCCION / SERVUCCION": [
        "Materia Prima", "Mano de Obra Directa", "Maquinaria y Equipo", "Mantenimiento", "Servicios Públicos (Planta)"
    ],
    "ADMINISTRATIVO": [
        "Nómina Administrativa", "Arriendo Oficina", "Papelería y Útiles", "Servicios Públicos (Admin)", "Equipos de Cómputo"
    ],
    "LEGAL": [
        "Cámara de Comercio", "Registro de Marca", "Licencias y Permisos", "Asesoría Legal", "Notaría"
    ],
    "AMBIENTAL": [
        "Estudios Impacto Ambiental", "Plan de Manejo de Residuos", "Capacitación Ambiental", "Mitigación", "Certificaciones"
    ],
    "OTROS GASTOS": [
        "Imprevistos (5%)", "Gastos Financieros", "Otros"
    ]
}

current_row = 1
category_totals = {}

for category, items in rubros.items():
    ws_data.merge_range(current_row, 0, current_row, 1, f"PRESUPUESTO {category}", header_fmt)
    current_row += 1
    ws_data.write(current_row, 0, "Concepto", header_fmt)
    ws_data.write(current_row, 1, "Valor Estimado (COP)", header_fmt)
    current_row += 1
    
    start_row = current_row
    for item in items:
        ws_data.write(current_row, 0, item, text_border_fmt)
        ws_data.write(current_row, 1, 0, currency_fmt) # Initialize with 0
        current_row += 1
    end_row = current_row
    
    # Total row for category
    ws_data.write(current_row, 0, f"TOTAL {category}", total_fmt)
    # Excel formula for Sum
    formula = f"=SUM(B{start_row+1}:B{end_row})"
    ws_data.write_formula(current_row, 1, formula, total_fmt)
    
    # Store cell reference for summary
    category_totals[category] = f"Presupuestos_Areas!B{current_row+1}"
    
    current_row += 2 # Spacing

# --- Sheet 3: Resumen_Grafico ---
ws_summary = workbook.add_worksheet("Resumen_Grafico")
ws_summary.set_column('A:A', 30)
ws_summary.set_column('B:B', 20)

ws_summary.merge_range('A1:B1', 'RESUMEN DEL PRESUPUESTO TOTAL', header_fmt)
ws_summary.write('A2', 'Rubro General', header_fmt)
ws_summary.write('B2', 'Total (COP)', header_fmt)

row_s = 2
for category, ref in category_totals.items():
    ws_summary.write(row_s, 0, category, text_border_fmt)
    ws_summary.write_formula(row_s, 1, f"={ref}", currency_fmt)
    row_s += 1

# Total Project
ws_summary.write(row_s, 0, "COSTO TOTAL DEL PROYECTO", total_fmt)
ws_summary.write_formula(row_s, 1, f"=SUM(B3:B{row_s})", total_fmt)

# Chart
chart = workbook.add_chart({'type': 'pie'})
chart.add_series({
    'name': 'Distribución del Presupuesto',
    'categories': ['Resumen_Grafico', 2, 0, row_s-1, 0],
    'values':     ['Resumen_Grafico', 2, 1, row_s-1, 1],
    'data_labels': {'value': True, 'percentage': True},
})
chart.set_title({'name': 'Participación por Rubros'})
chart.set_style(10)
ws_summary.insert_chart('D2', chart)

workbook.close()
print(f"Template created at: {output_path}")
