package com.bistel.a3.portal.domain.pdm.db;

import java.util.Date;

public class EqpEvent {
    private Long rawId;
    private Long eqpMstRawId;
    private String eventName;
    private String eventTypeCd;
    private String processYn;
    private Long paramMstRawId;
    private String condition;
    private String createBy;
    private Date createDtts;
    private String updateBy;
    private Date updateDtts;


    public Long getRawId() {
        return rawId;
    }

    public void setRawId(Long rawId) {
        this.rawId = rawId;
    }

    public Long getEqpMstRawId() {
        return eqpMstRawId;
    }

    public void setEqpMstRawId(Long eqpMstRawId) {
        this.eqpMstRawId = eqpMstRawId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventTypeCd() {
        return eventTypeCd;
    }

    public void setEventTypeCd(String eventTypeCd) {
        this.eventTypeCd = eventTypeCd;
    }

    public String getProcessYn() {
        return processYn;
    }

    public void setProcessYn(String processYn) {
        this.processYn = processYn;
    }

    public Long getParamMstRawId() {
        return paramMstRawId;
    }

    public void setParamMstRawId(Long paramMstRawId) {
        this.paramMstRawId = paramMstRawId;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public Date getCreateDtts() {
        return createDtts;
    }

    public void setCreateDtts(Date createDtts) {
        this.createDtts = createDtts;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public Date getUpdateDtts() {
        return updateDtts;
    }

    public void setUpdateDtts(Date updateDtts) {
        this.updateDtts = updateDtts;
    }
}
