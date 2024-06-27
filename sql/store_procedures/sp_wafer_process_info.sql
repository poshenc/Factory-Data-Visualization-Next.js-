-- DROP PROCEDURE public.sp_wafer_process_info(timestamp, timestamp);

CREATE OR REPLACE PROCEDURE public.sp_wafer_process_info(IN param_sdate timestamp without time zone, IN param_edate timestamp without time zone)
 LANGUAGE plpgsql
AS $procedure$
	begin
		
		delete from wafer_process_info
		where sdate between param_sdate and param_edate;
		
		insert into wafer_process_info(
			toolid
			,moduleid
			,recipeid
			,lotid
			,carrierid
			,slotno
			,waferid
			,sdate
			,edate
		)
		select
			 mdl.toolid
			,mdl.moduleid
			,mdl.recipeid
			,mdl.lotid
			,mdl.carrierid
			,mdl.slotno
			,mdl.waferid
			,min(evt.time) as sdate
			,max(evt.time) as edate
		from procmdl mdl
		left join equevtlog evt
			on mdl.toolid = evt.toolid
			and mdl.moduleid = evt.moduleid
			and mdl.lotid = evt.lotid
			and mdl.carrierid = evt.carrierid
			and mdl.slotno = evt.slotno
			and mdl.waferid = evt.waferid
		where mdl.sdate between param_sdate and param_edate
		and mdl.moduleid ~ 'F[0-9]-[0-9]'
		group by mdl.toolid, mdl.moduleid, mdl.recipeid, mdl.lotid, mdl.carrierid, mdl.slotno, mdl.waferid
		;
	exception
		when sqlstate '23505' then
			raise exception 'duplicate key value violates unique constraint "pk_wafer_process_info"';
		when others then
		    raise exception 'Wafer_process_info Error, Code: %', SQLSTATE ;
	END;
$procedure$
;
