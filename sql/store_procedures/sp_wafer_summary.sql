-- DROP PROCEDURE public.sp_wafer_summary(timestamp, timestamp, int4);

CREATE OR REPLACE PROCEDURE public.sp_wafer_summary(IN param_sdate timestamp without time zone, IN param_edate timestamp without time zone, IN param_step_no integer DEFAULT 6)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
begin
	truncate table wafer_summary_dsa;
	insert into wafer_summary_dsa
	select 
		 mdl.toolid
		,mdl.moduleid
		,mdl.recipeid
		,evt.lotid
		,evt.carrierid
		,evt.slotno
		,evt.waferid
		,evt.recipestepno
		,min("time") + interval'3s' as proc_sdate
		,max("time") - interval'2s' as proc_edate
	from procmdl mdl
	left join(
		select "time", toolid, moduleid, recipestepno, lotid, carrierid, slotno, waferid
		from equevtlog evt
		where '' not in (recipeid, lotid, carrierid, slotno::varchar, waferid)
		and "action" in ('R-STEP START', 'R-STEP END')
		and evt.recipestepno = param_step_no
	) evt
		on mdl.toolid = evt.toolid
		and mdl.moduleid = evt.moduleid 
		and mdl.lotid = evt.lotid
		and mdl.carrierid = evt.carrierid
		and mdl.slotno = evt.slotno
		and mdl.waferid = evt.waferid
	where mdl.sdate between param_sdate and param_edate
	and mdl.moduleid ~ 'F[0-9]-[0-9]'
	group by mdl.toolid, mdl.moduleid, mdl.recipeid, evt.lotid, evt.carrierid, evt.slotno, evt.waferid, evt.recipestepno;

	delete from wafer_summary
	where time between param_sdate and param_edate; 

	insert into wafer_summary(
		"time"
		,toolid
		,moduleid
		,recipeid
		,lotid
		,carrierid
		,slotno
		,waferid
		,recipestepno
		,pg_pressure_max
		,ig_pressure_max
		,gas1mfc_flow_max
		,gas2mfc_flow_max
		,gas3mfc_flow_max
		,gas4mfc_flow_max
		,gas1mfc_flow_set_max
		,gas2mfc_flow_set_max
		,gas1mfc_valve_control_max
		,gas2mfc_valve_control_max
		,gas3mfc_valve_control_max
		,gas4mfc_valve_control_max
		,gas3mfc_flow_set_max
		,gas4mfc_flow_set_max
		,dc1power_max
		,dc1voltage_max
		,dc1current_max
		,dc2power_max
		,dc2voltage_max
		,dc2current_max
		,dc3power_max
		,dc3voltage_max
		,dc3current_max
		,rf1vdc_max
		,rf1pff_max
		,rf1pr_max
		,rf1vpp_max
		,rf1_c1_position_max
		,rf1_c2_position_max
		,rf2vdc_max
		,rf2pf_max
		,rf2pr_max
		,rf2vpp_max
		,rf2_c1_position_max
		,rf2_c2_position_max
		,assist_dg_press_max
		,heater_voltage_max
		,assist_gas_flow_max
		,esc_impedance_max
		,cathode_water_temp_max
		,stage_water_flow_max
		,heatertemp_max
		,wafer1temp_max
		,wafer2temp_max
		,heater1current_max
		,heater2current_max
		,heater3current_max
		,escvoltage_max
		,esccurrent_max
		,dg1_pressure_max
		,dg2_pressure_max
		,chamber_temp1_max
		,chamber_temp2_max
		,chamber_temp3_max
		,chamber_temp4_max
		,total1life_max
		,total2life_max
		,total3life_max
		,shieldlife_max
		,shutterlife_max
		,trap_temp_max
		,tmp_water_flow_max
		,cathode_water_flow_max
		,chamber_water_flow_max
		,step_process_time_max
		,process_time_max
		,pressure_max
		,esc_impedance_warning_status_max
		,esc_impedance_error_status_max
		,magnet_position_max
		,active_pressure_gauge_max
		,degas_status_max
		,active_ion_gauge_filament_max
		,assist_gas_control_warning_status_max
		,assist_gas_control_error_status_max
		,gauge_type_max
		,drp_pg_pressure_max
		,apr1_pressure_max
		,arp2_pressure_max
		,apr3_pressure_max
		,apr4_pressure_max
		,apr5_pressure_max
		,rpc_pf_max
		,rpc_pr_max
		,rpc_resist_max
		,rpc_vol_max
		,rpc_freq_max
		,rpc_ignition_max
		,ir_arc_detection_max
		,lifter_position_actual_max
		,lifter_velocity_actual_max
		,lifter_acceleration_max
		,lifter_deceleration_max
		,heater_temp2_max
		,corrected_temp_ao_max
		,uncorrected_temp_ai_max
		,pg_pressure_min
		,ig_pressure_min
		,gas1mfc_flow_min
		,gas2mfc_flow_min
		,gas3mfc_flow_min
		,gas4mfc_flow_min
		,gas1mfc_flow_set_min
		,gas2mfc_flow_set_min
		,gas1mfc_valve_control_min
		,gas2mfc_valve_control_min
		,gas3mfc_valve_control_min
		,gas4mfc_valve_control_min
		,gas3mfc_flow_set_min
		,gas4mfc_flow_set_min
		,dc1power_min
		,dc1voltage_min
		,dc1current_min
		,dc2power_min
		,dc2voltage_min
		,dc2current_min
		,dc3power_min
		,dc3voltage_min
		,dc3current_min
		,rf1vdc_min
		,rf1pff_min
		,rf1pr_min
		,rf1vpp_min
		,rf1_c1_position_min
		,rf1_c2_position_min
		,rf2vdc_min
		,rf2pf_min
		,rf2pr_min
		,rf2vpp_min
		,rf2_c1_position_min
		,rf2_c2_position_min
		,assist_dg_press_min
		,heater_voltage_min
		,assist_gas_flow_min
		,esc_impedance_min
		,cathode_water_temp_min
		,stage_water_flow_min
		,heatertemp_min
		,wafer1temp_min
		,wafer2temp_min
		,heater1current_min
		,heater2current_min
		,heater3current_min
		,escvoltage_min
		,esccurrent_min
		,dg1_pressure_min
		,dg2_pressure_min
		,chamber_temp1_min
		,chamber_temp2_min
		,chamber_temp3_min
		,chamber_temp4_min
		,total1life_min
		,total2life_min
		,total3life_min
		,shieldlife_min
		,shutterlife_min
		,trap_temp_min
		,tmp_water_flow_min
		,cathode_water_flow_min
		,chamber_water_flow_min
		,step_process_time_min
		,process_time_min
		,pressure_min
		,esc_impedance_warning_status_min
		,esc_impedance_error_status_min
		,magnet_position_min
		,active_pressure_gauge_min
		,degas_status_min
		,active_ion_gauge_filament_min
		,assist_gas_control_warning_status_min
		,assist_gas_control_error_status_min
		,gauge_type_min
		,drp_pg_pressure_min
		,apr1_pressure_min
		,arp2_pressure_min
		,apr3_pressure_min
		,apr4_pressure_min
		,apr5_pressure_min
		,rpc_pf_min
		,rpc_pr_min
		,rpc_resist_min
		,rpc_vol_min
		,rpc_freq_min
		,rpc_ignition_min
		,ir_arc_detection_min
		,lifter_position_actual_min
		,lifter_velocity_actual_min
		,lifter_acceleration_min
		,lifter_deceleration_min
		,heater_temp2_min
		,corrected_temp_ao_min
		,uncorrected_temp_ai_min
		,pg_pressure_avg
		,ig_pressure_avg
		,gas1mfc_flow_avg
		,gas2mfc_flow_avg
		,gas3mfc_flow_avg
		,gas4mfc_flow_avg
		,gas1mfc_flow_set_avg
		,gas2mfc_flow_set_avg
		,gas1mfc_valve_control_avg
		,gas2mfc_valve_control_avg
		,gas3mfc_valve_control_avg
		,gas4mfc_valve_control_avg
		,gas3mfc_flow_set_avg
		,gas4mfc_flow_set_avg
		,dc1power_avg
		,dc1voltage_avg
		,dc1current_avg
		,dc2power_avg
		,dc2voltage_avg
		,dc2current_avg
		,dc3power_avg
		,dc3voltage_avg
		,dc3current_avg
		,rf1vdc_avg
		,rf1pff_avg
		,rf1pr_avg
		,rf1vpp_avg
		,rf1_c1_position_avg
		,rf1_c2_position_avg
		,rf2vdc_avg
		,rf2pf_avg
		,rf2pr_avg
		,rf2vpp_avg
		,rf2_c1_position_avg
		,rf2_c2_position_avg
		,assist_dg_press_avg
		,heater_voltage_avg
		,assist_gas_flow_avg
		,esc_impedance_avg
		,cathode_water_temp_avg
		,stage_water_flow_avg
		,heatertemp_avg
		,wafer1temp_avg
		,wafer2temp_avg
		,heater1current_avg
		,heater2current_avg
		,heater3current_avg
		,escvoltage_avg
		,esccurrent_avg
		,dg1_pressure_avg
		,dg2_pressure_avg
		,chamber_temp1_avg
		,chamber_temp2_avg
		,chamber_temp3_avg
		,chamber_temp4_avg
		,total1life_avg
		,total2life_avg
		,total3life_avg
		,shieldlife_avg
		,shutterlife_avg
		,trap_temp_avg
		,tmp_water_flow_avg
		,cathode_water_flow_avg
		,chamber_water_flow_avg
		,step_process_time_avg
		,process_time_avg
		,pressure_avg
		,esc_impedance_warning_status_avg
		,esc_impedance_error_status_avg
		,magnet_position_avg
		,active_pressure_gauge_avg
		,degas_status_avg
		,active_ion_gauge_filament_avg
		,assist_gas_control_warning_status_avg
		,assist_gas_control_error_status_avg
		,gauge_type_avg
		,drp_pg_pressure_avg
		,apr1_pressure_avg
		,arp2_pressure_avg
		,apr3_pressure_avg
		,apr4_pressure_avg
		,apr5_pressure_avg
		,rpc_pf_avg
		,rpc_pr_avg
		,rpc_resist_avg
		,rpc_vol_avg
		,rpc_freq_avg
		,rpc_ignition_avg
		,ir_arc_detection_avg
		,lifter_position_actual_avg
		,lifter_velocity_actual_avg
		,lifter_acceleration_avg
		,lifter_deceleration_avg
		,heater_temp2_avg
		,corrected_temp_ao_avg
		,uncorrected_temp_ai_avg
		,pg_pressure_range
		,ig_pressure_range
		,gas1mfc_flow_range
		,gas2mfc_flow_range
		,gas3mfc_flow_range
		,gas4mfc_flow_range
		,gas1mfc_flow_set_range
		,gas2mfc_flow_set_range
		,gas1mfc_valve_control_range
		,gas2mfc_valve_control_range
		,gas3mfc_valve_control_range
		,gas4mfc_valve_control_range
		,gas3mfc_flow_set_range
		,gas4mfc_flow_set_range
		,dc1power_range
		,dc1voltage_range
		,dc1current_range
		,dc2power_range
		,dc2voltage_range
		,dc2current_range
		,dc3power_range
		,dc3voltage_range
		,dc3current_range
		,rf1vdc_range
		,rf1pff_range
		,rf1pr_range
		,rf1vpp_range
		,rf1_c1_position_range
		,rf1_c2_position_range
		,rf2vdc_range
		,rf2pf_range
		,rf2pr_range
		,rf2vpp_range
		,rf2_c1_position_range
		,rf2_c2_position_range
		,assist_dg_press_range
		,heater_voltage_range
		,assist_gas_flow_range
		,esc_impedance_range
		,cathode_water_temp_range
		,stage_water_flow_range
		,heatertemp_range
		,wafer1temp_range
		,wafer2temp_range
		,heater1current_range
		,heater2current_range
		,heater3current_range
		,escvoltage_range
		,esccurrent_range
		,dg1_pressure_range
		,dg2_pressure_range
		,chamber_temp1_range
		,chamber_temp2_range
		,chamber_temp3_range
		,chamber_temp4_range
		,total1life_range
		,total2life_range
		,total3life_range
		,shieldlife_range
		,shutterlife_range
		,trap_temp_range
		,tmp_water_flow_range
		,cathode_water_flow_range
		,chamber_water_flow_range
		,step_process_time_range
		,process_time_range
		,pressure_range
		,esc_impedance_warning_status_range
		,esc_impedance_error_status_range
		,magnet_position_range
		,active_pressure_gauge_range
		,degas_status_range
		,active_ion_gauge_filament_range
		,assist_gas_control_warning_status_range
		,assist_gas_control_error_status_range
		,gauge_type_range
		,drp_pg_pressure_range
		,apr1_pressure_range
		,arp2_pressure_range
		,apr3_pressure_range
		,apr4_pressure_range
		,apr5_pressure_range
		,rpc_pf_range
		,rpc_pr_range
		,rpc_resist_range
		,rpc_vol_range
		,rpc_freq_range
		,rpc_ignition_range
		,ir_arc_detection_range
		,lifter_position_actual_range
		,lifter_velocity_actual_range
		,lifter_acceleration_range
		,lifter_deceleration_range
		,heater_temp2_range
		,corrected_temp_ao_range
		,uncorrected_temp_ai_range
	)
	select  
		min(time) as time
	    ,mdl.toolid
	    ,mdl.moduleid
	    ,mdl.recipeid
	    ,mdl.lotid
	    ,mdl.carrierid
	    ,mdl.slotno
	    ,mdl.waferid
	    ,mdl.recipestepno
	    ,max(pg_pressure) as pg_pressure_max
	    ,max(ig_pressure) as ig_pressure_max
	    ,max(gas1mfc_flow) as gas1mfc_flow_max
	    ,max(gas2mfc_flow) as gas2mfc_flow_max
	    ,max(gas3mfc_flow) as gas3mfc_flow_max
	    ,max(gas4mfc_flow) as gas4mfc_flow_max
	    ,max(gas1mfc_flow_set) as gas1mfc_flow_set_max
	    ,max(gas2mfc_flow_set) as gas2mfc_flow_set_max
	    ,max(gas1mfc_valve_control) as gas1mfc_valve_control_max
	    ,max(gas2mfc_valve_control) as gas2mfc_valve_control_max
	    ,max(gas3mfc_valve_control) as gas3mfc_valve_control_max
	    ,max(gas4mfc_valve_control) as gas4mfc_valve_control_max
	    ,max(gas3mfc_flow_set) as gas3mfc_flow_set_max
	    ,max(gas4mfc_flow_set) as gas4mfc_flow_set_max
	    ,max(dc1power) as dc1power_max
	    ,max(dc1voltage) as dc1voltage_max
	    ,max(dc1current) as dc1current_max
	    ,max(dc2power) as dc2power_max
	    ,max(dc2voltage) as dc2voltage_max
	    ,max(dc2current) as dc2current_max
	    ,max(dc3power) as dc3power_max
	    ,max(dc3voltage) as dc3voltage_max
	    ,max(dc3current) as dc3current_max
	    ,max(rf1vdc) as rf1vdc_max
	    ,max(rf1pff) as rf1pff_max
	    ,max(rf1pr) as rf1pr_max
	    ,max(rf1vpp) as rf1vpp_max
	    ,max(rf1_c1_position) as rf1_c1_position_max
	    ,max(rf1_c2_position) as rf1_c2_position_max
	    ,max(rf2vdc) as rf2vdc_max
	    ,max(rf2pf) as rf2pf_max
	    ,max(rf2pr) as rf2pr_max
	    ,max(rf2vpp) as rf2vpp_max
	    ,max(rf2_c1_position) as rf2_c1_position_max
	    ,max(rf2_c2_position) as rf2_c2_position_max
	    ,max(assist_dg_press) as assist_dg_press_max
	    ,max(heater_voltage) as heater_voltage_max
	    ,max(assist_gas_flow) as assist_gas_flow_max
	    ,max(esc_impedance) as esc_impedance_max
	    ,max(cathode_water_temp) as cathode_water_temp_max
	    ,max(stage_water_flow) as stage_water_flow_max
	    ,max(heatertemp) as heatertemp_max
	    ,max(wafer1temp) as wafer1temp_max
	    ,max(wafer2temp) as wafer2temp_max
	    ,max(heater1current) as heater1current_max
	    ,max(heater2current) as heater2current_max
	    ,max(heater3current) as heater3current_max
	    ,max(escvoltage) as escvoltage_max
	    ,max(esccurrent) as esccurrent_max
	    ,max(dg1_pressure) as dg1_pressure_max
	    ,max(dg2_pressure) as dg2_pressure_max
	    ,max(chamber_temp1) as chamber_temp1_max
	    ,max(chamber_temp2) as chamber_temp2_max
	    ,max(chamber_temp3) as chamber_temp3_max
	    ,max(chamber_temp4) as chamber_temp4_max
	    ,max(total1life) as total1life_max
	    ,max(total2life) as total2life_max
	    ,max(total3life) as total3life_max
	    ,max(shieldlife) as shieldlife_max
	    ,max(shutterlife) as shutterlife_max
	    ,max(trap_temp) as trap_temp_max
	    ,max(tmp_water_flow) as tmp_water_flow_max
	    ,max(cathode_water_flow) as cathode_water_flow_max
	    ,max(chamber_water_flow) as chamber_water_flow_max
	    ,max(step_process_time) as step_process_time_max
	    ,max(process_time) as process_time_max
	    ,max(pressure) as pressure_max
	    ,max(esc_impedance_warning_status) as esc_impedance_warning_status_max
	    ,max(esc_impedance_error_status) as esc_impedance_error_status_max
	    ,max(magnet_position) as magnet_position_max
	    ,max(active_pressure_gauge) as active_pressure_gauge_max
	    ,max(degas_status) as degas_status_max
	    ,max(active_ion_gauge_filament) as active_ion_gauge_filament_max
	    ,max(assist_gas_control_warning_status) as assist_gas_control_warning_status_max
	    ,max(assist_gas_control_error_status) as assist_gas_control_error_status_max
	    ,max(gauge_type) as gauge_type_max
	    ,max(drp_pg_pressure) as drp_pg_pressure_max
	    ,max(apr1_pressure) as apr1_pressure_max
	    ,max(arp2_pressure) as arp2_pressure_max
	    ,max(apr3_pressure) as apr3_pressure_max
	    ,max(apr4_pressure) as apr4_pressure_max
	    ,max(apr5_pressure) as apr5_pressure_max
	    ,max(rpc_pf) as rpc_pf_max
	    ,max(rpc_pr) as rpc_pr_max
	    ,max(rpc_resist) as rpc_resist_max
	    ,max(rpc_vol) as rpc_vol_max
	    ,max(rpc_freq) as rpc_freq_max
	    ,max(rpc_ignition) as rpc_ignition_max
	    ,max(ir_arc_detection) as ir_arc_detection_max
	    ,max(lifter_position_actual) as lifter_position_actual_max
	    ,max(lifter_velocity_actual) as lifter_velocity_actual_max
	    ,max(lifter_acceleration) as lifter_acceleration_max
	    ,max(lifter_deceleration) as lifter_deceleration_max
	    ,max(heater_temp2) as heater_temp2_max
	    ,max(corrected_temp_ao) as corrected_temp_ao_max
	    ,max(uncorrected_temp_ai) as uncorrected_temp_ai_max
	    ,min(pg_pressure) as pg_pressure_min
	    ,min(ig_pressure) as ig_pressure_min
	    ,min(gas1mfc_flow) as gas1mfc_flow_min
	    ,min(gas2mfc_flow) as gas2mfc_flow_min
	    ,min(gas3mfc_flow) as gas3mfc_flow_min
	    ,min(gas4mfc_flow) as gas4mfc_flow_min
	    ,min(gas1mfc_flow_set) as gas1mfc_flow_set_min
	    ,min(gas2mfc_flow_set) as gas2mfc_flow_set_min
	    ,min(gas1mfc_valve_control) as gas1mfc_valve_control_min
	    ,min(gas2mfc_valve_control) as gas2mfc_valve_control_min
	    ,min(gas3mfc_valve_control) as gas3mfc_valve_control_min
	    ,min(gas4mfc_valve_control) as gas4mfc_valve_control_min
	    ,min(gas3mfc_flow_set) as gas3mfc_flow_set_min
	    ,min(gas4mfc_flow_set) as gas4mfc_flow_set_min
	    ,min(dc1power) as dc1power_min
	    ,min(dc1voltage) as dc1voltage_min
	    ,min(dc1current) as dc1current_min
	    ,min(dc2power) as dc2power_min
	    ,min(dc2voltage) as dc2voltage_min
	    ,min(dc2current) as dc2current_min
	    ,min(dc3power) as dc3power_min
	    ,min(dc3voltage) as dc3voltage_min
	    ,min(dc3current) as dc3current_min
	    ,min(rf1vdc) as rf1vdc_min
	    ,min(rf1pff) as rf1pff_min
	    ,min(rf1pr) as rf1pr_min
	    ,min(rf1vpp) as rf1vpp_min
	    ,min(rf1_c1_position) as rf1_c1_position_min
	    ,min(rf1_c2_position) as rf1_c2_position_min
	    ,min(rf2vdc) as rf2vdc_min
	    ,min(rf2pf) as rf2pf_min
	    ,min(rf2pr) as rf2pr_min
	    ,min(rf2vpp) as rf2vpp_min
	    ,min(rf2_c1_position) as rf2_c1_position_min
	    ,min(rf2_c2_position) as rf2_c2_position_min
	    ,min(assist_dg_press) as assist_dg_press_min
	    ,min(heater_voltage) as heater_voltage_min
	    ,min(assist_gas_flow) as assist_gas_flow_min
	    ,min(esc_impedance) as esc_impedance_min
	    ,min(cathode_water_temp) as cathode_water_temp_min
	    ,min(stage_water_flow) as stage_water_flow_min
	    ,min(heatertemp) as heatertemp_min
	    ,min(wafer1temp) as wafer1temp_min
	    ,min(wafer2temp) as wafer2temp_min
	    ,min(heater1current) as heater1current_min
	    ,min(heater2current) as heater2current_min
	    ,min(heater3current) as heater3current_min
	    ,min(escvoltage) as escvoltage_min
	    ,min(esccurrent) as esccurrent_min
	    ,min(dg1_pressure) as dg1_pressure_min
	    ,min(dg2_pressure) as dg2_pressure_min
	    ,min(chamber_temp1) as chamber_temp1_min
	    ,min(chamber_temp2) as chamber_temp2_min
	    ,min(chamber_temp3) as chamber_temp3_min
	    ,min(chamber_temp4) as chamber_temp4_min
	    ,min(total1life) as total1life_min
	    ,min(total2life) as total2life_min
	    ,min(total3life) as total3life_min
	    ,min(shieldlife) as shieldlife_min
	    ,min(shutterlife) as shutterlife_min
	    ,min(trap_temp) as trap_temp_min
	    ,min(tmp_water_flow) as tmp_water_flow_min
	    ,min(cathode_water_flow) as cathode_water_flow_min
	    ,min(chamber_water_flow) as chamber_water_flow_min
	    ,min(step_process_time) as step_process_time_min
	    ,min(process_time) as process_time_min
	    ,min(pressure) as pressure_min
	    ,min(esc_impedance_warning_status) as esc_impedance_warning_status_min
	    ,min(esc_impedance_error_status) as esc_impedance_error_status_min
	    ,min(magnet_position) as magnet_position_min
	    ,min(active_pressure_gauge) as active_pressure_gauge_min
	    ,min(degas_status) as degas_status_min
	    ,min(active_ion_gauge_filament) as active_ion_gauge_filament_min
	    ,min(assist_gas_control_warning_status) as assist_gas_control_warning_status_min
	    ,min(assist_gas_control_error_status) as assist_gas_control_error_status_min
	    ,min(gauge_type) as gauge_type_min
	    ,min(drp_pg_pressure) as drp_pg_pressure_min
	    ,min(apr1_pressure) as apr1_pressure_min
	    ,min(arp2_pressure) as arp2_pressure_min
	    ,min(apr3_pressure) as apr3_pressure_min
	    ,min(apr4_pressure) as apr4_pressure_min
	    ,min(apr5_pressure) as apr5_pressure_min
	    ,min(rpc_pf) as rpc_pf_min
	    ,min(rpc_pr) as rpc_pr_min
	    ,min(rpc_resist) as rpc_resist_min
	    ,min(rpc_vol) as rpc_vol_min
	    ,min(rpc_freq) as rpc_freq_min
	    ,min(rpc_ignition) as rpc_ignition_min
	    ,min(ir_arc_detection) as ir_arc_detection_min
	    ,min(lifter_position_actual) as lifter_position_actual_min
	    ,min(lifter_velocity_actual) as lifter_velocity_actual_min
	    ,min(lifter_acceleration) as lifter_acceleration_min
	    ,min(lifter_deceleration) as lifter_deceleration_min
	    ,min(heater_temp2) as heater_temp2_min
	    ,min(corrected_temp_ao) as corrected_temp_ao_min
	    ,min(uncorrected_temp_ai) as uncorrected_temp_ai_min
	    ,round(avg(pg_pressure)::numeric ,3) as pg_pressure_avg
	    ,round(avg(ig_pressure)::numeric ,3) as ig_pressure_avg
	    ,round(avg(gas1mfc_flow)::numeric ,3) as gas1mfc_flow_avg
	    ,round(avg(gas2mfc_flow)::numeric ,3) as gas2mfc_flow_avg
	    ,round(avg(gas3mfc_flow)::numeric ,3) as gas3mfc_flow_avg
	    ,round(avg(gas4mfc_flow)::numeric ,3) as gas4mfc_flow_avg
	    ,round(avg(gas1mfc_flow_set)::numeric ,3) as gas1mfc_flow_set_avg
	    ,round(avg(gas2mfc_flow_set)::numeric ,3) as gas2mfc_flow_set_avg
	    ,round(avg(gas1mfc_valve_control)::numeric ,3) as gas1mfc_valve_control_avg
	    ,round(avg(gas2mfc_valve_control)::numeric ,3) as gas2mfc_valve_control_avg
	    ,round(avg(gas3mfc_valve_control)::numeric ,3) as gas3mfc_valve_control_avg
	    ,round(avg(gas4mfc_valve_control)::numeric ,3) as gas4mfc_valve_control_avg
	    ,round(avg(gas3mfc_flow_set)::numeric ,3) as gas3mfc_flow_set_avg
	    ,round(avg(gas4mfc_flow_set)::numeric ,3) as gas4mfc_flow_set_avg
	    ,round(avg(dc1power)::numeric ,3) as dc1power_avg
	    ,round(avg(dc1voltage)::numeric ,3) as dc1voltage_avg
	    ,round(avg(dc1current)::numeric ,3) as dc1current_avg
	    ,round(avg(dc2power)::numeric ,3) as dc2power_avg
	    ,round(avg(dc2voltage)::numeric ,3) as dc2voltage_avg
	    ,round(avg(dc2current)::numeric ,3) as dc2current_avg
	    ,round(avg(dc3power)::numeric ,3) as dc3power_avg
	    ,round(avg(dc3voltage)::numeric ,3) as dc3voltage_avg
	    ,round(avg(dc3current)::numeric ,3) as dc3current_avg
	    ,round(avg(rf1vdc)::numeric ,3) as rf1vdc_avg
	    ,round(avg(rf1pff)::numeric ,3) as rf1pff_avg
	    ,round(avg(rf1pr)::numeric ,3) as rf1pr_avg
	    ,round(avg(rf1vpp)::numeric ,3) as rf1vpp_avg
	    ,round(avg(rf1_c1_position)::numeric ,3) as rf1_c1_position_avg
	    ,round(avg(rf1_c2_position)::numeric ,3) as rf1_c2_position_avg
	    ,round(avg(rf2vdc)::numeric ,3) as rf2vdc_avg
	    ,round(avg(rf2pf)::numeric ,3) as rf2pf_avg
	    ,round(avg(rf2pr)::numeric ,3) as rf2pr_avg
	    ,round(avg(rf2vpp)::numeric ,3) as rf2vpp_avg
	    ,round(avg(rf2_c1_position)::numeric ,3) as rf2_c1_position_avg
	    ,round(avg(rf2_c2_position)::numeric ,3) as rf2_c2_position_avg
	    ,round(avg(assist_dg_press)::numeric ,3) as assist_dg_press_avg
	    ,round(avg(heater_voltage)::numeric ,3) as heater_voltage_avg
	    ,round(avg(assist_gas_flow)::numeric ,3) as assist_gas_flow_avg
	    ,round(avg(esc_impedance)::numeric ,3) as esc_impedance_avg
	    ,round(avg(cathode_water_temp)::numeric ,3) as cathode_water_temp_avg
	    ,round(avg(stage_water_flow)::numeric ,3) as stage_water_flow_avg
	    ,round(avg(heatertemp)::numeric ,3) as heatertemp_avg
	    ,round(avg(wafer1temp)::numeric ,3) as wafer1temp_avg
	    ,round(avg(wafer2temp)::numeric ,3) as wafer2temp_avg
	    ,round(avg(heater1current)::numeric ,3) as heater1current_avg
	    ,round(avg(heater2current)::numeric ,3) as heater2current_avg
	    ,round(avg(heater3current)::numeric ,3) as heater3current_avg
	    ,round(avg(escvoltage)::numeric ,3) as escvoltage_avg
	    ,round(avg(esccurrent)::numeric ,3) as esccurrent_avg
	    ,round(avg(dg1_pressure)::numeric ,3) as dg1_pressure_avg
	    ,round(avg(dg2_pressure)::numeric ,3) as dg2_pressure_avg
	    ,round(avg(chamber_temp1)::numeric ,3) as chamber_temp1_avg
	    ,round(avg(chamber_temp2)::numeric ,3) as chamber_temp2_avg
	    ,round(avg(chamber_temp3)::numeric ,3) as chamber_temp3_avg
	    ,round(avg(chamber_temp4)::numeric ,3) as chamber_temp4_avg
	    ,round(avg(total1life)::numeric ,3) as total1life_avg
	    ,round(avg(total2life)::numeric ,3) as total2life_avg
	    ,round(avg(total3life)::numeric ,3) as total3life_avg
	    ,round(avg(shieldlife)::numeric ,3) as shieldlife_avg
	    ,round(avg(shutterlife)::numeric ,3) as shutterlife_avg
	    ,round(avg(trap_temp)::numeric ,3) as trap_temp_avg
	    ,round(avg(tmp_water_flow)::numeric ,3) as tmp_water_flow_avg
	    ,round(avg(cathode_water_flow)::numeric ,3) as cathode_water_flow_avg
	    ,round(avg(chamber_water_flow)::numeric ,3) as chamber_water_flow_avg
	    ,round(avg(step_process_time)::numeric ,3) as step_process_time_avg
	    ,round(avg(process_time)::numeric ,3) as process_time_avg
	    ,round(avg(pressure)::numeric ,3) as pressure_avg
	    ,round(avg(esc_impedance_warning_status)::numeric ,3) as esc_impedance_warning_status_avg
	    ,round(avg(esc_impedance_error_status)::numeric ,3) as esc_impedance_error_status_avg
	    ,round(avg(magnet_position)::numeric ,3) as magnet_position_avg
	    ,round(avg(active_pressure_gauge)::numeric ,3) as active_pressure_gauge_avg
	    ,round(avg(degas_status)::numeric ,3) as degas_status_avg
	    ,round(avg(active_ion_gauge_filament)::numeric ,3) as active_ion_gauge_filament_avg
	    ,round(avg(assist_gas_control_warning_status)::numeric ,3) as assist_gas_control_warning_status_avg
	    ,round(avg(assist_gas_control_error_status)::numeric ,3) as assist_gas_control_error_status_avg
	    ,round(avg(gauge_type)::numeric ,3) as gauge_type_avg
	    ,round(avg(drp_pg_pressure)::numeric ,3) as drp_pg_pressure_avg
	    ,round(avg(apr1_pressure)::numeric ,3) as apr1_pressure_avg
	    ,round(avg(arp2_pressure)::numeric ,3) as arp2_pressure_avg
	    ,round(avg(apr3_pressure)::numeric ,3) as apr3_pressure_avg
	    ,round(avg(apr4_pressure)::numeric ,3) as apr4_pressure_avg
	    ,round(avg(apr5_pressure)::numeric ,3) as apr5_pressure_avg
	    ,round(avg(rpc_pf)::numeric ,3) as rpc_pf_avg
	    ,round(avg(rpc_pr)::numeric ,3) as rpc_pr_avg
	    ,round(avg(rpc_resist)::numeric ,3) as rpc_resist_avg
	    ,round(avg(rpc_vol)::numeric ,3) as rpc_vol_avg
	    ,round(avg(rpc_freq)::numeric ,3) as rpc_freq_avg
	    ,round(avg(rpc_ignition)::numeric ,3) as rpc_ignition_avg
	    ,round(avg(ir_arc_detection)::numeric ,3) as ir_arc_detection_avg
	    ,round(avg(lifter_position_actual)::numeric ,3) as lifter_position_actual_avg
	    ,round(avg(lifter_velocity_actual)::numeric ,3) as lifter_velocity_actual_avg
	    ,round(avg(lifter_acceleration)::numeric ,3) as lifter_acceleration_avg
	    ,round(avg(lifter_deceleration)::numeric ,3) as lifter_deceleration_avg
	    ,round(avg(heater_temp2)::numeric ,3) as heater_temp2_avg
	    ,round(avg(corrected_temp_ao)::numeric ,3) as corrected_temp_ao_avg
	    ,round(avg(uncorrected_temp_ai)::numeric ,3) as uncorrected_temp_ai_avg
	    ,round((max(pg_pressure) - min( pg_pressure))::numeric ,3) as pg_pressure_range
	    ,round((max(ig_pressure) - min( ig_pressure))::numeric ,3) as ig_pressure_range
	    ,round((max(gas1mfc_flow) - min( gas1mfc_flow))::numeric ,3) as gas1mfc_flow_range
	    ,round((max(gas2mfc_flow) - min( gas2mfc_flow))::numeric ,3) as gas2mfc_flow_range
	    ,round((max(gas3mfc_flow) - min( gas3mfc_flow))::numeric ,3) as gas3mfc_flow_range
	    ,round((max(gas4mfc_flow) - min( gas4mfc_flow))::numeric ,3) as gas4mfc_flow_range
	    ,round((max(gas1mfc_flow_set) - min( gas1mfc_flow_set))::numeric ,3) as gas1mfc_flow_set_range
	    ,round((max(gas2mfc_flow_set) - min( gas2mfc_flow_set))::numeric ,3) as gas2mfc_flow_set_range
	    ,round((max(gas1mfc_valve_control) - min( gas1mfc_valve_control))::numeric ,3) as gas1mfc_valve_control_range
	    ,round((max(gas2mfc_valve_control) - min( gas2mfc_valve_control))::numeric ,3) as gas2mfc_valve_control_range
	    ,round((max(gas3mfc_valve_control) - min( gas3mfc_valve_control))::numeric ,3) as gas3mfc_valve_control_range
	    ,round((max(gas4mfc_valve_control) - min( gas4mfc_valve_control))::numeric ,3) as gas4mfc_valve_control_range
	    ,round((max(gas3mfc_flow_set) - min( gas3mfc_flow_set))::numeric ,3) as gas3mfc_flow_set_range
	    ,round((max(gas4mfc_flow_set) - min( gas4mfc_flow_set))::numeric ,3) as gas4mfc_flow_set_range
	    ,round((max(dc1power) - min( dc1power))::numeric ,3) as dc1power_range
	    ,round((max(dc1voltage) - min( dc1voltage))::numeric ,3) as dc1voltage_range
	    ,round((max(dc1current) - min( dc1current))::numeric ,3) as dc1current_range
	    ,round((max(dc2power) - min( dc2power))::numeric ,3) as dc2power_range
	    ,round((max(dc2voltage) - min( dc2voltage))::numeric ,3) as dc2voltage_range
	    ,round((max(dc2current) - min( dc2current))::numeric ,3) as dc2current_range
	    ,round((max(dc3power) - min( dc3power))::numeric ,3) as dc3power_range
	    ,round((max(dc3voltage) - min( dc3voltage))::numeric ,3) as dc3voltage_range
	    ,round((max(dc3current) - min( dc3current))::numeric ,3) as dc3current_range
	    ,round((max(rf1vdc) - min( rf1vdc))::numeric ,3) as rf1vdc_range
	    ,round((max(rf1pff) - min( rf1pff))::numeric ,3) as rf1pff_range
	    ,round((max(rf1pr) - min( rf1pr))::numeric ,3) as rf1pr_range
	    ,round((max(rf1vpp) - min( rf1vpp))::numeric ,3) as rf1vpp_range
	    ,round((max(rf1_c1_position) - min( rf1_c1_position))::numeric ,3) as rf1_c1_position_range
	    ,round((max(rf1_c2_position) - min( rf1_c2_position))::numeric ,3) as rf1_c2_position_range
	    ,round((max(rf2vdc) - min( rf2vdc))::numeric ,3) as rf2vdc_range
	    ,round((max(rf2pf) - min( rf2pf))::numeric ,3) as rf2pf_range
	    ,round((max(rf2pr) - min( rf2pr))::numeric ,3) as rf2pr_range
	    ,round((max(rf2vpp) - min( rf2vpp))::numeric ,3) as rf2vpp_range
	    ,round((max(rf2_c1_position) - min( rf2_c1_position))::numeric ,3) as rf2_c1_position_range
	    ,round((max(rf2_c2_position) - min( rf2_c2_position))::numeric ,3) as rf2_c2_position_range
	    ,round((max(assist_dg_press) - min( assist_dg_press))::numeric ,3) as assist_dg_press_range
	    ,round((max(heater_voltage) - min( heater_voltage))::numeric ,3) as heater_voltage_range
	    ,round((max(assist_gas_flow) - min( assist_gas_flow))::numeric ,3) as assist_gas_flow_range
	    ,round((max(esc_impedance) - min( esc_impedance))::numeric ,3) as esc_impedance_range
	    ,round((max(cathode_water_temp) - min( cathode_water_temp))::numeric ,3) as cathode_water_temp_range
	    ,round((max(stage_water_flow) - min( stage_water_flow))::numeric ,3) as stage_water_flow_range
	    ,round((max(heatertemp) - min( heatertemp))::numeric ,3) as heatertemp_range
	    ,round((max(wafer1temp) - min( wafer1temp))::numeric ,3) as wafer1temp_range
	    ,round((max(wafer2temp) - min( wafer2temp))::numeric ,3) as wafer2temp_range
	    ,round((max(heater1current) - min( heater1current))::numeric ,3) as heater1current_range
	    ,round((max(heater2current) - min( heater2current))::numeric ,3) as heater2current_range
	    ,round((max(heater3current) - min( heater3current))::numeric ,3) as heater3current_range
	    ,round((max(escvoltage) - min( escvoltage))::numeric ,3) as escvoltage_range
	    ,round((max(esccurrent) - min( esccurrent))::numeric ,3) as esccurrent_range
	    ,round((max(dg1_pressure) - min( dg1_pressure))::numeric ,3) as dg1_pressure_range
	    ,round((max(dg2_pressure) - min( dg2_pressure))::numeric ,3) as dg2_pressure_range
	    ,round((max(chamber_temp1) - min( chamber_temp1))::numeric ,3) as chamber_temp1_range
	    ,round((max(chamber_temp2) - min( chamber_temp2))::numeric ,3) as chamber_temp2_range
	    ,round((max(chamber_temp3) - min( chamber_temp3))::numeric ,3) as chamber_temp3_range
	    ,round((max(chamber_temp4) - min( chamber_temp4))::numeric ,3) as chamber_temp4_range
	    ,round((max(total1life) - min( total1life))::numeric ,3) as total1life_range
	    ,round((max(total2life) - min( total2life))::numeric ,3) as total2life_range
	    ,round((max(total3life) - min( total3life))::numeric ,3) as total3life_range
	    ,round((max(shieldlife) - min( shieldlife))::numeric ,3) as shieldlife_range
	    ,round((max(shutterlife) - min( shutterlife))::numeric ,3) as shutterlife_range
	    ,round((max(trap_temp) - min( trap_temp))::numeric ,3) as trap_temp_range
	    ,round((max(tmp_water_flow) - min( tmp_water_flow))::numeric ,3) as tmp_water_flow_range
	    ,round((max(cathode_water_flow) - min( cathode_water_flow))::numeric ,3) as cathode_water_flow_range
	    ,round((max(chamber_water_flow) - min( chamber_water_flow))::numeric ,3) as chamber_water_flow_range
	    ,round((max(step_process_time) - min( step_process_time))::numeric ,3) as step_process_time_range
	    ,round((max(process_time) - min( process_time))::numeric ,3) as process_time_range
	    ,round((max(pressure) - min( pressure))::numeric ,3) as pressure_range
	    ,round((max(esc_impedance_warning_status) - min( esc_impedance_warning_status))::numeric ,3) as esc_impedance_warning_status_range
	    ,round((max(esc_impedance_error_status) - min( esc_impedance_error_status))::numeric ,3) as esc_impedance_error_status_range
	    ,round((max(magnet_position) - min( magnet_position))::numeric ,3) as magnet_position_range
	    ,round((max(active_pressure_gauge) - min( active_pressure_gauge))::numeric ,3) as active_pressure_gauge_range
	    ,round((max(degas_status) - min( degas_status))::numeric ,3) as degas_status_range
	    ,round((max(active_ion_gauge_filament) - min( active_ion_gauge_filament))::numeric ,3) as active_ion_gauge_filament_range
	    ,round((max(assist_gas_control_warning_status) - min( assist_gas_control_warning_status))::numeric ,3) as assist_gas_control_warning_status_range
	    ,round((max(assist_gas_control_error_status) - min( assist_gas_control_error_status))::numeric ,3) as assist_gas_control_error_status_range
	    ,round((max(gauge_type) - min( gauge_type))::numeric ,3) as gauge_type_range
	    ,round((max(drp_pg_pressure) - min( drp_pg_pressure))::numeric ,3) as drp_pg_pressure_range
	    ,round((max(apr1_pressure) - min( apr1_pressure))::numeric ,3) as apr1_pressure_range
	    ,round((max(arp2_pressure) - min( arp2_pressure))::numeric ,3) as arp2_pressure_range
	    ,round((max(apr3_pressure) - min( apr3_pressure))::numeric ,3) as apr3_pressure_range
	    ,round((max(apr4_pressure) - min( apr4_pressure))::numeric ,3) as apr4_pressure_range
	    ,round((max(apr5_pressure) - min( apr5_pressure))::numeric ,3) as apr5_pressure_range
	    ,round((max(rpc_pf) - min( rpc_pf))::numeric ,3) as rpc_pf_range
	    ,round((max(rpc_pr) - min( rpc_pr))::numeric ,3) as rpc_pr_range
	    ,round((max(rpc_resist) - min( rpc_resist))::numeric ,3) as rpc_resist_range
	    ,round((max(rpc_vol) - min( rpc_vol))::numeric ,3) as rpc_vol_range
	    ,round((max(rpc_freq) - min( rpc_freq))::numeric ,3) as rpc_freq_range
	    ,round((max(rpc_ignition) - min( rpc_ignition))::numeric ,3) as rpc_ignition_range
	    ,round((max(ir_arc_detection) - min( ir_arc_detection))::numeric ,3) as ir_arc_detection_range
	    ,round((max(lifter_position_actual) - min( lifter_position_actual))::numeric ,3) as lifter_position_actual_range
	    ,round((max(lifter_velocity_actual) - min( lifter_velocity_actual))::numeric ,3) as lifter_velocity_actual_range
	    ,round((max(lifter_acceleration) - min( lifter_acceleration))::numeric ,3) as lifter_acceleration_range
	    ,round((max(lifter_deceleration) - min( lifter_deceleration))::numeric ,3) as lifter_deceleration_range
	    ,round((max(heater_temp2) - min( heater_temp2))::numeric ,3) as heater_temp2_range
	    ,round((max(corrected_temp_ao) - min( corrected_temp_ao))::numeric ,3) as corrected_temp_ao_range
	    ,round((max(uncorrected_temp_ai) - min( uncorrected_temp_ai))::numeric ,3) as uncorrected_temp_ai_range
	from wafer_summary_dsa mdl
	left join ods_tracelog trace
		on trace.toolid = mdl.toolid
		and trace.moduleid = mdl.moduleid
		and trace.time between mdl.proc_sdate and mdl.proc_edate
	group by mdl.toolid ,mdl.moduleid ,mdl.recipeid ,mdl.lotid ,mdl.carrierid ,mdl.slotno ,mdl.waferid ,mdl.recipestepno;

	exception
		when sqlstate '23505' then
			raise exception 'duplicate key value violates unique constraint "pk_wafer_summary"';
		when others then
		    raise exception 'wafer_summary Error, Code: %', SQLSTATE ;
END;
$procedure$
;
