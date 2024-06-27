-- DROP PROCEDURE public.sp_ods_equevtlog(timestamp, timestamp);

CREATE OR REPLACE PROCEDURE public.sp_ods_equevtlog(IN param_sdate timestamp without time zone, IN param_edate timestamp without time zone)
 LANGUAGE plpgsql
AS $procedure$
	begin
		delete from ods_equevtlog
		where time between param_sdate and param_edate
		;
		insert into ods_equevtlog(
			time
			,toolid
			,moduleid
			,type
			,event
			,action
			,caller
			,recipeid
			,recipestepno
			,acttime
			,lotid
			,carrierid
			,slotno
			,waferid
			,message
			,uuid
		)
		select
			time
			,toolid
			,moduleid
			,type
			,event
			,action
			,caller
			,recipeid
			,recipestepno
			,acttime
			,lotid
			,carrierid
			,slotno
			,waferid
			,message
			,gen_random_uuid()
		from equevtlog
		where time between param_sdate and param_edate
		;
	exception
		when others then 
	        raise exception 'ods_equevtlog Error, Code: %', SQLSTATE ;
	END;
$procedure$
;
