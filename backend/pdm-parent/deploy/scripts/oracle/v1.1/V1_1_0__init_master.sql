-- init code
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'std', 'standard', 'data_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'ulsan', 'ulsan', 'data_type', 'system');

insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, '256', 'alarm', 'alarm_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, '128', 'warning', 'alarm_type', 'system');

insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'Velocity', 'Velocity', 'param_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'Acceleration', 'Acceleration', 'param_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'Enveloping', 'Enveloping', 'param_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'Rpm', 'Rpm', 'param_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'Summary', 'Summary', 'param_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'Trace', 'Trace', 'param_type', 'system');

insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'mm/s Rms', 'mm/s Rms', 'unit_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'gE PtP', 'gE PtP', 'unit_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'g Rms', 'g Rms', 'unit_type', 'system');

insert into code_mst_pdm(rawid, code, name, category, create_by, default_yn) values(seq_code_mst_pdm.nextval, 'axis', '축', 'parts_type', 'system', 'Y');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'bearing', '베어링', 'parts_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'gearwheel', '기어 휠', 'parts_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'sieve', '시브', 'parts_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'belt', '벨트', 'parts_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'impeller', '임펠러', 'parts_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'rotor', '회전자', 'parts_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'stator', '고정자', 'parts_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'motorspeed', '모터스피드', 'parts_type', 'system');

insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'rsd01', 'reserved_col1', 'reserved_column', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'rsd02', 'reserved_col2', 'reserved_column', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'rsd03', 'reserved_col3', 'reserved_column', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'rsd04', 'reserved_col4', 'reserved_column', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'rsd05', 'reserved_col5', 'reserved_column', 'system');

insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'R', 'RUN', 'status', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'I', 'IDLE', 'status', 'system');

insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'W', 'WARNING', 'alarm_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'A', 'ALARM', 'alarm_type', 'system');

insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'UNB', 'UNBALANCE', 'fault_class', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'MIS', 'MISALIGNMENT', 'fault_class', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'BEA', 'BEARING', 'fault_class', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'LUB', 'LUBRICATION', 'fault_class', 'system');

commit;


Insert into HEALTH_LOGIC_MST_PDM (RAWID, CATEGORY,CODE,NAME,ALARM_CONDITION,WARNING_CONDITION)
values (SEQ_HEALTH_LOGIC_MST_PDM.NEXTVAL, 'FD','FD_OOS','current status','value>=0.8','0.6<=value<0.8');
Insert into HEALTH_LOGIC_MST_PDM (RAWID, CATEGORY,CODE,NAME,ALARM_CONDITION,WARNING_CONDITION)
values (SEQ_HEALTH_LOGIC_MST_PDM.NEXTVAL, 'FD','FD_RULE_1','N out of M during Last X time period','value>1','value=1');
Insert into HEALTH_LOGIC_MST_PDM (RAWID, CATEGORY,CODE,NAME,ALARM_CONDITION,WARNING_CONDITION)
values (SEQ_HEALTH_LOGIC_MST_PDM.NEXTVAL, 'FD','FD_CHANGE_RATE','status change rate','value>=1','0.5<=value<1');
Insert into HEALTH_LOGIC_MST_PDM (RAWID, CATEGORY,CODE,NAME,ALARM_CONDITION,WARNING_CONDITION)
values (SEQ_HEALTH_LOGIC_MST_PDM.NEXTVAL, 'FP','FP_RUL','RUL Prediction','value<=30','30<value<=90');
Insert into HEALTH_LOGIC_MST_PDM (RAWID, CATEGORY,CODE,NAME,ALARM_CONDITION,WARNING_CONDITION)
values (SEQ_HEALTH_LOGIC_MST_PDM.NEXTVAL, 'FC','FC_CAUSE','Vibration Spectrum Data Analysis',null,null);

Insert into HEALTH_LOGIC_OPTION_MST_PDM (RAWID, HEALTH_LOGIC_MST_RAWID,OPTION_NAME,OPTION_VALUE)
values (SEQ_HEALTH_LOGIC_OPT_MST_PDM.NEXTVAL, 2,'N',3);
Insert into HEALTH_LOGIC_OPTION_MST_PDM (RAWID, HEALTH_LOGIC_MST_RAWID,OPTION_NAME,OPTION_VALUE)
values (SEQ_HEALTH_LOGIC_OPT_MST_PDM.NEXTVAL, 2,'M',6);

commit;

