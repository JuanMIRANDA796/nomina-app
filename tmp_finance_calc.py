import numpy as np
import numpy_financial as npf

def calculate_scenario(name, price_emp, price_emesa_base, price_emesa_emp, avg_emps):
    # Projections (Total paying clients at end of year)
    # Let's assume a realistic growth path over 3 years for a SaaS
    # Y1: 30 Emprendedor, 20 Empresarial
    # Y2: 120 Emprendedor, 80 Empresarial
    # Y3: 300 Emprendedor, 200 Empresarial
    
    clients_emp = [30, 120, 300]
    clients_emesa = [20, 80, 200]
    
    # Calculate revenue
    # Assuming average clients per year is half of year-end + previous year end
    # For simplicity, let's just use the year-end clients but assume they are acquired linearly
    # So average active clients in year = (start + end)/2
    clients_emp_avg = [15, 75, 210]
    clients_emesa_avg = [10, 50, 140]

    rev_emp = price_emp * 12
    rev_emesa = (price_emesa_base + price_emesa_emp * avg_emps) * 12
    
    revenues = [
        clients_emp_avg[0]*rev_emp + clients_emesa_avg[0]*rev_emesa,
        clients_emp_avg[1]*rev_emp + clients_emesa_avg[1]*rev_emesa,
        clients_emp_avg[2]*rev_emp + clients_emesa_avg[2]*rev_emesa
    ]
    
    # Costs
    # Variable cloud costs scale with users + Fixed Costs
    # Fixed infra: Supabase Pro + Vercel Pro = 250,000 COP/mo = 3 M COP/yr
    # Marketing and sales costs, Support costs
    cogs = [3000000, 6000000, 12000000] # Infra, Domain, Email APIs
    opex = [15000000, 35000000, 75000000] # Marketing, Sales, part-time support
    
    ebitdas = [revenues[i] - cogs[i] - opex[i] for i in range(3)]
    
    # Taxes (assumed 35% in Colombia)
    taxes = [max(0, ebitda * 0.35) for ebitda in ebitdas]
    fcf = [ebitdas[i] - taxes[i] for i in range(3)] # Simplified FCF = EBITDA - Taxes (Ignoring working cap, depreciation)
    
    # Initial Investment (Bootstrapping, development time value, initial marketing)
    inv0 = -25000000 # 25M COP initial investment (your time, legal setup, initial ads)
    
    cash_flows = [inv0] + fcf
    
    discount_rate = 0.15 # 15% discount rate (WACC approx for a startup)
    
    npv = npf.npv(discount_rate, cash_flows)
    irr = npf.irr(cash_flows)
    
    print(f"--- Escenario: {name} ---")
    print(f"Precios Mensuales: Emprendedor ${price_emp:,.0f}, Empresarial Base ${price_emesa_base:,.0f}, Empleado ${price_emesa_emp:,.0f}")
    print(f"Ingresos Y1: ${revenues[0]:,.0f} | Y2: ${revenues[1]:,.0f} | Y3: ${revenues[2]:,.0f}")
    print(f"EBITDA Y1: ${ebitdas[0]:,.0f} | Y2: ${ebitdas[1]:,.0f} | Y3: ${ebitdas[2]:,.0f}")
    print(f"VPN (15%): ${npv:,.0f}")
    print(f"TIR: {(irr*100) if not np.isnan(irr) else 'N/A':.1f}%")
    print()

print("Bases: Promedio 20 empleados por cliente Empresarial.")
calculate_scenario("Agresivo (Costos Bajos para penetración rápida)", 35000, 50000, 5000, 20)
calculate_scenario("Balanceado (El Propuesto)", 45000, 70000, 6000, 20)
calculate_scenario("Premium (Alta rentabilidad)", 59000, 80000, 8000, 20)
