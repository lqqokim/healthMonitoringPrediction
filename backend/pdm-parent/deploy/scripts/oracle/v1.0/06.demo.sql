SET DEFINE OFF;

Insert into AREA_MST_PDM (RAWID,NAME,DESCRIPTION,PARENT_RAWID,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
    values (seq_area_mst_pdm.nextval,'BISTel',null,0,'demo',systimestamp,'demo',systimestamp);

Insert into AREA_MST_PDM (RAWID,NAME,DESCRIPTION,PARENT_RAWID,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
    values (seq_area_mst_pdm.nextval,'Demo_Area',null,0,'demo',systimestamp,'demo',systimestamp);

commit;

--select rawid from area_mst_pdm where name='Demo_Area';

Insert into EQP_MST_PDM (RAWID,AREA_MST_RAWID,NAME,DESCRIPTION,DATA_TYPE_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
select seq_eqp_mst_pdm.nextval, rawid,'Demo1',null,'STD','demo',systimestamp,'demo',systimestamp
from area_mst_pdm where name='Demo_Area';

Insert into EQP_MST_PDM (RAWID,AREA_MST_RAWID,NAME,DESCRIPTION,DATA_TYPE_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
select seq_eqp_mst_pdm.nextval, rawid,'Demo2',null,'STD','demo',systimestamp,'demo',systimestamp
from area_mst_pdm where name='Demo_Area';

Insert into EQP_MST_PDM (RAWID,AREA_MST_RAWID,NAME,DESCRIPTION,DATA_TYPE_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
select seq_eqp_mst_pdm.nextval, rawid,'Demo3',null,'STD','demo',systimestamp,'demo',systimestamp
from area_mst_pdm where name='Demo_Area';

Insert into EQP_MST_PDM (RAWID,AREA_MST_RAWID,NAME,DESCRIPTION,DATA_TYPE_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
select seq_eqp_mst_pdm.nextval, rawid,'Demo11',null,'STD','demo',systimestamp,'demo',systimestamp
from area_mst_pdm where name='Demo_Area';

Insert into EQP_MST_PDM (RAWID,AREA_MST_RAWID,NAME,DESCRIPTION,DATA_TYPE_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
select seq_eqp_mst_pdm.nextval, rawid,'Demo12',null,'STD','demo',systimestamp,'demo',systimestamp
from area_mst_pdm where name='Demo_Area';

Insert into EQP_MST_PDM (RAWID,AREA_MST_RAWID,NAME,DESCRIPTION,DATA_TYPE_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
select seq_eqp_mst_pdm.nextval, rawid,'Demo13',null,'STD','demo',systimestamp,'demo',systimestamp
from area_mst_pdm where name='Demo_Area';

Insert into EQP_MST_PDM (RAWID,AREA_MST_RAWID,NAME,DESCRIPTION,DATA_TYPE_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
select seq_eqp_mst_pdm.nextval, rawid,'Demo21',null,'STD','demo',systimestamp,'demo',systimestamp
from area_mst_pdm where name='Demo_Area';

Insert into EQP_MST_PDM (RAWID,AREA_MST_RAWID,NAME,DESCRIPTION,DATA_TYPE_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
select seq_eqp_mst_pdm.nextval, rawid,'Demo22',null,'STD','demo',systimestamp,'demo',systimestamp
from area_mst_pdm where name='Demo_Area';

Insert into EQP_MST_PDM (RAWID,AREA_MST_RAWID,NAME,DESCRIPTION,DATA_TYPE_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
select seq_eqp_mst_pdm.nextval, rawid,'Demo23',null,'STD','demo',systimestamp,'demo',systimestamp
from area_mst_pdm where name='Demo_Area';

commit;

Insert into BEARING_MST_PDM (RAWID,MODEL_NUMBER,MANUFACTURE,BPFO,BPFI,BSF,FTF,DESCRIPTION,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_bearing_mst_pdm.nextval,'model1','BISTel',3,5,2,0,null,'demo',systimestamp,'demo',systimestamp);

Insert into BEARING_MST_PDM (RAWID,MODEL_NUMBER,MANUFACTURE,BPFO,BPFI,BSF,FTF,DESCRIPTION,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_bearing_mst_pdm.nextval,'model2','BISTel',5,8,3,0,null,'demo',systimestamp,'demo',systimestamp);

Insert into BEARING_MST_PDM (RAWID,MODEL_NUMBER,MANUFACTURE,BPFO,BPFI,BSF,FTF,DESCRIPTION,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_bearing_mst_pdm.nextval,'model3','BISTel',5,7,3,0,null,'demo',systimestamp,'demo',systimestamp);

Insert into BEARING_MST_PDM (RAWID,MODEL_NUMBER,MANUFACTURE,BPFO,BPFI,BSF,FTF,DESCRIPTION,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_bearing_mst_pdm.nextval,'model4','BISTel',3,5,2,0,null,'demo',systimestamp,'demo',systimestamp);

Insert into BEARING_MST_PDM (RAWID,MODEL_NUMBER,MANUFACTURE,BPFO,BPFI,BSF,FTF,DESCRIPTION,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_bearing_mst_pdm.nextval,'model5','BISTel',3,5,2,0,null,'demo',systimestamp,'demo',systimestamp);

commit;


Insert into PARTS_MST_PDM (RAWID,EQP_MST_RAWID,BEARING_MST_RAWID,NAME,PARTS_TYPE_CD,BASE_RATIO_YN,RPM,RATIO,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_parts_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name = 'Demo1'),(select rawid from bearing_mst_pdm where model_number='model1'),'Motor 1X','0','Y',525,1,'demo',systimestamp,'demo',systimestamp);

Insert into PARTS_MST_PDM (RAWID,EQP_MST_RAWID,BEARING_MST_RAWID,NAME,PARTS_TYPE_CD,BASE_RATIO_YN,RPM,RATIO,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_parts_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name = 'Demo1'),(select rawid from bearing_mst_pdm where model_number='model1'),'Belt1','5','N',0,1.5,'demo',systimestamp,'demo',systimestamp);

Insert into PARTS_MST_PDM (RAWID,EQP_MST_RAWID,BEARING_MST_RAWID,NAME,PARTS_TYPE_CD,BASE_RATIO_YN,RPM,RATIO,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_parts_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name = 'Demo1'),(select rawid from bearing_mst_pdm where model_number='model1'),'Manual Speed','9','N',0,2,'demo',systimestamp,'demo',systimestamp);

Insert into PARTS_MST_PDM (RAWID,EQP_MST_RAWID,BEARING_MST_RAWID,NAME,PARTS_TYPE_CD,BASE_RATIO_YN,RPM,RATIO,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_parts_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name = 'Demo1'),(select rawid from bearing_mst_pdm where model_number='model1'),'MTR NDE','2','N',0,0.0,'demo',systimestamp,'demo',systimestamp);

Insert into PARTS_MST_PDM (RAWID,EQP_MST_RAWID,BEARING_MST_RAWID,NAME,PARTS_TYPE_CD,BASE_RATIO_YN,RPM,RATIO,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_parts_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name = 'Demo1'),(select rawid from bearing_mst_pdm where model_number='model1'),'Electrical Rotor','7','N',0,0.0,'demo',systimestamp,'demo',systimestamp);

Insert into PARTS_MST_PDM (RAWID,EQP_MST_RAWID,BEARING_MST_RAWID,NAME,PARTS_TYPE_CD,BASE_RATIO_YN,RPM,RATIO,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_parts_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name = 'Demo1'),(select rawid from bearing_mst_pdm where model_number='model1'),'Stator','8','N',0,0.0,'demo',systimestamp,'demo',systimestamp);

Insert into PARTS_MST_PDM (RAWID,EQP_MST_RAWID,BEARING_MST_RAWID,NAME,PARTS_TYPE_CD,BASE_RATIO_YN,RPM,RATIO,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_parts_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name = 'Demo1'),(select rawid from bearing_mst_pdm where model_number='model1'),'MTR DE','2','N',0,0.0,'demo',systimestamp,'demo',systimestamp);

Insert into PARTS_MST_PDM (RAWID,EQP_MST_RAWID,BEARING_MST_RAWID,NAME,PARTS_TYPE_CD,BASE_RATIO_YN,RPM,RATIO,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_parts_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name = 'Demo1'),(select rawid from bearing_mst_pdm where model_number='model1'),'MTR Sheave','4','N',0,0.0,'demo',systimestamp,'demo',systimestamp);

Insert into PARTS_MST_PDM (RAWID,EQP_MST_RAWID,BEARING_MST_RAWID,NAME,PARTS_TYPE_CD,BASE_RATIO_YN,RPM,RATIO,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_parts_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name = 'Demo1'),(select rawid from bearing_mst_pdm where model_number='model1'),'Fan Pulley','4','N',0,0.0,'demo',systimestamp,'demo',systimestamp);

Insert into PARTS_MST_PDM (RAWID,EQP_MST_RAWID,BEARING_MST_RAWID,NAME,PARTS_TYPE_CD,BASE_RATIO_YN,RPM,RATIO,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_parts_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name = 'Demo1'),(select rawid from bearing_mst_pdm where model_number='model1'),'Fan DE2','2','N',0,0.0,'demo',systimestamp,'demo',systimestamp);

Insert into PARTS_MST_PDM (RAWID,EQP_MST_RAWID,BEARING_MST_RAWID,NAME,PARTS_TYPE_CD,BASE_RATIO_YN,RPM,RATIO,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_parts_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name = 'Demo1'),(select rawid from bearing_mst_pdm where model_number='model1'),'Impeller1','6','N',0,0.0,'demo',systimestamp,'demo',systimestamp);

Insert into PARTS_MST_PDM (RAWID,EQP_MST_RAWID,BEARING_MST_RAWID,NAME,PARTS_TYPE_CD,BASE_RATIO_YN,RPM,RATIO,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_parts_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name = 'Demo1'),(select rawid from bearing_mst_pdm where model_number='model1'),'Fan DE1','2','N',0,0.0,'demo',systimestamp,'demo',systimestamp);

Insert into PARTS_MST_PDM (RAWID,EQP_MST_RAWID,BEARING_MST_RAWID,NAME,PARTS_TYPE_CD,BASE_RATIO_YN,RPM,RATIO,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_parts_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name = 'Demo1'),(select rawid from bearing_mst_pdm where model_number='model1'),'Fan NDE','2','N',0,0.0,'demo',systimestamp,'demo',systimestamp);

Insert into PARTS_MST_PDM (RAWID,EQP_MST_RAWID,BEARING_MST_RAWID,NAME,PARTS_TYPE_CD,BASE_RATIO_YN,RPM,RATIO,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_parts_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name = 'Demo1'),(select rawid from bearing_mst_pdm where model_number='model1'),'Fan 1X','0','N',0,0.0,'demo',systimestamp,'demo',systimestamp);


commit;

Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo1'),1,'Fan DE1 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo1'),1,'Fan DE2 Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo1'),1,'Fan DE2 Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo1'),1,'Fan DE2 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo1'),1,'Fan NDE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo1'),1,'Fan NDE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo1'),1,'Fan NDE Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo1'),1,'Motor DE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo1'),1,'Motor DE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo1'),1,'Motor DE Velocity','34444','Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo1'),1,'Motor Temperature',null,'Temperature','''C','demo',systimestamp,'demo',systimestamp);


Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo2'),1,'Fan DE1 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo2'),1,'Fan DE2 Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo2'),1,'Fan DE2 Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo2'),1,'Fan DE2 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo2'),1,'Fan NDE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo2'),1,'Fan NDE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo2'),1,'Fan NDE Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo2'),1,'Motor DE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo2'),1,'Motor DE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo2'),1,'Motor DE Velocity','34444','Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo2'),1,'Motor Temperature',null,'Temperature','''C','demo',systimestamp,'demo',systimestamp);


Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo3'),1,'Fan DE1 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo3'),1,'Fan DE2 Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo3'),1,'Fan DE2 Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo3'),1,'Fan DE2 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo3'),1,'Fan NDE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo3'),1,'Fan NDE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo3'),1,'Fan NDE Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo3'),1,'Motor DE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo3'),1,'Motor DE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo3'),1,'Motor DE Velocity','34444','Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo3'),1,'Motor Temperature',null,'Temperature','''C','demo',systimestamp,'demo',systimestamp);


Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo11'),1,'Fan DE1 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo11'),1,'Fan DE2 Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo11'),1,'Fan DE2 Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo11'),1,'Fan DE2 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo11'),1,'Fan NDE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo11'),1,'Fan NDE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo11'),1,'Fan NDE Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo11'),1,'Motor DE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo11'),1,'Motor DE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo11'),1,'Motor DE Velocity','34444','Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo11'),1,'Motor Temperature',null,'Temperature','''C','demo',systimestamp,'demo',systimestamp);

Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo12'),1,'Fan DE1 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo12'),1,'Fan DE2 Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo12'),1,'Fan DE2 Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo12'),1,'Fan DE2 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo12'),1,'Fan NDE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo12'),1,'Fan NDE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo12'),1,'Fan NDE Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo12'),1,'Motor DE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo12'),1,'Motor DE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo12'),1,'Motor DE Velocity','34444','Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo12'),1,'Motor Temperature',null,'Temperature','''C','demo',systimestamp,'demo',systimestamp);


Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo13'),1,'Fan DE1 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo13'),1,'Fan DE2 Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo13'),1,'Fan DE2 Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo13'),1,'Fan DE2 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo13'),1,'Fan NDE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo13'),1,'Fan NDE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo13'),1,'Fan NDE Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo13'),1,'Motor DE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo13'),1,'Motor DE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo13'),1,'Motor DE Velocity','34444','Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo13'),1,'Motor Temperature',null,'Temperature','''C','demo',systimestamp,'demo',systimestamp);



Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo21'),1,'Fan DE1 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo21'),1,'Fan DE2 Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo21'),1,'Fan DE2 Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo21'),1,'Fan DE2 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo21'),1,'Fan NDE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo21'),1,'Fan NDE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo21'),1,'Fan NDE Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo21'),1,'Motor DE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo21'),1,'Motor DE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo21'),1,'Motor DE Velocity','34444','Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo21'),1,'Motor Temperature',null,'Temperature','''C','demo',systimestamp,'demo',systimestamp);



Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo22'),1,'Fan DE1 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo22'),1,'Fan DE2 Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo22'),1,'Fan DE2 Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo22'),1,'Fan DE2 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo22'),1,'Fan NDE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo22'),1,'Fan NDE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo22'),1,'Fan NDE Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo22'),1,'Motor DE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo22'),1,'Motor DE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo22'),1,'Motor DE Velocity','34444','Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo22'),1,'Motor Temperature',null,'Temperature','''C','demo',systimestamp,'demo',systimestamp);



Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo23'),1,'Fan DE1 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo23'),1,'Fan DE2 Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo23'),1,'Fan DE2 Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo23'),1,'Fan DE2 Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo23'),1,'Fan NDE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo23'),1,'Fan NDE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo23'),1,'Fan NDE Velocity',null,'Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo23'),1,'Motor DE Acceleration',null,'Acceleration','g Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo23'),1,'Motor DE Enveloping',null,'Enveloping','gE PtP','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo23'),1,'Motor DE Velocity','34444','Velocity','mm/s Rms','demo',systimestamp,'demo',systimestamp);
Insert into PARAM_MST_PDM (RAWID,EQP_MST_RAWID,PARTS_MST_RAWID,NAME,DESCRIPTION,PARAM_TYPE_CD,UNIT_CD,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_param_mst_pdm.nextval,(select rawid from eqp_mst_pdm where name='Demo23'),1,'Motor Temperature',null,'Temperature','''C','demo',systimestamp,'demo',systimestamp);

commit;

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo1' and p.name='Fan DE1 Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo1' and p.name='Fan DE2 Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo1' and p.name='Fan DE2 Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo1' and p.name='Fan DE2 Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo1' and p.name='Fan NDE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo1' and p.name='Fan NDE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo1' and p.name='Fan NDE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo1' and p.name='Motor DE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo1' and p.name='Motor DE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo1' and p.name='Motor DE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo1' and p.name='Motor Temperature'),70,50,'demo',systimestamp,'demo',systimestamp);






Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo2' and p.name='Fan DE1 Velocity'),6.1,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo2' and p.name='Fan DE2 Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo2' and p.name='Fan DE2 Enveloping'),0.3,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo2' and p.name='Fan DE2 Velocity'),5.8,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo2' and p.name='Fan NDE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo2' and p.name='Fan NDE Enveloping'),0.5,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo2' and p.name='Fan NDE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo2' and p.name='Motor DE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo2' and p.name='Motor DE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo2' and p.name='Motor DE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo2' and p.name='Motor Temperature'),70,50,'demo',systimestamp,'demo',systimestamp);




Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo3' and p.name='Fan DE1 Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo3' and p.name='Fan DE2 Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo3' and p.name='Fan DE2 Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo3' and p.name='Fan DE2 Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo3' and p.name='Fan NDE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo3' and p.name='Fan NDE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo3' and p.name='Fan NDE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo3' and p.name='Motor DE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo3' and p.name='Motor DE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo3' and p.name='Motor DE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo3' and p.name='Motor Temperature'),70,50,'demo',systimestamp,'demo',systimestamp);

commit;



Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo11' and p.name='Fan DE1 Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo11' and p.name='Fan DE2 Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo11' and p.name='Fan DE2 Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo11' and p.name='Fan DE2 Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo11' and p.name='Fan NDE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo11' and p.name='Fan NDE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo11' and p.name='Fan NDE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo11' and p.name='Motor DE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo11' and p.name='Motor DE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo11' and p.name='Motor DE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo11' and p.name='Motor Temperature'),70,50,'demo',systimestamp,'demo',systimestamp);






Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo12' and p.name='Fan DE1 Velocity'),6.1,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo12' and p.name='Fan DE2 Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo12' and p.name='Fan DE2 Enveloping'),0.3,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo12' and p.name='Fan DE2 Velocity'),5.8,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo12' and p.name='Fan NDE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo12' and p.name='Fan NDE Enveloping'),0.5,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo12' and p.name='Fan NDE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo12' and p.name='Motor DE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo12' and p.name='Motor DE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo12' and p.name='Motor DE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo12' and p.name='Motor Temperature'),70,50,'demo',systimestamp,'demo',systimestamp);




Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo13' and p.name='Fan DE1 Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo13' and p.name='Fan DE2 Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo13' and p.name='Fan DE2 Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo13' and p.name='Fan DE2 Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo13' and p.name='Fan NDE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo13' and p.name='Fan NDE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo13' and p.name='Fan NDE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo13' and p.name='Motor DE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo13' and p.name='Motor DE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo13' and p.name='Motor DE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo13' and p.name='Motor Temperature'),70,50,'demo',systimestamp,'demo',systimestamp);

commit;


Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo21' and p.name='Fan DE1 Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo21' and p.name='Fan DE2 Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo21' and p.name='Fan DE2 Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo21' and p.name='Fan DE2 Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo21' and p.name='Fan NDE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo21' and p.name='Fan NDE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo21' and p.name='Fan NDE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo21' and p.name='Motor DE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo21' and p.name='Motor DE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo21' and p.name='Motor DE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo21' and p.name='Motor Temperature'),70,50,'demo',systimestamp,'demo',systimestamp);






Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo22' and p.name='Fan DE1 Velocity'),6.1,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo22' and p.name='Fan DE2 Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo22' and p.name='Fan DE2 Enveloping'),0.3,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo22' and p.name='Fan DE2 Velocity'),5.8,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo22' and p.name='Fan NDE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo22' and p.name='Fan NDE Enveloping'),0.5,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo22' and p.name='Fan NDE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo22' and p.name='Motor DE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo22' and p.name='Motor DE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo22' and p.name='Motor DE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo22' and p.name='Motor Temperature'),70,50,'demo',systimestamp,'demo',systimestamp);




Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo23' and p.name='Fan DE1 Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo23' and p.name='Fan DE2 Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo23' and p.name='Fan DE2 Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo23' and p.name='Fan DE2 Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo23' and p.name='Fan NDE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo23' and p.name='Fan NDE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo23' and p.name='Fan NDE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo23' and p.name='Motor DE Acceleration'),1,0.9,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo23' and p.name='Motor DE Enveloping'),0.2,0.1,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo23' and p.name='Motor DE Velocity'),5.5,5,'demo',systimestamp,'demo',systimestamp);

Insert into TRACE_SPEC_MST_PDM (RAWID,PARAM_MST_RAWID,ALARM_SPEC,WARNING_SPEC,CREATE_BY,CREATE_DTTS,UPDATE_BY,UPDATE_DTTS)
values (seq_trace_spec_mst_pdm.nextval,(select p.rawid from param_mst_pdm p, eqp_mst_pdm e where p.eqp_mst_rawid=e.rawid and e.name='Demo23' and p.name='Motor Temperature'),70,50,'demo',systimestamp,'demo',systimestamp);

commit;