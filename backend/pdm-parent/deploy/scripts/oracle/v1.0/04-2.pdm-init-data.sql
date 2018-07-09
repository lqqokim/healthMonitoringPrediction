
-- init code
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'std', 'standard', 'data_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'ulsan', 'ulsan', 'data_type', 'system');

insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, '256', 'alarm', 'alarm_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, '128', 'warning', 'alarm_type', 'system');

insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'velocity', 'velocity', 'param_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'acceleration', 'acceleration', 'param_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'enveloping', 'enveloping', 'param_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'rpm', 'rpm', 'param_type', 'system');
insert into code_mst_pdm(rawid, code, name, category, create_by) values(seq_code_mst_pdm.nextval, 'Temperature', 'Temperature', 'param_type', 'system');

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

commit;