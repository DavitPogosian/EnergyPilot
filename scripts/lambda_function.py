
import json
import psycopg2
import psycopg2.extras

conn = None


"""
Ultra-Simple Battery Savings Calculator
Pure Python - Just copy and use!
"""

# ============================================================================
# SETTINGS - Change these if needed
# ============================================================================

BATTERY_SIZE = 10.0        # kWh
BATTERY_EFFICIENCY = 0.9   # 90%
MAX_POWER = 5.0            # kW (max charge/discharge rate)


# ============================================================================
# BATTERY CLASS - Handles charging and discharging
# ============================================================================

class Battery:
    def __init__(self):
        self.charge = BATTERY_SIZE / 2  # Start at 50%
    
    def add_energy(self, amount):
        """Charge battery. Returns how much was actually added."""
        space = BATTERY_SIZE - self.charge
        can_add = min(amount, space / BATTERY_EFFICIENCY, MAX_POWER * 0.25)
        self.charge += can_add * BATTERY_EFFICIENCY
        return can_add
    
    def take_energy(self, amount):
        """Discharge battery. Returns how much was actually taken."""
        available = self.charge * BATTERY_EFFICIENCY
        can_take = min(amount, available, MAX_POWER * 0.25)
        self.charge -= can_take / BATTERY_EFFICIENCY
        return can_take


# ============================================================================
# FUNCTION 1: NO BATTERY (Baseline)
# ============================================================================

def no_battery(data):
    """Calculate costs without battery"""
    total_cost = 0
    
    for row in data:
        consumption = row['consumption_kwh']
        solar = row['pv_production_kwh']
        price = row['price_eur_per_kwh']
        
        # Use solar first, then grid
        from_grid = max(0, consumption - solar)
        export = max(0, solar - consumption)
        
        # Cost = buy from grid - sell excess solar
        cost = (from_grid * price) - (export * price * 0.7)
        total_cost += cost
    
    return {'cost': round(total_cost, 2)}


# ============================================================================
# FUNCTION 2: SMARTSHIFT AI (Your custom intervals)
# ============================================================================

def smartshift(data, intervals):
    """Calculate costs with SmartShift strategy"""
    battery = Battery()
    total_cost = 0
    
    for row in data:
        time = row['time']
        consumption = row['consumption_kwh']
        solar = row['pv_production_kwh']
        price = row['price_eur_per_kwh']
        
        # Find what action to do at this time
        action = get_action(time, intervals)
        
        from_grid = 0
        to_grid = 0
        
        if action == 'charge_from_grid':
            # Charge battery from grid + use solar
            solar_used = min(solar, consumption)
            from_grid = consumption - solar_used
            from_grid += battery.add_energy(1.25)  # Try to charge
            to_grid = solar - solar_used
        
        elif action == 'self_consumption':
            # Use solar → battery → grid
            solar_used = min(solar, consumption)
            battery.add_energy(solar - solar_used)  # Store excess
            battery_used = battery.take_energy(consumption - solar_used)
            from_grid = consumption - solar_used - battery_used
        
        elif action == 'discharge_to_grid':
            # Sell battery to grid during peak
            solar_used = min(solar, consumption)
            from_grid = consumption - solar_used
            to_grid = battery.take_energy(1.25) + (solar - solar_used)
        
        else:  # idle
            solar_used = min(solar, consumption)
            from_grid = consumption - solar_used
            to_grid = solar - solar_used
        
        # Calculate cost
        cost = (from_grid * price) - (to_grid * price * 0.7)
        total_cost += cost
    
    return {'cost': round(total_cost, 2)}


# ============================================================================
# FUNCTION 3: ECO MODE (Pure green energy)
# ============================================================================

def eco_mode(data):
    """Calculate costs with ECO mode - never charge from grid"""
    battery = Battery()
    total_cost = 0
    
    for row in data:
        consumption = row['consumption_kwh']
        solar = row['pv_production_kwh']
        price = row['price_eur_per_kwh']
        
        # Use solar first
        solar_used = min(solar, consumption)
        
        # Store excess solar
        battery.add_energy(solar - solar_used)
        
        # Use battery for remaining consumption
        battery_used = battery.take_energy(consumption - solar_used)
        
        # Only use grid if really needed
        from_grid = consumption - solar_used - battery_used
        
        # Cost (no export in ECO mode unless battery full)
        cost = from_grid * price
        total_cost += cost
    
    return {'cost': round(total_cost, 2)}


# ============================================================================
# FUNCTION 4: PEAK SHAVING (Maximize grid sales)
# ============================================================================

def peak_shaving(data, intervals):
    """Calculate costs with peak shaving - sell during expensive hours"""
    battery = Battery()
    total_cost = 0
    
    for row in data:
        time = row['time']
        consumption = row['consumption_kwh']
        solar = row['pv_production_kwh']
        price = row['price_eur_per_kwh']
        
        action = get_action(time, intervals)
        
        if action == 'charge_from_grid':
            # Charge battery all day
            solar_used = min(solar, consumption)
            from_grid = consumption - solar_used
            from_grid += battery.add_energy(1.25)
            to_grid = 0
        
        elif action == 'discharge_to_grid':
            # Sell everything during peak
            solar_used = min(solar, consumption)
            from_grid = consumption - solar_used
            to_grid = battery.take_energy(1.25) + (solar - solar_used)
        
        else:  # idle
            solar_used = min(solar, consumption)
            from_grid = consumption - solar_used
            to_grid = solar - solar_used
        
        cost = (from_grid * price) - (to_grid * price * 0.7)
        total_cost += cost
    
    return {'cost': round(total_cost, 2)}


# ============================================================================
# HELPER FUNCTION
# ============================================================================

def get_action(time_str, intervals):
    """Find what to do at this time"""
    h, m = map(int, time_str.split(':'))
    now = h * 60 + m
    
    for interval in intervals:
        sh, sm = map(int, interval['start'].split(':'))
        eh, em = map(int, interval['end'].split(':'))
        start = sh * 60 + sm
        end = eh * 60 + em
        
        if start <= now < end:
            return interval['action']
    
    return 'idle'


# ============================================================================
# MAIN FUNCTION - Calculate savings for selected strategy
# ============================================================================

def calculate(data, intervals, strategy='smartshift'):
    """
    Calculate savings for a specific strategy
    
    Args:
        data: List of dicts with keys: time, consumption_kwh, pv_production_kwh, price_eur_per_kwh
        intervals: List of dicts with keys: start, end, action
        strategy: 'smartshift', 'eco', or 'peak'
    
    Returns:
        Float: Savings in EUR (positive = saves money, negative = costs more)
    """
    
    # Calculate baseline
    baseline = no_battery(data)
    
    # Calculate selected strategy
    if strategy == 'smartshift':
        result = smartshift(data, intervals)
    elif strategy == 'eco':
        result = eco_mode(data)
    elif strategy == 'peak':
        result = peak_shaving(data, intervals)
    else:
        raise ValueError(f"Unknown strategy: {strategy}. Use 'smartshift', 'eco', or 'peak'")
    
    # Return savings
    savings = round(baseline['cost'] - result['cost'], 2)
    return savings



def get_connection():
	global conn
	if conn is None or conn.closed != 0:
		conn = psycopg2.connect(
				host="backend-infrastructure-db.cz6auaoq0bmo.us-west-2.rds.amazonaws.com",
	database="postgres",
	user="",
	password=""  # sorry couldn't make the la
)
	return conn

def respond(err, res=None):
	return {
		'statusCode': '400' if err else '200',
		'body': str(err) if err else json.dumps(res, default=str),
		'headers': {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET'
		},
	}


def lambda_handler(event, context):
	path = event.get("path")
	
	try:
		conn = get_connection()
		cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
		cur.execute("SELECT * FROM load_profile;")
		load_profile_res = cur.fetchall()

		cur.execute("SELECT * FROM prices;")
		prices_res = cur.fetchall()

		load_profile = [float(x["load_profile"]) for x in load_profile_res]
		prices = [float(x["price"]) for x in prices_res]
		min_length = 96
		value = sum(prices[i] * load_profile[i] / 1000 for i in range(min_length))

		if path == "/load_profile":
			return respond(None, load_profile_res)
		elif path == "/strategy_evaluation":
			return respond(None, {  "estimatedCost": value, "gridExportIncome": value * 30, "co2Avoided": 8.5, "batterySoc": 45, "evSoc": 65, "userPercentile": 85,})
		elif path == "/insights":
			raw_body = event.get("body")
			body = {}

			if isinstance(raw_body, str):
				try:
					body = json.loads(raw_body)
				except Exception as e:
					print("JSON decode error:", e)
					body = {}
			elif isinstance(raw_body, dict):
				body = raw_body

			intervals = body.get("intervals", [])
			devices = body.get("devices", [])

			times = []

			for h in range(24):           # 0 → 23
				for m in [0, 15, 30, 45]: # quarter hours
					times.append(f"{h:02d}:{m:02d}")

			entry_data =  [{"time": times[i], "consumption_kwh": load_profile[i], "pv_production_kwh": 3 * i * (96 - i) / 100000, "price_eur_per_kwh": prices[i] } for i in range(96)]
			x = calculate(data=entry_data, intervals=intervals)
			if len(intervals) == 1:
				estimated_savings = 1
			else:
				estimated_savings = 1.5
			return respond(None, {"estimatedSavings": x / 1000, "energyUsed": 10, "CO2Avoided": 5})
		return respond(None, [])


	except Exception as e:
		return respond(e, {"event": event})