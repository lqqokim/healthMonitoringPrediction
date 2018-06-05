package com.bistel.pdm.serving.entity;

import java.sql.Timestamp;

//@Entity
//@Table(name = "area_mst_pdm")
public class AreaEntity extends BaseEntity {

    //@Column(name = "name", nullable = false)
    private String name;

    //@Column(name = "description")
    private String description;

    //@Column(name = "parent_rawid")
    private Long parentId;

    //@Column(name = "create_dtts")
    private Timestamp createDtts;

    //@Column(name = "update_dtts")
    private Timestamp updateDtts;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Timestamp getCreateDtts() {
        return createDtts;
    }

    public void setCreateDtts(Timestamp createDtts) {
        this.createDtts = createDtts;
    }

    public Timestamp getUpdateDtts() {
        return updateDtts;
    }

    public void setUpdateDtts(Timestamp updateDtts) {
        this.updateDtts = updateDtts;
    }
}
