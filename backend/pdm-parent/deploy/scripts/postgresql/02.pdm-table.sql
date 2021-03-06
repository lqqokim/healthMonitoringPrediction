
/*
    sequence
*/

CREATE SEQUENCE seq_code_mst_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


CREATE SEQUENCE seq_area_mst_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


CREATE SEQUENCE seq_eqp_mst_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


CREATE SEQUENCE seq_param_mst_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE SEQUENCE seq_parts_mst_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE SEQUENCE seq_bearing_mst_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE SEQUENCE seq_manual_rpm_mst_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE SEQUENCE seq_trace_spec_mst_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE SEQUENCE seq_trace_trx_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE SEQUENCE seq_trace_raw_trx_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE SEQUENCE seq_alarm_trx_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE SEQUENCE seq_eqp_alarm_daily_sum_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE SEQUENCE seq_trace_daily_sum_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

/*
    tables
*/


-- drop table ALARM_TRX_PDM cascade constraints PURGE;
-- drop table AREA_MST_PDM cascade constraints PURGE;
-- drop table BEARING_MST_PDM cascade constraints PURGE;
-- drop table CODE_MST_PDM cascade constraints PURGE;
-- drop table EQP_ALARM_DAILY_SUM_PDM cascade constraints PURGE;
-- drop table EQP_MST_PDM cascade constraints PURGE;
-- drop table MANUAL_RPM_MST_PDM cascade constraints PURGE;
-- drop table PARAM_MST_PDM cascade constraints PURGE;
-- drop table PARTS_MST_PDM cascade constraints PURGE;
-- drop table TRACE_DAILY_SUM_PDM cascade constraints PURGE;
-- drop table TRACE_RAW_TRX_PDM cascade constraints PURGE;
-- drop table TRACE_SPEC_MST_PDM cascade constraints PURGE;
-- drop table TRACE_TRX_PDM cascade constraints PURGE;


CREATE TABLE CODE_MST_PDM
(
    RAWID           INTEGER         NOT NULL DEFAULT nextval('seq_code_mst_pdm'),
    CATEGORY        VARCHAR(32)     NOT NULL,
    CODE            VARCHAR(32)     NOT NULL,
    NAME            VARCHAR(64)     NOT NULL,
    USED_YN         CHAR(1)         DEFAULT 'Y',
    DEFAULT_YN      CHAR(1)         DEFAULT 'N',
    ORDERING        INTEGER         NULL,
    DESCRIPTION     TEXT            NULL,
    CREATE_BY       VARCHAR(32)     NULL,
	CREATE_DTTS     TIMESTAMP       DEFAULT current_timestamp,
	UPDATE_BY       VARCHAR(32)     NULL,
	UPDATE_DTTS     TIMESTAMP       DEFAULT current_timestamp
);

ALTER SEQUENCE seq_code_mst_pdm OWNED BY CODE_MST_PDM.RAWID;

CREATE UNIQUE INDEX PK_CODE_MST_PDM ON CODE_MST_PDM (RAWID);
CREATE UNIQUE INDEX UK_CODE_MST_PDM ON CODE_MST_PDM (CATEGORY, CODE, NAME);


CREATE TABLE AREA_MST_PDM
(
    RAWID           INTEGER         NOT NULL DEFAULT nextval('seq_area_mst_pdm'),
	NAME            VARCHAR(128)    NOT NULL,
	DESCRIPTION     TEXT            NULL,
	PARENT_RAWID    INTEGER         DEFAULT 0,
	CREATE_BY       VARCHAR(32)     NULL,
	CREATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
	UPDATE_BY       VARCHAR(32)     NULL,
	UPDATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE seq_area_mst_pdm OWNED BY AREA_MST_PDM.RAWID;

CREATE UNIQUE INDEX PK_AREA_MST_PDM ON AREA_MST_PDM (RAWID);
CREATE UNIQUE INDEX UK_AREA_MST_PDM ON AREA_MST_PDM (NAME);



CREATE TABLE EQP_MST_PDM
(
    RAWID           INTEGER         NOT NULL DEFAULT nextval('seq_eqp_mst_pdm'),
    AREA_MST_RAWID  INTEGER         NOT NULL,
	NAME            VARCHAR(128)    NOT NULL,
	DESCRIPTION     TEXT            NULL,
	DATA_TYPE_CD    VARCHAR(32)     DEFAULT 'STD',
	IMAGE           BYTEA           NULL,
	CREATE_BY       VARCHAR(32)     NULL,
	CREATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
	UPDATE_BY       VARCHAR(32)     NULL,
	UPDATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE seq_eqp_mst_pdm OWNED BY EQP_MST_PDM.RAWID;

CREATE UNIQUE INDEX PK_EQP_MST_PDM ON EQP_MST_PDM (RAWID);
CREATE UNIQUE INDEX UK_EQP_MST_PDM ON EQP_MST_PDM (AREA_MST_RAWID, NAME);


CREATE TABLE BEARING_MST_PDM
(
    RAWID           INTEGER         NOT NULL DEFAULT nextval('seq_bearing_mst_pdm'),
    MODEL_NUMBER    VARCHAR(128)    NOT NULL,
    MANUFACTURE     VARCHAR(128)    NOT NULL,
	BPFO            INTEGER         NULL,
	BPFI            INTEGER         NULL,
	BSF             INTEGER         NULL,
	FTF             INTEGER         NULL,
	DESCRIPTION     TEXT            NULL,
	CREATE_BY       VARCHAR(32)     NULL,
	CREATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
	UPDATE_BY       VARCHAR(32)     NULL,
	UPDATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE seq_bearing_mst_pdm OWNED BY BEARING_MST_PDM.RAWID;

CREATE UNIQUE INDEX PK_BEARING_MST_PDM ON BEARING_MST_PDM (RAWID);
CREATE UNIQUE INDEX UK_BEARING_MST_PDM ON BEARING_MST_PDM (MODEL_NUMBER, MANUFACTURE);


CREATE TABLE PARTS_MST_PDM
(
    RAWID               INTEGER         NOT NULL DEFAULT nextval('seq_bearing_mst_pdm'),
    EQP_MST_RAWID       INTEGER         NOT NULL,
    BEARING_MST_RAWID   INTEGER         NULL,
	NAME                VARCHAR(256)    NOT NULL,
	PARTS_TYPE_CD       VARCHAR(32)     NOT NULL,
	RPM                 NUMERIC(5, 0)   NULL,
	RATIO               NUMERIC(10, 2)  NOT NULL,
	BASE_RATIO_YN       CHAR(1)         DEFAULT 'N',
	CREATE_BY           VARCHAR(32)     NULL,
	CREATE_DTTS         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
	UPDATE_BY           VARCHAR(32)     NULL,
	UPDATE_DTTS         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE seq_parts_mst_pdm OWNED BY PARTS_MST_PDM.RAWID;

CREATE UNIQUE INDEX PK_PARTS_MST_PDM ON PARTS_MST_PDM (RAWID);
CREATE UNIQUE INDEX UK_PARTS_MST_PDM ON PARTS_MST_PDM (EQP_MST_RAWID, NAME);


CREATE TABLE PARAM_MST_PDM
(
    RAWID           INTEGER         NOT NULL DEFAULT nextval('seq_param_mst_pdm'),
    EQP_MST_RAWID   INTEGER         NOT NULL,
    PARTS_MST_RAWID INTEGER         NOT NULL,
	NAME            VARCHAR(256)    NOT NULL,
	DESCRIPTION     TEXT            NULL,
	PARAM_TYPE_CD   VARCHAR(32)     NOT NULL,
	UNIT_CD         VARCHAR(32)     NOT NULL,
	CREATE_BY       VARCHAR(32)     NULL,
	CREATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
	UPDATE_BY       VARCHAR(32)     NULL,
	UPDATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE seq_param_mst_pdm OWNED BY PARAM_MST_PDM.RAWID;

CREATE UNIQUE INDEX PK_PARAM_MST_PDM ON PARAM_MST_PDM (RAWID);
CREATE UNIQUE INDEX UK_PARAM_MST_PDM ON PARAM_MST_PDM (EQP_MST_RAWID, NAME);



CREATE TABLE TRACE_SPEC_MST_PDM
(
	RAWID           INTEGER         NOT NULL DEFAULT nextval('seq_trace_spec_mst_pdm'),
	PARAM_MST_RAWID INTEGER         NOT NULL,
	ALARM_SPEC      FLOAT(23)       NOT NULL,
	WARNING_SPEC    FLOAT(23)       NOT NULL,
	CREATE_BY       VARCHAR(32)     NULL,
	CREATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
	UPDATE_BY       VARCHAR(32)     NULL,
	UPDATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE seq_trace_spec_mst_pdm OWNED BY TRACE_SPEC_MST_PDM.RAWID;

CREATE UNIQUE INDEX PK_TRACE_SPEC_MST_PDM ON TRACE_SPEC_MST_PDM (RAWID);
CREATE UNIQUE INDEX UK_TRACE_SPEC_MST_PDM ON TRACE_SPEC_MST_PDM (PARAM_MST_RAWID);



CREATE TABLE MANUAL_RPM_MST_PDM
(
    RAWID           INTEGER         NOT NULL DEFAULT nextval('seq_manual_rpm_mst_pdm'),
    PARAM_MST_RAWID INTEGER         NOT NULL,
    RPM             NUMERIC(5,2)    NULL,
    CREATE_BY       VARCHAR(32)     NULL,
	CREATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
	UPDATE_BY       VARCHAR(32)     NULL,
	UPDATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE seq_manual_rpm_mst_pdm OWNED BY MANUAL_RPM_MST_PDM.RAWID;

CREATE UNIQUE INDEX PK_MANUAL_RPM_MST_PDM ON MANUAL_RPM_MST_PDM (RAWID);
CREATE UNIQUE INDEX UK_MANUAL_RPM_MST_PDM ON MANUAL_RPM_MST_PDM (PARAM_MST_RAWID);



CREATE TABLE TRACE_TRX_PDM
(
    RAWID           INTEGER         NOT NULL DEFAULT nextval('seq_trace_trx_pdm'),
    PARAM_MST_RAWID INTEGER         NOT NULL,
    VALUE           REAL            NOT NULL,
    RPM             NUMERIC(5,2)    NULL,
    ALARM_SPEC      REAL            NULL,
    WARNING_SPEC    REAL            NULL,
    EVENT_DTTS      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    RESERVED_COL1   VARCHAR(128)    NULL,
    RESERVED_COL2   VARCHAR(128)    NULL,
    RESERVED_COL3   VARCHAR(128)    NULL,
    RESERVED_COL4   VARCHAR(128)    NULL,
    RESERVED_COL5   VARCHAR(128)    NULL
);

ALTER SEQUENCE seq_trace_trx_pdm OWNED BY TRACE_TRX_PDM.RAWID;

CREATE UNIQUE INDEX PK_TRACE_TRX_PDM ON TRACE_TRX_PDM (RAWID);
CREATE UNIQUE INDEX UK_TRACE_TRX_PDM ON TRACE_TRX_PDM (EVENT_DTTS, PARAM_MST_RAWID);

-- 파티션 추가
--ALTER TABLE TRACE_TRX_PDM ADD PARTITION P_20180501 VALUES LESS THAN (to_timestamp('2018-05-02 00:00:00', 'YYYY-MM-dd HH24:mi:ss')) //TABLESPACE PTS_11;


CREATE TABLE TRACE_RAW_TRX_PDM
(
    RAWID           INTEGER         NOT NULL DEFAULT nextval('seq_trace_raw_trx_pdm'),
    PARAM_MST_RAWID INTEGER         NOT NULL,
    TRACE_TRX_RAWID INTEGER         NOT NULL,
    DATA_TYPE_CD    VARCHAR(32)     NOT NULL,
    MAX_FREQ        INTEGER         NULL,
    FREQ_COUNT      INTEGER         NULL,
    RPM             NUMERIC(5,2)    NULL,
    SAMPLING_TIME   REAL            NULL,
    BINARY_DATA     BYTEA           NULL,
    EVENT_DTTS      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    RESERVED_COL1   VARCHAR(128)    NULL,
    RESERVED_COL2   VARCHAR(128)    NULL,
    RESERVED_COL3   VARCHAR(128)    NULL,
    RESERVED_COL4   VARCHAR(128)    NULL,
    RESERVED_COL5   VARCHAR(128)    NULL
);

ALTER SEQUENCE seq_trace_raw_trx_pdm OWNED BY TRACE_RAW_TRX_PDM.RAWID;

CREATE UNIQUE INDEX PK_TRACE_RAW_TRX_PDM ON TRACE_RAW_TRX_PDM (RAWID);
CREATE UNIQUE INDEX UK_TRACE_RAW_TRX_PDM ON TRACE_RAW_TRX_PDM (EVENT_DTTS, PARAM_MST_RAWID, TRACE_TRX_RAWID, DATA_TYPE_CD);



-- 파티션 추가
--ALTER TABLE TRACE_RAW_TRX_PDM ADD PARTITION P_20180501 VALUES LESS THAN (to_timestamp('2018-05-02 00:00:00', 'YYYY-MM-dd HH24:mi:ss')) //TABLESPACE PTS_11;

CREATE TABLE ALARM_TRX_PDM
(
    RAWID           INTEGER         NOT NULL DEFAULT nextval('seq_alarm_trx_pdm'),
    PARAM_MST_RAWID INTEGER         NOT NULL,
    ALARM_TYPE_CD   VARCHAR(32)     NOT NULL,
    VALUE           REAL            NOT NULL,
    ALARM_SPEC      REAL            NULL,
    WARNING_SPEC    REAL            NULL,
    ALARM_DTTS      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE seq_alarm_trx_pdm OWNED BY ALARM_TRX_PDM.RAWID;

CREATE UNIQUE INDEX PK_ALARM_TRX_PDM ON ALARM_TRX_PDM (RAWID);
CREATE UNIQUE INDEX UK_ALARM_TRX_PDM ON ALARM_TRX_PDM (ALARM_DTTS, PARAM_MST_RAWID);



-- 파티션 추가
--ALTER TABLE ALARM_TRX_PDM ADD PARTITION P_201812 VALUES LESS THAN ('201901') //TABLESPACE PTS_11;

CREATE TABLE TRACE_DAILY_SUM_PDM
(
	RAWID           INTEGER         NOT NULL DEFAULT nextval('seq_trace_daily_sum_pdm'),
	PARAM_MST_RAWID INTEGER         NOT NULL,
	ALARM_SPEC      REAL,
	WARNING_SPEC    REAL,
	SUM_DTTS        TIMESTAMP(6)    NOT NULL,
    AVG_PERIOD      REAL,
	AVG_DAILY       REAL,
	AVG_OOS         REAL,
	VARIATION       REAL,
	CAUSE	        TEXT,
	CREATE_BY       VARCHAR(32)     NULL,
	CREATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE seq_trace_daily_sum_pdm OWNED BY TRACE_DAILY_SUM_PDM.RAWID;

CREATE UNIQUE INDEX PK_TRACE_DAILY_SUM_PDM ON TRACE_DAILY_SUM_PDM (RAWID);
CREATE UNIQUE INDEX UK_TRACE_DAILY_SUM_PDM ON TRACE_DAILY_SUM_PDM (SUM_DTTS, PARAM_MST_RAWID);


CREATE TABLE EQP_ALARM_DAILY_SUM_PDM
(
    RAWID           INTEGER         NOT NULL DEFAULT nextval('seq_eqp_alarm_daily_sum_pdm'),
    EQP_MST_RAWID   INTEGER         NOT NULL,
    SUM_DTTS        TIMESTAMP(6)    NOT NULL,
    STATUS_CD       NUMERIC(10)     NOT NULL,
	VALUE           REAL            NOT NULL,
	CREATE_BY       VARCHAR(32)     NULL,
	CREATE_DTTS     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE seq_alarm_daily_sum_pdm OWNED BY EQP_ALARM_DAILY_SUM_PDM.RAWID;

CREATE UNIQUE INDEX PK_EQP_ALARM_DAILY_SUM_PDM ON EQP_ALARM_DAILY_SUM_PDM (RAWID);
CREATE UNIQUE INDEX UK_EQP_ALARM_DAILY_SUM_PDM ON EQP_ALARM_DAILY_SUM_PDM (SUM_DTTS, EQP_MST_RAWID, STATUS_CD);


