/*
 HMP v1.1.1 for postgresql
*/


CREATE SEQUENCE seq_conditional_spec_mst_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE SEQUENCE seq_model_param_spec_mst_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE SEQUENCE seq_eqp_spec_link_mst_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE SEQUENCE seq_param_spec_mst_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

CREATE SEQUENCE seq_param_dimension_trx_pdm
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE EQP_MST_PDM ADD MODEL_NAME VARCHAR(32);

ALTER TABLE EQP_EVENT_MST_PDM ADD TIMEOUT NUMBER(38);

ALTER TABLE TRACE_TRX_PDM ADD (MESSAGE_GROUP VARCHAR(1024));
ALTER TABLE PARAM_FEATURE_TRX_PDM ADD (MESSAGE_GROUP VARCHAR(1024));
ALTER TABLE PARAM_HEALTH_TRX_PDM ADD (MESSAGE_GROUP VARCHAR(1024));

ALTER TABLE ALARM_TRX_PDM ADD (RULE_NAME VARCHAR(32));
ALTER TABLE ALARM_TRX_PDM ADD (CONDITION TEXT);

ALTER TABLE TRACE_TRX_PDM ADD (RULE_NAME VARCHAR(32));
ALTER TABLE TRACE_TRX_PDM ADD (CONDITION TEXT);

ALTER TABLE PARAM_MST_PDM ADD (DATA_TYPE VARCHAR(32));
ALTER TABLE PARAM_MST_PDM MODIFY(DATA_TYPE VARCHAR(32) DEFAULT 'CONTINUOUS' );

-- -----------------------------------------------------
-- Table CONDITIONAL_SPEC_MST_PDM
-- -----------------------------------------------------
CREATE TABLE CONDITIONAL_SPEC_MST_PDM (
  RAWID             INTEGER         NOT NULL DEFAULT nextval('seq_conditional_spec_mst_pdm'),
  MODEL_NAME        VARCHAR(32)     NOT NULL,
  RULE_NAME         VARCHAR(32)     NOT NULL,
  EXPRESSION        TEXT,
  EXPRESSION_VALUE  TEXT,
  CONDITION         TEXT,
  DESCRIPTION       VARCHAR(2048)   NULL,
  CREATE_BY         VARCHAR(32)     NULL,
  CREATE_DTTS       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY         VARCHAR(32)     NULL,
  UPDATE_DTTS       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE seq_conditional_spec_mst_pdm OWNED BY CONDITIONAL_SPEC_MST_PDM.RAWID;

CREATE UNIQUE INDEX PK_CONDITIONAL_SPEC_MST_PDM ON CONDITIONAL_SPEC_MST_PDM (RAWID);
CREATE UNIQUE INDEX UK_CONDITIONAL_SPEC_MST_PDM ON CONDITIONAL_SPEC_MST_PDM (MODEL_NAME, RULE_NAME);


-- -----------------------------------------------------
-- Table MODEL_PARAM_SPEC_MST_PDM
-- -----------------------------------------------------
CREATE TABLE MODEL_PARAM_SPEC_MST_PDM (
  RAWID                         INTEGER         NOT NULL DEFAULT nextval('seq_model_param_spec_mst_pdm'),
  CONDITIONAL_SPEC_MST_RAWID    INTEGER         NOT NULL,
  PARAM_NAME                    VARCHAR(256)    NOT NULL,
  UPPER_ALARM_SPEC              FLOAT,
  UPPER_WARNING_SPEC            FLOAT,
  TARGET                        FLOAT,
  LOWER_ALARM_SPEC              FLOAT,
  LOWER_WARNING_SPEC            FLOAT,
  DESCRIPTION                   VARCHAR(2048)   NULL,
  CREATE_BY                     VARCHAR(32)     NULL,
  CREATE_DTTS                   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY                     VARCHAR(32)     NULL,
  UPDATE_DTTS                   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE seq_model_param_spec_mst_pdm OWNED BY MODEL_PARAM_SPEC_MST_PDM.RAWID;

CREATE UNIQUE INDEX PK_MODEL_PARAM_SPEC_MST_PDM ON MODEL_PARAM_SPEC_MST_PDM (RAWID);
CREATE UNIQUE INDEX UK_MODEL_PARAM_SPEC_MST_PDM ON MODEL_PARAM_SPEC_MST_PDM (CONDITIONAL_SPEC_MST_RAWID, PARAM_NAME);

-- -----------------------------------------------------
-- Table EQP_SPEC_LINK_MST_PDM
-- -----------------------------------------------------
CREATE TABLE EQP_SPEC_LINK_MST_PDM (
  RAWID                         INTEGER         NOT NULL DEFAULT nextval('seq_eqp_spec_link_mst_pdm'),
  EQP_MST_RAWID                 INTEGER         NOT NULL,
  CONDITIONAL_SPEC_MST_RAWID    INTEGER         NOT NULL,
  ORDERING                      INTEGER         DEFAULT 1,
  DESCRIPTION                   VARCHAR(2048)   NULL,
  CREATE_BY                     VARCHAR(32)     NULL,
  CREATE_DTTS                   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY                     VARCHAR(32)     NULL,
  UPDATE_DTTS                   TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE seq_eqp_spec_link_mst_pdm OWNED BY EQP_SPEC_LINK_MST_PDM.RAWID;

CREATE UNIQUE INDEX PK_EQP_SPEC_LINK_MST_PDM ON EQP_SPEC_LINK_MST_PDM (RAWID);
CREATE UNIQUE INDEX UK_EQP_SPEC_LINK_MST_PDM ON EQP_SPEC_LINK_MST_PDM (EQP_MST_RAWID, CONDITIONAL_SPEC_MST_RAWID);

-- -----------------------------------------------------
-- Table PARAM_SPEC_MST_PDM
-- -----------------------------------------------------
CREATE TABLE PARAM_SPEC_MST_PDM (
  RAWID                             INTEGER         NOT NULL DEFAULT nextval('seq_param_spec_mst_pdm'),
  PARAM_MST_RAWID                   INTEGER         NOT NULL,
  EQP_SPEC_LINK_MST_RAWID           INTEGER         NOT NULL,
  UPPER_ALARM_SPEC                  FLOAT,
  UPPER_WARNING_SPEC                FLOAT,
  TARGET                            FLOAT,
  LOWER_ALARM_SPEC                  FLOAT,
  LOWER_WARNING_SPEC                FLOAT,
  DESCRIPTION                       VARCHAR(2048)   NULL,
  CREATE_BY                         VARCHAR(32)     NULL,
  CREATE_DTTS                       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  UPDATE_BY                         VARCHAR(32)     NULL,
  UPDATE_DTTS                       TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);

ALTER SEQUENCE seq_param_spec_mst_pdm OWNED BY PARAM_SPEC_MST_PDM.RAWID;

CREATE UNIQUE INDEX PK_PARAM_SPEC_MST_PDM ON PARAM_SPEC_MST_PDM (RAWID);
CREATE UNIQUE INDEX UK_PARAM_SPEC_MST_PDM ON PARAM_SPEC_MST_PDM (PARAM_MST_RAWID, EQP_SPEC_LINK_MST_RAWID);

-- -----------------------------------------------------
-- Table PARAM_DIMENSION_TRX_PDM
-- -----------------------------------------------------
CREATE TABLE PARAM_DIMENSION_TRX_PDM
(
    RAWID           INTEGER         NOT NULL DEFAULT nextval('seq_param_dimension_trx_pdm'),
    PARAM_MST_RAWID INTEGER         NOT NULL,
    BEGIN_DTTS      TIMESTAMP (6)   NOT NULL,
    END_DTTS        TIMESTAMP (6)   NOT NULL,
    VALUE           VARCHAR(1024),
    MESSAGE_GROUP   VARCHAR(1024)
);

ALTER SEQUENCE seq_param_dimension_trx_pdm OWNED BY PARAM_DIMENSION_TRX_PDM.RAWID;

CREATE UNIQUE INDEX PK_PARAM_DIMENSION_TRX_PDM ON PARAM_DIMENSION_TRX_PDM (RAWID);