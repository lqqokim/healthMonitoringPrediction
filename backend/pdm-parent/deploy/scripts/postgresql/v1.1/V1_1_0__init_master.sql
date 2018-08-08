-- init code
insert into code_mst_pdm(code, name, category, create_by) values('std', 'standard', 'data_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('ulsan', 'ulsan', 'data_type', 'system');

insert into code_mst_pdm(code, name, category, create_by) values('256', 'alarm', 'alarm_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('128', 'warning', 'alarm_type', 'system');

insert into code_mst_pdm(code, name, category, create_by) values('Velocity', 'Velocity', 'param_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('Acceleration', 'Acceleration', 'param_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('Enveloping', 'Enveloping', 'param_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('Rpm', 'Rpm', 'param_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('Summary', 'Summary', 'param_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('Trace', 'Trace', 'param_type', 'system');

insert into code_mst_pdm(code, name, category, create_by) values('mm/s Rms', 'mm/s Rms', 'unit_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('gE PtP', 'gE PtP', 'unit_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('g Rms', 'g Rms', 'unit_type', 'system');

insert into code_mst_pdm(code, name, category, create_by, default_yn) values('axis', '축', 'parts_type', 'system', 'Y');
insert into code_mst_pdm(code, name, category, create_by) values('bearing', '베어링', 'parts_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('gearwheel', '기어 휠', 'parts_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('sieve', '시브', 'parts_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('belt', '벨트', 'parts_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('impeller', '임펠러', 'parts_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('rotor', '회전자', 'parts_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('stator', '고정자', 'parts_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('motorspeed', '모터스피드', 'parts_type', 'system');

insert into code_mst_pdm(code, name, category, create_by) values('rsd01', 'reserved_col1', 'reserved_column', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('rsd02', 'reserved_col2', 'reserved_column', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('rsd03', 'reserved_col3', 'reserved_column', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('rsd04', 'reserved_col4', 'reserved_column', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('rsd05', 'reserved_col5', 'reserved_column', 'system');

insert into code_mst_pdm(code, name, category, create_by) values('R', 'RUN', 'status', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('I', 'IDLE', 'status', 'system');

insert into code_mst_pdm(code, name, category, create_by) values('W', 'WARNING', 'alarm_type', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('A', 'ALARM', 'alarm_type', 'system');

insert into code_mst_pdm(code, name, category, create_by) values('UNB', 'UNBALANCE', 'fault_class', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('MIS', 'MISALIGNMENT', 'fault_class', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('BEA', 'BEARING', 'fault_class', 'system');
insert into code_mst_pdm(code, name, category, create_by) values('LUB', 'LUBRICATION', 'fault_class', 'system');

commit;


Insert into HEALTH_LOGIC_MST_PDM (CATEGORY,CODE,NAME,ALARM_CONDITION,WARNING_CONDITION)
values ('FD','FD_OOS','current status','value>=0.8','0.6<=value<0.8');
Insert into HEALTH_LOGIC_MST_PDM (CATEGORY,CODE,NAME,ALARM_CONDITION,WARNING_CONDITION)
values ('FD','FD_RULE_1','N out of M during Last X time period','value>1','value=1');
Insert into HEALTH_LOGIC_MST_PDM (CATEGORY,CODE,NAME,ALARM_CONDITION,WARNING_CONDITION)
values ('FD','FD_CHANGE_RATE','status change rate','value>=1','0.5<=value<1');
Insert into HEALTH_LOGIC_MST_PDM (CATEGORY,CODE,NAME,ALARM_CONDITION,WARNING_CONDITION)
values ('FP','FP_RUL','RUL Prediction','value<=30','30<value<=90');
Insert into HEALTH_LOGIC_MST_PDM (CATEGORY,CODE,NAME,ALARM_CONDITION,WARNING_CONDITION)
values ('FC','FC_CAUSE','Vibration Spectrum Data Analysis',null,null);

Insert into HEALTH_LOGIC_OPTION_MST_PDM (HEALTH_LOGIC_MST_RAWID,OPTION_NAME,OPTION_VALUE)
values (2,'N',3);
Insert into HEALTH_LOGIC_OPTION_MST_PDM (HEALTH_LOGIC_MST_RAWID,OPTION_NAME,OPTION_VALUE)
values (2,'M',6);

commit;

