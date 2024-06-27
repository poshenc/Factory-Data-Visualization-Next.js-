-- DROP PROCEDURE public.job_execute(timestamp, timestamp, int4);

CREATE OR REPLACE PROCEDURE public.job_execute(IN param_sdate timestamp without time zone, IN param_edate timestamp without time zone, IN param_step_no integer DEFAULT 6)
 LANGUAGE plpgsql
AS $procedure$
	begin
		
		call sp_ods_tracelog(param_sdate, param_edate);
		call sp_ods_equevtlog(param_sdate, param_edate);
		call sp_wafer_summary(param_sdate, param_edate);
		call sp_wafer_process_info(param_sdate, param_edate);
		call sp_wafer_process_step_info(param_sdate, param_edate);
	
	commit;
	end;
$procedure$
;
