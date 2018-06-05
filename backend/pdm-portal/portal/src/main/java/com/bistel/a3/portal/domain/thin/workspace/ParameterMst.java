package com.bistel.a3.portal.domain.thin.workspace;

public class ParameterMst {
    private Long id;

    private Integer moduleId;

    private String moduleIdees;

    private String paramName;

    private String paramAlias;

    private String unit;

    private String dataLoadYn;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getModuleId() {
        return moduleId;
    }

    public void setModuleId(Integer moduleId) {
        this.moduleId = moduleId;
    }

    public String getModuleIdees() {
        return moduleIdees;
    }

    public void setModuleIdees(String moduleIdees) {
        this.moduleIdees = moduleIdees;
    }

    public String getParamName() {
        return paramName;
    }

    public void setParamName(String paramName) {
        this.paramName = paramName;
    }

    public String getParamAlias() {
        return paramAlias;
    }

    public void setParamAlias(String paramAlias) {
        this.paramAlias = paramAlias;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getDataLoadYn() {
        return dataLoadYn;
    }

    public void setDataLoadYn(String dataLoadYn) {
        this.dataLoadYn = dataLoadYn;
    }
}
