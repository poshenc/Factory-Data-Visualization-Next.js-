CREATE EXTENSION IF NOT EXISTS postgres_fdw;

CREATE SERVER ${FDW_SERVER_NAME}
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (host '${FDW_HOST}', dbname '${FDW_DBNAME}', port '${FDW_PORT}');

CREATE USER MAPPING FOR current_user SERVER ${FDW_SERVER_NAME}
OPTIONS (user '${FDW_USER}', password '${FDW_PASSWORD}');

--Replace with the actual situation.
--server, schema_name, table_name
create foreign table public.alog (
	sdate timestamp,
	edate timestamp,
	toolid varchar(32),
	moduleid varchar(32),
	alcd numeric,
	alid numeric,
	altx varchar(80)
)SERVER ${FDW_SERVER_NAME} OPTIONS (schema_name '${SCHEMA_NAME}', table_name 'alog');

--Replace with the actual situation.
--server, schema_name, table_name
create foreign table public.car (
    sdate timestamp,
    edate timestamp,
    toolid varchar,
    carrierid varchar,
    port varchar,
    usage numeric,
    material varchar
)SERVER ${FDW_SERVER_NAME} OPTIONS (schema_name '${SCHEMA_NAME}', table_name 'car');

--Replace with the actual situation.
--server, schema_name, table_name
create foreign table public.equevtlog (
    "time" timestamp,
	toolid varchar,
	moduleid varchar,
	"type" char,
	event varchar,
	"action" varchar,
	caller varchar,
	recipeid varchar,
	recipestepno numeric,
	acttime numeric,
	lotid varchar,
	carrierid varchar,
	slotno numeric,
	waferid varchar,
	message varchar
)SERVER ${FDW_SERVER_NAME} OPTIONS (schema_name '${SCHEMA_NAME}', table_name 'equevtlog');

--Replace with the actual situation.
--server, schema_name, table_name
create foreign table public.proccj (
	sdate timestamp,
	edate timestamp,
	toolid varchar(32),
	cjid varchar(80)
)SERVER ${FDW_SERVER_NAME} OPTIONS (schema_name '${SCHEMA_NAME}', table_name 'proccj');

--Replace with the actual situation.
--server, schema_name, table_name
create foreign table public.procmdl (
	sdate timestamp,
	edate timestamp,
	toolid varchar(32),
	moduleid varchar(32),
	recipeid varchar(80),
	cjid varchar(80),
	pjid varchar(80),
	lotid varchar(80),
	carrierid varchar(80),
	slotno numeric,
	waferid varchar(80)
) SERVER ${FDW_SERVER_NAME} OPTIONS (schema_name '${SCHEMA_NAME}', table_name 'procmdl');


--Replace with the actual situation.
--server, schema_name, table_name
create foreign table public.procpj (
	sdate timestamp,
	edate timestamp,
	toolid varchar(32),
	pjid varchar(80)
) SERVER ${FDW_SERVER_NAME} OPTIONS (schema_name '${SCHEMA_NAME}', table_name 'procpj');

--Replace with the actual situation.
--server, schema_name, table_name
create foreign table public.procwaf (
	sdate timestamp,
	edate timestamp,
	toolid varchar(32),
	recipeid varchar(80),
	cjid varchar(80),
	pjid varchar(80),
	lotid varchar(80),
	carrierid varchar(80),
	port varchar(32),
	slotno numeric,
	waferid varchar(80)
) SERVER ${FDW_SERVER_NAME} OPTIONS (schema_name '${SCHEMA_NAME}', table_name 'procwaf');

--Replace with the actual situation.
--server, schema_name, table_name
create foreign table public.tracelog (
	"time" timestamp,
	toolid varchar,
	moduleid varchar,
	pg_pressure numeric,
	ig_pressure numeric,
	gas1mfc_flow numeric,
	gas2mfc_flow numeric,
	gas3mfc_flow numeric,
	gas4mfc_flow numeric,
	gas1mfc_flow_set numeric,
	gas2mfc_flow_set numeric,
	gas1mfc_valve_control numeric,
	gas2mfc_valve_control numeric,
	gas3mfc_valve_control numeric,
	gas4mfc_valve_control numeric,
	gas3mfc_flow_set numeric,
	gas4mfc_flow_set numeric,
	dc1power numeric,
	dc1voltage numeric,
	dc1current numeric,
	dc2power numeric,
	dc2voltage numeric,
	dc2current numeric,
	dc3power numeric,
	dc3voltage numeric,
	dc3current numeric,
	rf1vdc numeric,
	rf1pff numeric,
	rf1pr numeric,
	rf1vpp numeric,
	rf1_c1_position numeric,
	rf1_c2_position numeric,
	rf2vdc numeric,
	rf2pf numeric,
	rf2pr numeric,
	rf2vpp numeric,
	rf2_c1_position numeric,
	rf2_c2_position numeric,
	assist_dg_press numeric,
	heater_voltage numeric,
	assist_gas_flow numeric,
	esc_impedance numeric,
	cathode_water_temp numeric,
	stage_water_flow numeric,
	heatertemp numeric,
	wafer1temp numeric,
	wafer2temp numeric,
	heater1current numeric,
	heater2current numeric,
	heater3current numeric,
	escvoltage numeric,
	esccurrent numeric,
	dg1_pressure numeric,
	dg2_pressure numeric,
	chamber_temp1 numeric,
	chamber_temp2 numeric,
	chamber_temp3 numeric,
	chamber_temp4 numeric,
	total1life numeric,
	total2life numeric,
	total3life numeric,
	shieldlife numeric,
	shutterlife numeric,
	trap_temp numeric,
	tmp_water_flow numeric,
	cathode_water_flow numeric,
	chamber_water_flow numeric,
	step_process_time numeric,
	process_time numeric,
	pressure numeric,
	esc_impedance_warning_status numeric,
	esc_impedance_error_status numeric,
	magnet_position numeric,
	active_pressure_gauge numeric,
	degas_status numeric,
	active_ion_gauge_filament numeric,
	assist_gas_control_warning_status numeric,
	assist_gas_control_error_status numeric,
	gauge_type numeric,
	drp_pg_pressure numeric,
	apr1_pressure numeric,
	arp2_pressure numeric,
	apr3_pressure numeric,
	apr4_pressure numeric,
	apr5_pressure numeric,
	rpc_pf numeric,
	rpc_pr numeric,
	rpc_resist numeric,
	rpc_vol numeric,
	rpc_freq numeric,
	rpc_ignition numeric,
	ir_arc_detection numeric,
	lifter_position_actual numeric,
	lifter_velocity_actual numeric,
	lifter_acceleration numeric,
	lifter_deceleration numeric,
	heater_temp2 numeric,
	corrected_temp_ao numeric,
	uncorrected_temp_ai numeric
) SERVER ${FDW_SERVER_NAME} OPTIONS (schema_name '${SCHEMA_NAME}', table_name 'tracelog');
