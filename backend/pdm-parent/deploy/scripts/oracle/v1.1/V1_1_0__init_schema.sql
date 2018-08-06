
/*
 HMP v1.1.0
*/


CREATE SEQUENCE seq_code_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_area_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_eqp_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_param_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_parts_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_bearing_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_manual_rpm_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_trace_spec_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_trace_trx_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_trace_raw_trx_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_alarm_trx_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_eqp_alarm_daily_sum_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_trace_daily_sum_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

 CREATE SEQUENCE seq_eqp_event_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_eqp_event_trx_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_param_feature_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_eqp_health_trx_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_param_health_trx_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_param_health_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_param_health_opt_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_health_logic_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_health_logic_opt_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_param_feature_trx_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_alarm_mail_cfg_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_eqp_health_daily_sum_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_param_health_rul_trx_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

CREATE SEQUENCE seq_monitoring_mst_pdm
       INCREMENT BY 1
       NOMINVALUE
       NOMAXVALUE
       CACHE 20
       NOCYCLE
       NOORDER;

-- -----------------------------------------------------
-- Table CODE_MST_PDM
-- -----------------------------------------------------
CREATE TABLE CODE_MST_PDM (
  RAWID         NUMBER(38) NOT NULL,
  CATEGORY      VARCHAR2(32) NOT NULL,
  CODE          VARCHAR2(32) NOT NULL,
  NAME          VARCHAR2(64) NOT NULL,
  USED_YN       CHAR(1) DEFAULT 'Y',
  DEFAULT_YN    CHAR(1) DEFAULT 'N',
  ORDERING      NUMBER(5) NULL,
  DESCRIPTION   VARCHAR2(2048) NULL,
  CREATE_BY     VARCHAR2(32) NULL,
  CREATE_DTTS   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY     VARCHAR2(32) NULL,
  UPDATE_DTTS   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT;

CREATE UNIQUE INDEX PK_CODE_MST_PDM ON CODE_MST_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_CODE_MST_PDM ON CODE_MST_PDM (CATEGORY, CODE, NAME) TABLESPACE NPDM_IDX;


-- -----------------------------------------------------
-- Table AREA_MST_PDM
-- -----------------------------------------------------
CREATE TABLE AREA_MST_PDM (
  RAWID         NUMBER(38) NOT NULL,
  NAME          VARCHAR2(128) NOT NULL,
  DESCRIPTION   VARCHAR2(2048) NULL,
  PARENT_RAWID  NUMBER(38) DEFAULT 0,
  CREATE_BY     VARCHAR2(32) NULL,
  CREATE_DTTS   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY     VARCHAR2(32) NULL,
  UPDATE_DTTS   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT;

CREATE UNIQUE INDEX PK_AREA_MST_PDM ON AREA_MST_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_AREA_MST_PDM ON AREA_MST_PDM (NAME) TABLESPACE NPDM_IDX;


-- -----------------------------------------------------
-- Table EQP_MST_PDM
-- -----------------------------------------------------
CREATE TABLE EQP_MST_PDM (
  RAWID               NUMBER(38) NOT NULL,
  AREA_MST_RAWID      NUMBER(38) NOT NULL,
  NAME                VARCHAR2(128) NOT NULL,
  DATA_TYPE_CD        VARCHAR2(32) DEFAULT 'STD',
  DESCRIPTION         VARCHAR2(2048) NULL,
  IMAGE               BLOB  NULL,
  OFFLINE_YN          CHAR(1) DEFAULT 'N',
  CREATE_BY           VARCHAR2(32) NULL,
  CREATE_DTTS         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY           VARCHAR2(32) NULL,
  UPDATE_DTTS         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT;

CREATE UNIQUE INDEX PK_EQP_MST_PDM ON EQP_MST_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_EQP_MST_PDM ON EQP_MST_PDM (AREA_MST_RAWID, NAME) TABLESPACE NPDM_IDX;


-- -----------------------------------------------------
-- Table BEARING_MST_PDM
-- -----------------------------------------------------
CREATE TABLE BEARING_MST_PDM (
  RAWID           NUMBER(38) NOT NULL,
  MODEL_NUMBER    VARCHAR2(128) NOT NULL,
  MANUFACTURE     VARCHAR2(128) NOT NULL,
  BPFO            NUMBER(8,2) NULL,
  BPFI            NUMBER(8,2) NULL,
  BSF             NUMBER(8,2) NULL,
  FTF             NUMBER(8,2) NULL,
  DESCRIPTION     VARCHAR2(2048) NULL,
  CREATE_BY       VARCHAR2(32) NULL,
  CREATE_DTTS     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY       VARCHAR2(32) NULL,
  UPDATE_DTTS     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT;

CREATE UNIQUE INDEX PK_BEARING_MST_PDM ON BEARING_MST_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_BEARING_MST_PDM ON BEARING_MST_PDM (MODEL_NUMBER, MANUFACTURE) TABLESPACE NPDM_IDX;


-- -----------------------------------------------------
-- Table PARTS_MST_PDM
-- -----------------------------------------------------
CREATE TABLE PARTS_MST_PDM (
  RAWID               NUMBER(38) NOT NULL,
  EQP_MST_RAWID       NUMBER(38) NOT NULL,
  BEARING_MST_RAWID   NUMBER(38) NULL,
  NAME                VARCHAR2(256) NOT NULL,
  PARTS_TYPE_CD       VARCHAR2(32) NOT NULL,
  RPM                 NUMBER(5, 2) NULL,
  RATIO               NUMBER(5, 2) NOT NULL,
  BASE_RATIO_YN       CHAR(1) DEFAULT 'N',
  CREATE_BY           VARCHAR2(32) NULL,
  CREATE_DTTS         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY           VARCHAR2(32) NULL,
  UPDATE_DTTS         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT;

CREATE UNIQUE INDEX PK_PARTS_MST_PDM ON PARTS_MST_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_PARTS_MST_PDM ON PARTS_MST_PDM (EQP_MST_RAWID, NAME) TABLESPACE NPDM_IDX;


-- -----------------------------------------------------
-- Table PARAM_MST_PDM
-- -----------------------------------------------------
CREATE TABLE PARAM_MST_PDM (
  RAWID                       NUMBER(38) NOT NULL,
  EQP_MST_RAWID               NUMBER(38) NOT NULL,
  PARTS_MST_RAWID             NUMBER(38) NULL,
  NAME                        VARCHAR2(256) NOT NULL,
  DESCRIPTION                 VARCHAR2(2048) NULL,
  PARAM_TYPE_CD               VARCHAR2(32) NOT NULL ,
  UNIT_CD                     VARCHAR2(32) NOT NULL,
  PARSE_INDEX                 NUMBER(5, 0) DEFAULT -1,
  USE_YN                      CHAR(1) DEFAULT 'Y',
  CREATE_BY                   VARCHAR2(32) NULL,
  CREATE_DTTS                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY                   VARCHAR2(32) NULL,
  UPDATE_DTTS                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT;

CREATE UNIQUE INDEX PK_PARAM_MST_PDM ON PARAM_MST_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_PARAM_MST_PDM ON PARAM_MST_PDM (EQP_MST_RAWID, NAME) TABLESPACE NPDM_IDX;


-- -----------------------------------------------------
-- Table TRACE_SPEC_MST_PDM
-- -----------------------------------------------------
CREATE TABLE TRACE_SPEC_MST_PDM (
  RAWID                 NUMBER(38) NOT NULL,
  PARAM_MST_RAWID       NUMBER(38) NOT NULL,
  ALARM_SPEC            FLOAT NULL,
  WARNING_SPEC          FLOAT NULL,
  CREATE_BY             VARCHAR2(32) NULL,
  CREATE_DTTS           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY             VARCHAR2(32) NULL,
  UPDATE_DTTS           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT;

CREATE UNIQUE INDEX PK_TRACE_SPEC_MST_PDM ON TRACE_SPEC_MST_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_TRACE_SPEC_MST_PDM ON TRACE_SPEC_MST_PDM (PARAM_MST_RAWID) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table TRACE_TRX_PDM
-- -----------------------------------------------------
CREATE TABLE TRACE_TRX_PDM (
  RAWID                 NUMBER(38) NOT NULL,
  PARAM_MST_RAWID       NUMBER(38) NOT NULL,
  VALUE                 FLOAT NOT NULL,
  ALARM_SPEC            FLOAT NULL,
  WARNING_SPEC          FLOAT NULL,
  STATUS_CD             CHAR(1),
  RPM                   NUMBER(5,2),
  EVENT_DTTS            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  RESERVED_COL1         VARCHAR2(1024) NULL,
  RESERVED_COL2         VARCHAR2(1024) NULL,
  RESERVED_COL3         VARCHAR2(1024) NULL,
  RESERVED_COL4         VARCHAR2(1024) NULL,
  RESERVED_COL5         VARCHAR2(1024) NULL
)
TABLESPACE NPDM_DAT
PARTITION BY RANGE (EVENT_DTTS)
   (PARTITION P_201712 VALUES LESS THAN (to_timestamp('201801', 'YYYYMM')),
  PARTITION P_201801 VALUES LESS THAN (to_timestamp('201802', 'YYYYMM')),
  PARTITION P_201802 VALUES LESS THAN (to_timestamp('201803', 'YYYYMM')),
  PARTITION P_201803 VALUES LESS THAN (to_timestamp('201804', 'YYYYMM')),
  PARTITION P_201804 VALUES LESS THAN (to_timestamp('201805', 'YYYYMM')),
  PARTITION P_201805 VALUES LESS THAN (to_timestamp('201806', 'YYYYMM')),
  PARTITION P_201806 VALUES LESS THAN (to_timestamp('201807', 'YYYYMM')),
  PARTITION P_201807 VALUES LESS THAN (to_timestamp('201808', 'YYYYMM')),
  PARTITION P_201808 VALUES LESS THAN (to_timestamp('201809', 'YYYYMM')),
  PARTITION P_201809 VALUES LESS THAN (to_timestamp('201810', 'YYYYMM')),
  PARTITION P_201810 VALUES LESS THAN (to_timestamp('201811', 'YYYYMM')));

CREATE UNIQUE INDEX PK_TRACE_TRX_PDM ON TRACE_TRX_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_TRACE_TRX_PDM ON TRACE_TRX_PDM (EVENT_DTTS, PARAM_MST_RAWID) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table TRACE_RAW_TRX_PDM
-- -----------------------------------------------------
CREATE TABLE TRACE_RAW_TRX_PDM (
  RAWID             NUMBER(38) NOT NULL,
  PARAM_MST_RAWID   NUMBER(38) NOT NULL,
  TRACE_TRX_RAWID   NUMBER(38) NOT NULL,
  DATA_TYPE_CD      VARCHAR2(32) NOT NULL,
  MAX_FREQ          INT NULL,
  FREQ_COUNT        INT NULL,
  RPM               NUMBER(5, 2) NULL,
  SAMPLING_TIME     FLOAT NULL,
  BINARY_DATA       BLOB NULL,
  EVENT_DTTS        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  RESERVED_COL1     VARCHAR2(1024) NULL,
  RESERVED_COL2     VARCHAR2(1024) NULL,
  RESERVED_COL3     VARCHAR2(1024) NULL,
  RESERVED_COL4     VARCHAR2(1024) NULL,
  RESERVED_COL5     VARCHAR2(1024) NULL
)
TABLESPACE NPDM_DAT
PARTITION BY RANGE (EVENT_DTTS)
   (PARTITION P_201712 VALUES LESS THAN (to_timestamp('201801', 'YYYYMM')),
    PARTITION P_201801 VALUES LESS THAN (to_timestamp('201802', 'YYYYMM')),
    PARTITION P_201802 VALUES LESS THAN (to_timestamp('201803', 'YYYYMM')),
    PARTITION P_201803 VALUES LESS THAN (to_timestamp('201804', 'YYYYMM')),
    PARTITION P_201804 VALUES LESS THAN (to_timestamp('201805', 'YYYYMM')),
    PARTITION P_201805 VALUES LESS THAN (to_timestamp('201806', 'YYYYMM')),
    PARTITION P_201806 VALUES LESS THAN (to_timestamp('201807', 'YYYYMM')),
    PARTITION P_201807 VALUES LESS THAN (to_timestamp('201808', 'YYYYMM')),
    PARTITION P_201808 VALUES LESS THAN (to_timestamp('201809', 'YYYYMM')),
    PARTITION P_201809 VALUES LESS THAN (to_timestamp('201810', 'YYYYMM')),
    PARTITION P_201810 VALUES LESS THAN (to_timestamp('201811', 'YYYYMM')));

CREATE UNIQUE INDEX PK_TRACE_RAW_TRX_PDM ON TRACE_RAW_TRX_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_TRACE_RAW_TRX_PDM ON TRACE_RAW_TRX_PDM (EVENT_DTTS, PARAM_MST_RAWID, TRACE_TRX_RAWID, DATA_TYPE_CD) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table PARAM_ALARM_TRX_PDM
-- -----------------------------------------------------
CREATE TABLE ALARM_TRX_PDM (
  RAWID                   NUMBER(38) NOT NULL,
  PARAM_MST_RAWID         NUMBER(38) NOT NULL,
  PARAM_HEALTH_MST_RAWID  NUMBER(38) NOT NULL,
  ALARM_TYPE_CD           CHAR(1) NOT NULL,
  VALUE                   FLOAT NOT NULL,
  FAULT_CLASS             VARCHAR2(1024 BYTE) DEFAULT 'N/A',
  ALARM_SPEC              FLOAT NULL,
  WARNING_SPEC            FLOAT NULL,
  ALARM_DTTS              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT
PARTITION BY RANGE (ALARM_DTTS)
   (PARTITION P_201801 VALUES LESS THAN (to_timestamp('201802', 'YYYYMM')),
    PARTITION P_201802 VALUES LESS THAN (to_timestamp('201803', 'YYYYMM')),
    PARTITION P_201803 VALUES LESS THAN (to_timestamp('201804', 'YYYYMM')),
    PARTITION P_201804 VALUES LESS THAN (to_timestamp('201805', 'YYYYMM')),
    PARTITION P_201805 VALUES LESS THAN (to_timestamp('201806', 'YYYYMM')),
    PARTITION P_201806 VALUES LESS THAN (to_timestamp('201807', 'YYYYMM')),
    PARTITION P_201807 VALUES LESS THAN (to_timestamp('201808', 'YYYYMM')),
    PARTITION P_201808 VALUES LESS THAN (to_timestamp('201809', 'YYYYMM')),
    PARTITION P_201809 VALUES LESS THAN (to_timestamp('201810', 'YYYYMM')),
    PARTITION P_201810 VALUES LESS THAN (to_timestamp('201811', 'YYYYMM')),
    PARTITION P_201811 VALUES LESS THAN (to_timestamp('201812', 'YYYYMM')));

CREATE UNIQUE INDEX PK_ALARM_TRX_PDM ON ALARM_TRX_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_ALARM_TRX_PDM ON ALARM_TRX_PDM (ALARM_DTTS, PARAM_MST_RAWID, PARAM_HEALTH_MST_RAWID) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table EQP_EVENT_MST_PDM
-- -----------------------------------------------------
CREATE TABLE EQP_EVENT_MST_PDM (
  RAWID             NUMBER(38) NOT NULL,
  EQP_MST_RAWID     NUMBER(38) NOT NULL,
  EVENT_GROUP       VARCHAR(64),
  EVENT_NAME        VARCHAR2(128) NOT NULL,
  EVENT_TYPE_CD     CHAR(1),
  PROCESS_YN        CHAR(1) DEFAULT 'N',
  PARAM_MST_RAWID   NUMBER(38) NULL,
  CONDITION         VARCHAR2(4000),
  TIME_INTERVAL_YN  CHAR(1) DEFAULT 'N',
  INTERVAL_TIME_MS  NUMBER(38) DEFAULT 3600000,
  CREATE_BY         VARCHAR2(32) NULL,
  CREATE_DTTS       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY         VARCHAR2(32) NULL,
  UPDATE_DTTS       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT;

CREATE UNIQUE INDEX PK_EQP_EVENT_MST_PDM ON EQP_EVENT_MST_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_EQP_EVENT_MST_PDM ON EQP_EVENT_MST_PDM (EQP_MST_RAWID, EVENT_NAME, EVENT_TYPE_CD) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table EQP_EVENT_TRX_PDM
-- -----------------------------------------------------
CREATE TABLE EQP_EVENT_TRX_PDM (
  RAWID                   NUMBER(38) NOT NULL,
  EQP_EVENT_MST_RAWID     NUMBER(38) NOT NULL,
  EVENT_TYPE_CD           CHAR(1),
  EVENT_DTTS              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT
PARTITION BY RANGE (EVENT_DTTS)
   (PARTITION P_201712 VALUES LESS THAN (to_timestamp('201801', 'YYYYMM')),
    PARTITION P_201801 VALUES LESS THAN (to_timestamp('201802', 'YYYYMM')),
    PARTITION P_201802 VALUES LESS THAN (to_timestamp('201803', 'YYYYMM')),
    PARTITION P_201803 VALUES LESS THAN (to_timestamp('201804', 'YYYYMM')),
    PARTITION P_201804 VALUES LESS THAN (to_timestamp('201805', 'YYYYMM')),
    PARTITION P_201805 VALUES LESS THAN (to_timestamp('201806', 'YYYYMM')),
    PARTITION P_201806 VALUES LESS THAN (to_timestamp('201807', 'YYYYMM')),
    PARTITION P_201807 VALUES LESS THAN (to_timestamp('201808', 'YYYYMM')),
    PARTITION P_201808 VALUES LESS THAN (to_timestamp('201809', 'YYYYMM')),
    PARTITION P_201809 VALUES LESS THAN (to_timestamp('201810', 'YYYYMM')),
    PARTITION P_201810 VALUES LESS THAN (to_timestamp('201811', 'YYYYMM')));

CREATE UNIQUE INDEX PK_EQP_EVENT_TRX_PDM ON EQP_EVENT_TRX_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_EQP_EVENT_TRX_PDM ON EQP_EVENT_TRX_PDM (EVENT_DTTS, EQP_EVENT_MST_RAWID) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table PARAM_FEATURE_TRX_PDM
-- -----------------------------------------------------
CREATE TABLE PARAM_FEATURE_TRX_PDM (
  RAWID                 NUMBER(38) NOT NULL,
  PARAM_MST_RAWID       NUMBER(38) NOT NULL,
  BEGIN_DTTS            TIMESTAMP NOT NULL,
  END_DTTS              TIMESTAMP NOT NULL,
  COUNT                 NUMBER(12,0) NULL,
  MIN                   FLOAT NULL,
  MAX                   FLOAT NULL,
  MEDIAN                FLOAT NULL,
  MEAN                  FLOAT NULL,
  STDDEV                FLOAT NULL,
  Q1                    FLOAT NULL,
  Q3                    FLOAT NULL,
  UPPER_ALARM_SPEC      FLOAT NULL,
  UPPER_WARNING_SPEC    FLOAT NULL,
  TARGET                FLOAT NULL,
  LOWER_ALARM_SPEC      FLOAT NULL,
  LOWER_WARNING_SPEC    FLOAT NULL
)
TABLESPACE NPDM_DAT
PARTITION BY RANGE (END_DTTS)
   (PARTITION P_201712 VALUES LESS THAN (to_timestamp('201801', 'YYYYMM')),
    PARTITION P_201801 VALUES LESS THAN (to_timestamp('201802', 'YYYYMM')),
    PARTITION P_201802 VALUES LESS THAN (to_timestamp('201803', 'YYYYMM')),
    PARTITION P_201803 VALUES LESS THAN (to_timestamp('201804', 'YYYYMM')),
    PARTITION P_201804 VALUES LESS THAN (to_timestamp('201805', 'YYYYMM')),
    PARTITION P_201805 VALUES LESS THAN (to_timestamp('201806', 'YYYYMM')),
    PARTITION P_201806 VALUES LESS THAN (to_timestamp('201807', 'YYYYMM')),
    PARTITION P_201807 VALUES LESS THAN (to_timestamp('201808', 'YYYYMM')),
    PARTITION P_201808 VALUES LESS THAN (to_timestamp('201809', 'YYYYMM')),
    PARTITION P_201809 VALUES LESS THAN (to_timestamp('201810', 'YYYYMM')),
    PARTITION P_201810 VALUES LESS THAN (to_timestamp('201811', 'YYYYMM')));


CREATE UNIQUE INDEX PK_PARAM_FEATURE_TRX_PDM ON PARAM_FEATURE_TRX_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_PARAM_FEATURE_TRX_PDM ON PARAM_FEATURE_TRX_PDM (END_DTTS, PARAM_MST_RAWID) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table EQP_HEALTH_TRX_PDM
-- -----------------------------------------------------
CREATE TABLE EQP_HEALTH_TRX_PDM (
  RAWID                   NUMBER(38) NOT NULL,
  EQP_MST_RAWID           NUMBER(38) NOT NULL,
  PARAM_HEALTH_MST_RAWID  NUMBER(38) NOT NULL,
  STATUS_CD               CHAR(1) NOT NULL,
  DATA_COUNT              NUMBER(10) NULL,
  SCORE                   FLOAT NOT NULL,
  ALARM_DTTS              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT
PARTITION BY RANGE (ALARM_DTTS)
   (PARTITION P_201712 VALUES LESS THAN (to_timestamp('201801', 'YYYYMM')),
    PARTITION P_201801 VALUES LESS THAN (to_timestamp('201802', 'YYYYMM')),
    PARTITION P_201802 VALUES LESS THAN (to_timestamp('201803', 'YYYYMM')),
    PARTITION P_201803 VALUES LESS THAN (to_timestamp('201804', 'YYYYMM')),
    PARTITION P_201804 VALUES LESS THAN (to_timestamp('201805', 'YYYYMM')),
    PARTITION P_201805 VALUES LESS THAN (to_timestamp('201806', 'YYYYMM')),
    PARTITION P_201806 VALUES LESS THAN (to_timestamp('201807', 'YYYYMM')),
    PARTITION P_201807 VALUES LESS THAN (to_timestamp('201808', 'YYYYMM')),
    PARTITION P_201808 VALUES LESS THAN (to_timestamp('201809', 'YYYYMM')),
    PARTITION P_201809 VALUES LESS THAN (to_timestamp('201810', 'YYYYMM')),
    PARTITION P_201810 VALUES LESS THAN (to_timestamp('201811', 'YYYYMM')));

CREATE UNIQUE INDEX PK_EQP_HEALTH_TRX_PDM ON EQP_HEALTH_TRX_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_EQP_HEALTH_TRX_PDM ON EQP_HEALTH_TRX_PDM (ALARM_DTTS, EQP_MST_RAWID) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table PARAM_HEALTH_TRX_PDM
-- -----------------------------------------------------
CREATE TABLE PARAM_HEALTH_TRX_PDM (
  RAWID                   NUMBER(38) NOT NULL,
  PARAM_MST_RAWID         NUMBER(38) NOT NULL,
  PARAM_HEALTH_MST_RAWID  NUMBER(38) NOT NULL,
  STATUS_CD               CHAR(1) NOT NULL,
  DATA_COUNT              NUMBER(10) NULL,
  SCORE                   FLOAT NOT NULL,
  UPPER_ALARM_SPEC        FLOAT NULL,
  UPPER_WARNING_SPEC      FLOAT NULL,
  TARGET                  FLOAT NULL,
  LOWER_ALARM_SPEC        FLOAT NULL,
  LOWER_WARNING_SPEC      FLOAT NULL,
  CREATE_DTTS              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT
PARTITION BY RANGE (CREATE_DTTS)
   (PARTITION P_201712 VALUES LESS THAN (to_timestamp('201801', 'YYYYMM')),
    PARTITION P_201801 VALUES LESS THAN (to_timestamp('201802', 'YYYYMM')),
    PARTITION P_201802 VALUES LESS THAN (to_timestamp('201803', 'YYYYMM')),
    PARTITION P_201803 VALUES LESS THAN (to_timestamp('201804', 'YYYYMM')),
    PARTITION P_201804 VALUES LESS THAN (to_timestamp('201805', 'YYYYMM')),
    PARTITION P_201805 VALUES LESS THAN (to_timestamp('201806', 'YYYYMM')),
    PARTITION P_201806 VALUES LESS THAN (to_timestamp('201807', 'YYYYMM')),
    PARTITION P_201807 VALUES LESS THAN (to_timestamp('201808', 'YYYYMM')),
    PARTITION P_201808 VALUES LESS THAN (to_timestamp('201809', 'YYYYMM')),
    PARTITION P_201809 VALUES LESS THAN (to_timestamp('201810', 'YYYYMM')),
    PARTITION P_201810 VALUES LESS THAN (to_timestamp('201811', 'YYYYMM')));

CREATE UNIQUE INDEX PK_PARAM_HEALTH_TRX_PDM ON PARAM_HEALTH_TRX_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_PARAM_HEALTH_TRX_PDM ON PARAM_HEALTH_TRX_PDM (CREATE_DTTS, PARAM_MST_RAWID, PARAM_HEALTH_MST_RAWID) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table PARAM_HEALTH_MST_PDM
-- -----------------------------------------------------
CREATE TABLE PARAM_HEALTH_MST_PDM (
  RAWID                         NUMBER(38) NOT NULL,
  PARAM_MST_RAWID               NUMBER(38) NOT NULL,
  HEALTH_LOGIC_MST_RAWID        NUMBER(38) NOT NULL,
  APPLY_LOGIC_YN                CHAR(1) DEFAULT 'Y',
  CREATE_BY                     VARCHAR2(32) NULL,
  CREATE_DTTS                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY                     VARCHAR2(32) NULL,
  UPDATE_DTTS                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT;

CREATE UNIQUE INDEX PK_PARAM_HEALTH_MST_PDM ON PARAM_HEALTH_MST_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_PARAM_HEALTH_MST_PDM ON PARAM_HEALTH_MST_PDM (PARAM_MST_RAWID, HEALTH_LOGIC_MST_RAWID) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table PARAM_HEALTH_OPTION_MST_PDM
-- -----------------------------------------------------
CREATE TABLE PARAM_HEALTH_OPTION_MST_PDM (
  RAWID                   NUMBER(38) NOT NULL,
  PARAM_HEALTH_MST_RAWID  NUMBER(38) NOT NULL,
  OPTION_NAME             VARCHAR2(32) NOT NULL,
  OPTION_VALUE            FLOAT NOT NULL,
  DESCRIPTION             VARCHAR2(2048) NULL,
  CREATE_BY               VARCHAR2(32) NULL,
  CREATE_DTTS             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY               VARCHAR2(32) NULL,
  UPDATE_DTTS             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT;

CREATE UNIQUE INDEX PK_PARAM_HEALTH_OPTION_MST_PDM ON PARAM_HEALTH_OPTION_MST_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_PARAM_HEALTH_OPTION_MST_PDM ON PARAM_HEALTH_OPTION_MST_PDM (PARAM_HEALTH_MST_RAWID, OPTION_NAME) TABLESPACE NPDM_IDX;


-- -----------------------------------------------------
-- Table HEALTH_LOGIC_MST_PDM
-- -----------------------------------------------------
CREATE TABLE HEALTH_LOGIC_MST_PDM (
  RAWID               NUMBER(38) NOT NULL,
  CATEGORY            VARCHAR2(32) NOT NULL,
  CODE                VARCHAR2(32) NOT NULL,
  NAME                VARCHAR2(128) NOT NULL,
  ALARM_CONDITION     VARCHAR2(1024),
  WARNING_CONDITION   VARCHAR2(1024),
  DESCRIPTION         VARCHAR2(2048) NULL,
  CREATE_BY           VARCHAR2(32) NULL,
  CREATE_DTTS         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY           VARCHAR2(32) NULL,
  UPDATE_DTTS         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT;

CREATE UNIQUE INDEX PK_HEALTH_LOGIC_MST_PDM ON HEALTH_LOGIC_MST_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_HEALTH_LOGIC_MST_PDM ON HEALTH_LOGIC_MST_PDM (CATEGORY, CODE) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table HEALTH_LOGIC_OPTION_MST_PDM
-- -----------------------------------------------------
CREATE TABLE HEALTH_LOGIC_OPTION_MST_PDM (
  RAWID                   NUMBER(38) NOT NULL,
  HEALTH_LOGIC_MST_RAWID  NUMBER(38) NOT NULL,
  OPTION_NAME             VARCHAR2(32) NOT NULL,
  OPTION_VALUE            FLOAT NOT NULL,
  DESCRIPTION             VARCHAR2(2048) NULL,
  CREATE_BY               VARCHAR2(32) NULL,
  CREATE_DTTS             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY               VARCHAR2(32) NULL,
  UPDATE_DTTS             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT;

CREATE UNIQUE INDEX PK_HEALTH_LOGIC_OPTION_MST_PDM ON HEALTH_LOGIC_OPTION_MST_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_HEALTH_LOGIC_OPTION_MST_PDM ON HEALTH_LOGIC_OPTION_MST_PDM (HEALTH_LOGIC_MST_RAWID, OPTION_NAME) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table ALARM_SMTP_CFG_PDM
-- -----------------------------------------------------
CREATE TABLE ALARM_SMTP_CFG_PDM (
  HOST              VARCHAR2(1024) NOT NULL,
  PORT              NUMBER(10,0) NOT NULL,
  USER_ID           VARCHAR2(64) NOT NULL,
  PASSWORD          VARCHAR2(1024) NOT NULL,
  SSL               CHAR(1) DEFAULT 'Y',
  FROM_ADDR         VARCHAR2(1024) NOT NULL,
  TO_ADDR           VARCHAR2(2048) NOT NULL,
  DESCRIPTION       VARCHAR2(2048) NULL,
  CREATE_BY         VARCHAR2(32) NULL,
  CREATE_DTTS       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY         VARCHAR2(32) NULL,
  UPDATE_DTTS       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT;


CREATE TABLE MANUAL_RPM_MST_PDM
(
    RAWID           NUMBER(10)      NOT NULL,
    PARAM_MST_RAWID NUMBER(10)      NOT NULL,
    RPM             NUMBER(5,2)     NULL,
    CREATE_BY       VARCHAR(32)     NULL,
	CREATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
	UPDATE_BY       VARCHAR(32)     NULL,
	UPDATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT;

CREATE UNIQUE INDEX PK_MANUAL_RPM_MST_PDM ON MANUAL_RPM_MST_PDM (RAWID)	TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_MANUAL_RPM_MST_PDM ON MANUAL_RPM_MST_PDM (PARAM_MST_RAWID) TABLESPACE NPDM_IDX;


-- -----------------------------------------------------
-- Table TRACE_DAILY_SUM_PDM
-- -----------------------------------------------------
CREATE TABLE TRACE_DAILY_SUM_PDM (
  RAWID                 NUMBER(38) NOT NULL,
  PARAM_MST_RAWID       NUMBER(38) NOT NULL,
  ALARM_SPEC            FLOAT NULL,
  WARNING_SPEC          FLOAT NULL,
  AVG_PERIOD            FLOAT,
  AVG_DAILY             FLOAT,
  AVG_OOS               FLOAT,
  VARIATION             FLOAT,
  CAUSE                 VARCHAR2(2048 BYTE),
  SUM_DTTS              TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  CREATE_BY             VARCHAR2(32) NULL,
  CREATE_DTTS           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT
PARTITION BY RANGE (SUM_DTTS)
   (PARTITION P_201801 VALUES LESS THAN (to_timestamp('201802', 'YYYYMM')),
    PARTITION P_201802 VALUES LESS THAN (to_timestamp('201803', 'YYYYMM')),
    PARTITION P_201803 VALUES LESS THAN (to_timestamp('201804', 'YYYYMM')),
    PARTITION P_201804 VALUES LESS THAN (to_timestamp('201805', 'YYYYMM')),
    PARTITION P_201805 VALUES LESS THAN (to_timestamp('201806', 'YYYYMM')),
    PARTITION P_201806 VALUES LESS THAN (to_timestamp('201807', 'YYYYMM')),
    PARTITION P_201807 VALUES LESS THAN (to_timestamp('201808', 'YYYYMM')),
    PARTITION P_201808 VALUES LESS THAN (to_timestamp('201809', 'YYYYMM')),
    PARTITION P_201809 VALUES LESS THAN (to_timestamp('201810', 'YYYYMM')),
    PARTITION P_201810 VALUES LESS THAN (to_timestamp('201811', 'YYYYMM')),
    PARTITION P_201811 VALUES LESS THAN (to_timestamp('201812', 'YYYYMM')));

CREATE UNIQUE INDEX PK_TRACE_DAILY_SUM_PDM ON TRACE_DAILY_SUM_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_TRACE_DAILY_SUM_PDM ON TRACE_DAILY_SUM_PDM (SUM_DTTS, PARAM_MST_RAWID) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table EQP_ALARM_DAILY_SUM_PDM
-- -----------------------------------------------------
CREATE TABLE EQP_ALARM_DAILY_SUM_PDM (
  RAWID           NUMBER(38) NOT NULL,
  EQP_MST_RAWID   NUMBER(38) NOT NULL,
  STATUS_CD   CHAR(1) NOT NULL,
  VALUE           FLOAT NULL,
  SUM_DTTS        TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  CREATE_BY       VARCHAR2(32) NULL,
  CREATE_DTTS     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT
PARTITION BY RANGE (SUM_DTTS)
   (PARTITION P_201801 VALUES LESS THAN (to_timestamp('201802', 'YYYYMM')),
    PARTITION P_201802 VALUES LESS THAN (to_timestamp('201803', 'YYYYMM')),
    PARTITION P_201803 VALUES LESS THAN (to_timestamp('201804', 'YYYYMM')),
    PARTITION P_201804 VALUES LESS THAN (to_timestamp('201805', 'YYYYMM')),
    PARTITION P_201805 VALUES LESS THAN (to_timestamp('201806', 'YYYYMM')),
    PARTITION P_201806 VALUES LESS THAN (to_timestamp('201807', 'YYYYMM')),
    PARTITION P_201807 VALUES LESS THAN (to_timestamp('201808', 'YYYYMM')),
    PARTITION P_201808 VALUES LESS THAN (to_timestamp('201809', 'YYYYMM')),
    PARTITION P_201809 VALUES LESS THAN (to_timestamp('201810', 'YYYYMM')),
    PARTITION P_201810 VALUES LESS THAN (to_timestamp('201811', 'YYYYMM')),
    PARTITION P_201811 VALUES LESS THAN (to_timestamp('201812', 'YYYYMM')));

CREATE UNIQUE INDEX PK_EQP_ALARM_DAILY_SUM_PDM ON EQP_ALARM_DAILY_SUM_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_EQP_ALARM_DAILY_SUM_PDM ON EQP_ALARM_DAILY_SUM_PDM (SUM_DTTS, EQP_MST_RAWID, ALARM_TYPE_CD) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table EQP_HEALTH_DAILY_SUM_PDM
-- -----------------------------------------------------
CREATE TABLE EQP_HEALTH_DAILY_SUM_PDM (
  RAWID                   NUMBER(38) NOT NULL,
  EQP_MST_RAWID           NUMBER(38) NOT NULL,
  PARAM_HEALTH_MST_RAWID  NUMBER(38) NOT NULL,
  SCORE                   FLOAT NULL,
  ALARM_COUNT             NUMBER(10, 0) NULL,
  SUM_DTTS                TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
  CREATE_BY               VARCHAR2(32) NULL,
  CREATE_DTTS             TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT
PARTITION BY RANGE (SUM_DTTS)
   (PARTITION P_201801 VALUES LESS THAN (to_timestamp('201802', 'YYYYMM')),
    PARTITION P_201802 VALUES LESS THAN (to_timestamp('201803', 'YYYYMM')),
    PARTITION P_201803 VALUES LESS THAN (to_timestamp('201804', 'YYYYMM')),
    PARTITION P_201804 VALUES LESS THAN (to_timestamp('201805', 'YYYYMM')),
    PARTITION P_201805 VALUES LESS THAN (to_timestamp('201806', 'YYYYMM')),
    PARTITION P_201806 VALUES LESS THAN (to_timestamp('201807', 'YYYYMM')),
    PARTITION P_201807 VALUES LESS THAN (to_timestamp('201808', 'YYYYMM')),
    PARTITION P_201808 VALUES LESS THAN (to_timestamp('201809', 'YYYYMM')),
    PARTITION P_201809 VALUES LESS THAN (to_timestamp('201810', 'YYYYMM')),
    PARTITION P_201810 VALUES LESS THAN (to_timestamp('201811', 'YYYYMM')),
    PARTITION P_201811 VALUES LESS THAN (to_timestamp('201812', 'YYYYMM')));

CREATE UNIQUE INDEX PK_EQP_HEALTH_DAILY_SUM_PDM ON EQP_HEALTH_DAILY_SUM_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_EQP_HEALTH_DAILY_SUM_PDM ON EQP_HEALTH_DAILY_SUM_PDM (SUM_DTTS, EQP_MST_RAWID, PARAM_HEALTH_MST_RAWID) TABLESPACE NPDM_IDX;

-- -----------------------------------------------------
-- Table PARAM_HEALTH_RUL_TRX_PDM
-- -----------------------------------------------------

CREATE TABLE PARAM_HEALTH_RUL_TRX_PDM (
  RAWID                   NUMBER(38) NOT NULL,
  PARAM_HEALTH_TRX_RAWID  NUMBER(38) NOT NULL,
  INTERCEPT               FLOAT NULL,
  SLOPE                   FLOAT NULL,
  XVALUE                  FLOAT NULL,
  CREATE_DTTS              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
TABLESPACE NPDM_DAT
PARTITION BY RANGE (CREATE_DTTS)
   (PARTITION P_201712 VALUES LESS THAN (to_timestamp('201801', 'YYYYMM')),
    PARTITION P_201801 VALUES LESS THAN (to_timestamp('201802', 'YYYYMM')),
    PARTITION P_201802 VALUES LESS THAN (to_timestamp('201803', 'YYYYMM')),
    PARTITION P_201803 VALUES LESS THAN (to_timestamp('201804', 'YYYYMM')),
    PARTITION P_201804 VALUES LESS THAN (to_timestamp('201805', 'YYYYMM')),
    PARTITION P_201805 VALUES LESS THAN (to_timestamp('201806', 'YYYYMM')),
    PARTITION P_201806 VALUES LESS THAN (to_timestamp('201807', 'YYYYMM')),
    PARTITION P_201807 VALUES LESS THAN (to_timestamp('201808', 'YYYYMM')),
    PARTITION P_201808 VALUES LESS THAN (to_timestamp('201809', 'YYYYMM')),
    PARTITION P_201809 VALUES LESS THAN (to_timestamp('201810', 'YYYYMM')),
    PARTITION P_201810 VALUES LESS THAN (to_timestamp('201811', 'YYYYMM')));

CREATE UNIQUE INDEX PK_PARAM_HEALTH_RUL_TRX_PDM ON PARAM_HEALTH_RUL_TRX_PDM (RAWID) TABLESPACE NPDM_IDX;
CREATE UNIQUE INDEX UK_PARAM_HEALTH_RUL_TRX_PDM ON PARAM_HEALTH_RUL_TRX_PDM (CREATE_DTTS, PARAM_HEALTH_TRX_RAWID) TABLESPACE NPDM_IDX;


<<<<<<< HEAD
-- -----------------------------------------------------
-- Table BATCH_JOB_HST_PDM
-- -----------------------------------------------------

  CREATE TABLE BATCH_JOB_HST_PDM
   (	"JOB_DTTS" TIMESTAMP (6) NOT NULL ENABLE, 
	"EQP_ID" NUMBER(10,0), 
	"JOB_CD" VARCHAR2(32 BYTE) NOT NULL ENABLE, 
	"JOB_STATUS_CD" VARCHAR2(32 BYTE), 
	"JOB_TYPE_CD" VARCHAR2(32 BYTE), 
	"UPDATE_DTTS" TIMESTAMP (6), 
	"UPDATE_BY" VARCHAR2(50 BYTE)
   )
  TABLESPACE NPDM_DAT ;
  
  create unique index UK_BATCH_JOB_HST_PDM ON BATCH_JOB_HST_PDM (JOB_DTTS, JOB_CD) TABLESPACE NPDM_IDX;
  
--CREATE TABLE RULE_WINDOW_TRX_PDM (
--  RAWID                   NUMBER(38) NOT NULL,
--  PARAM_MST_RAWID         NUMBER(38) NOT NULL,
--  START_WINDOW            NUMBER(38) NULL,
--  END_WINDOW              NUMBER(38) NULL,
--  ALARM_DTTS              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--)
--TABLESPACE NPDM_DAT
--PARTITION BY RANGE (ALARM_DTTS)
--   (PARTITION P_201801 VALUES LESS THAN (to_timestamp('201802', 'YYYYMM')),
--    PARTITION P_201802 VALUES LESS THAN (to_timestamp('201803', 'YYYYMM')),
--    PARTITION P_201803 VALUES LESS THAN (to_timestamp('201804', 'YYYYMM')),
--    PARTITION P_201804 VALUES LESS THAN (to_timestamp('201805', 'YYYYMM')),
--    PARTITION P_201805 VALUES LESS THAN (to_timestamp('201806', 'YYYYMM')),
--    PARTITION P_201806 VALUES LESS THAN (to_timestamp('201807', 'YYYYMM')),
--    PARTITION P_201807 VALUES LESS THAN (to_timestamp('201808', 'YYYYMM')),
--    PARTITION P_201808 VALUES LESS THAN (to_timestamp('201809', 'YYYYMM')),
--    PARTITION P_201809 VALUES LESS THAN (to_timestamp('201810', 'YYYYMM')),
--    PARTITION P_201810 VALUES LESS THAN (to_timestamp('201811', 'YYYYMM')),
--    PARTITION P_201811 VALUES LESS THAN (to_timestamp('201812', 'YYYYMM')));
--
--
--CREATE UNIQUE INDEX PK_RULE_WINDOW_TRX_PDM ON RULE_WINDOW_TRX_PDM (RAWID) TABLESPACE NPDM_IDX;
--CREATE UNIQUE INDEX UK_RULE_WINDOW_TRX_PDM ON RULE_WINDOW_TRX_PDM (ALARM_DTTS, PARAM_MST_RAWID) TABLESPACE NPDM_IDX;
=======

CREATE TABLE MONITORING_MST_PDM
   (
    RAWID         NUMBER(38) NOT NULL ENABLE,
	NAME          VARCHAR2(256 BYTE) NOT NULL ENABLE,
	IMAGE         CLOB,
	DATAS         CLOB,
	WIDTH         NUMBER(10,0) NOT NULL ENABLE,
	HEIGHT        NUMBER(10,0) NOT NULL ENABLE,
	CREATE_BY     VARCHAR2(32 BYTE),
	CREATE_DTTS   TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP,
	UPDATE_BY     VARCHAR2(32 BYTE),
	UPDATE_DTTS   TIMESTAMP (6) DEFAULT CURRENT_TIMESTAMP
   )
  TABLESPACE NPDM_DAT;

  CREATE UNIQUE INDEX PK_MONITORING_MST_PDM ON MONITORING_MST_PDM (RAWID) TABLESPACE NPDM_IDX;
  CREATE UNIQUE INDEX UK_MONITORING_MST_PDM ON MONITORING_MST_PDM (NAME) TABLESPACE NPDM_IDX;

>>>>>>> 1bc62e5... configurable logics

