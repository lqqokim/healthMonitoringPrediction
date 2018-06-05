
Insert into AREA_MST_PDM (NAME,DESCRIPTION,PARENT_RAWID,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
    values ('BISTel',null,0,'demo',current_timestamp,'demo',current_timestamp);

Insert into AREA_MST_PDM (NAME,DESCRIPTION,PARENT_RAWID,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
    values ('Demo_Area',null,0,'demo',current_timestamp,'demo',current_timestamp);

commit;

CREATE FUNCTION create_eqp() RETURNS VOID AS
$$
BEGIN
    FOR i IN 1..500 LOOP
        Insert into EQP_MST_PDM (AREA_MST_RAWID,NAME,DESCRIPTION,DATA_TYPE_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
		select rawid,'Demo' || i,null,'STD','demo',current_timestamp,'demo',current_timestamp from area_mst_pdm where name='Demo_Area';
    END LOOP;
END;
$$
LANGUAGE plpgsql;

select create_eqp();

commit;


CREATE FUNCTION create_param() RETURNS VOID AS
$$
BEGIN
    FOR i IN 1..500 LOOP
        Insert into PARAM_MST_PDM (EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
        values ((select rawid from eqp_mst_pdm where name='Demo' || i),1,'Fan DE1 Acceleration',null,'Acceleration','g Rms','demo',current_timestamp,'demo',current_timestamp);

        Insert into PARAM_MST_PDM (EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
        values ((select rawid from eqp_mst_pdm where name='Demo' || i),1,'Fan DE1 Velocity',null,'Velocity','mm/s Rms','demo',current_timestamp,'demo',current_timestamp);

        Insert into PARAM_MST_PDM (EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
        values ((select rawid from eqp_mst_pdm where name='Demo' || i),1,'Fan DE1 Enveloping',null,'Enveloping','gE PtP','demo',current_timestamp,'demo',current_timestamp);

        Insert into PARAM_MST_PDM (EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
        values ((select rawid from eqp_mst_pdm where name='Demo' || i),1,'Fan DE2 Acceleration',null,'Acceleration','g Rms','demo',current_timestamp,'demo',current_timestamp);

        Insert into PARAM_MST_PDM (EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
        values ((select rawid from eqp_mst_pdm where name='Demo' || i),1,'Fan DE2 Enveloping',null,'Enveloping','gE PtP','demo',current_timestamp,'demo',current_timestamp);

        Insert into PARAM_MST_PDM (EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
        values ((select rawid from eqp_mst_pdm where name='Demo' || i),1,'Fan DE2 Velocity',null,'Velocity','mm/s Rms','demo',current_timestamp,'demo',current_timestamp);

        Insert into PARAM_MST_PDM (EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
        values ((select rawid from eqp_mst_pdm where name='Demo' || i),1,'Fan NDE Acceleration',null,'Acceleration','g Rms','demo',current_timestamp,'demo',current_timestamp);

        Insert into PARAM_MST_PDM (EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
        values ((select rawid from eqp_mst_pdm where name='Demo' || i),1,'Fan NDE Enveloping',null,'Enveloping','gE PtP','demo',current_timestamp,'demo',current_timestamp);

        Insert into PARAM_MST_PDM (EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
        values ((select rawid from eqp_mst_pdm where name='Demo' || i),1,'Fan NDE Velocity',null,'Velocity','mm/s Rms','demo',current_timestamp,'demo',current_timestamp);

        Insert into PARAM_MST_PDM (EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
        values ((select rawid from eqp_mst_pdm where name='Demo' || i),1,'Motor DE Acceleration',null,'Acceleration','g Rms','demo',current_timestamp,'demo',current_timestamp);

        Insert into PARAM_MST_PDM (EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
        values ((select rawid from eqp_mst_pdm where name='Demo' || i),1,'Motor DE Enveloping',null,'Enveloping','gE PtP','demo',current_timestamp,'demo',current_timestamp);

        Insert into PARAM_MST_PDM (EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
        values ((select rawid from eqp_mst_pdm where name='Demo' || i),1,'Motor DE Velocity','34444','Velocity','mm/s Rms','demo',current_timestamp,'demo',current_timestamp);

        Insert into PARAM_MST_PDM (EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
        values ((select rawid from eqp_mst_pdm where name='Demo' || i),1,'Motor Temperature',null,'Temperature','''C','demo',current_timestamp,'demo',current_timestamp);
	END LOOP;
END;
$$
LANGUAGE plpgsql;

select create_param();

commit;

CREATE FUNCTION create_param_spec() RETURNS VOID AS
$$
BEGIN
    FOR i IN 1..500 LOOP
        Insert into TRACE_SPEC_MST_PDM (PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
	values ((select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo' || i and p.name='Fan DE1 Velocity'),5.5,5,'demo',current_timestamp,'demo',current_timestamp);

	Insert into TRACE_SPEC_MST_PDM (PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
	values ((select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo' || i and p.name='Fan DE2 Acceleration'),1,0.9,'demo',current_timestamp,'demo',current_timestamp);

	Insert into TRACE_SPEC_MST_PDM (PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
	values ((select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo' || i and p.name='Fan DE2 Enveloping'),0.2,0.1,'demo',current_timestamp,'demo',current_timestamp);

	Insert into TRACE_SPEC_MST_PDM (PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
	values ((select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo' || i and p.name='Fan DE2 Velocity'),5.5,5,'demo',current_timestamp,'demo',current_timestamp);

	Insert into TRACE_SPEC_MST_PDM (PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
	values ((select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo' || i and p.name='Fan NDE Acceleration'),1,0.9,'demo',current_timestamp,'demo',current_timestamp);

	Insert into TRACE_SPEC_MST_PDM (PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
	values ((select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo' || i and p.name='Fan NDE Enveloping'),0.2,0.1,'demo',current_timestamp,'demo',current_timestamp);

	Insert into TRACE_SPEC_MST_PDM (PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
	values ((select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo' || i and p.name='Fan NDE Velocity'),5.5,5,'demo',current_timestamp,'demo',current_timestamp);

	Insert into TRACE_SPEC_MST_PDM (PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
	values ((select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo' || i and p.name='Motor DE Acceleration'),1,0.9,'demo',current_timestamp,'demo',current_timestamp);

	Insert into TRACE_SPEC_MST_PDM (PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
	values ((select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo' || i and p.name='Motor DE Enveloping'),0.2,0.1,'demo',current_timestamp,'demo',current_timestamp);

	Insert into TRACE_SPEC_MST_PDM (PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
	values ((select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo' || i and p.name='Motor DE Velocity'),5.5,5,'demo',current_timestamp,'demo',current_timestamp);

	Insert into TRACE_SPEC_MST_PDM (PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
	values ((select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo' || i and p.name='Motor Temperature'),70,50,'demo',current_timestamp,'demo',current_timestamp);

	end loop;
END;
$$
LANGUAGE plpgsql;

select create_param_spec();

commit;




