CREATE OR REPLACE FUNCTION GET_AREA_FULL_NAME(P_EQP_ID IN NUMBER) RETURN VARCHAR2 
	IS AREA_FULL_NAME VARCHAR2(256);
	BEGIN 
		select substr(name, 1, length(name)-3)
			into AREA_FULL_NAME
		from (
			select name, lvl, max(lvl) over () as tgt_lvl
			from (
				select REVERSE(SYS_CONNECT_BY_PATH(REVERSE(name), ' > ')) as name, level as lvl
				from AREA_PDM
				start with area_id = (select area_id from eqp_pdm where eqp_id = P_EQP_ID)
				connect by prior parent_id = area_id
			)
		) where lvl = tgt_lvl;
     
	RETURN(AREA_FULL_NAME); 
END;
/


create or replace procedure create_partition(
	p_strdate in varchar2,
	p_table_name in varchar2
) is
v_sql varchar2(4000);
v_par varchar2(10);
v_date varchar2(10);
l_exists number;
begin
	if p_strdate is null then
		select 
			to_char(sysdate, 'YYYYMM'), to_char(add_months(sysdate, 1), 'YYYYMM')
			into v_par, v_date
		from dual;
	else
		v_par := p_strdate;
		select to_char(add_months(to_date(p_strdate, 'YYYYMM'), 1), 'YYYYMM') into v_date from dual;
	end if;
	
	select count(1) into l_exists 
	from user_tab_partitions 
	where table_name = p_table_name and partition_name = 'P_' || v_par;
	
	if l_exists = 0 then
		v_sql := 'alter table '|| p_table_name ||' add partition P_'|| v_par ||' values less than(to_timestamp('''|| v_date ||''', ''YYYYMM'')) tablespace pdm_dat';
		dbms_output.put_line(v_sql);
		EXECUTE immediate v_sql;
	end if;
end;
/

-- exec dbms_output.enable();
-- exec create_partition('201711', 'OVERALL_MINUTE_TRX_PDM');


-- create view HKMC_UV_ALARM_STATUS as
-- select status_cd as alarm_cd,
-- 	alarm_dtts as alarm_dt,
-- 	eqp_id as node_id
-- from EQP_ALARM_TRX_PDM
