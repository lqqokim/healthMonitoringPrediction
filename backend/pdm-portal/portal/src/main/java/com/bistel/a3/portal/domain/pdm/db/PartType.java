package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PartType {
    @JsonProperty("partTypeId")
    private Long part_type_id;
    private String name;
    private String parts_type;
    private String parts_type_cd;

    public String getParts_type_cd() {
        return parts_type_cd;
    }

    public void setParts_type_cd(String parts_type_cd) {
        this.parts_type_cd = parts_type_cd;
    }

    public String getParts_type() {
        return parts_type;
    }

    public void setParts_type(String parts_type) {
        this.parts_type = parts_type;
    }

    public Long getPart_type_id() {
        return part_type_id;
    }

    public void setPart_type_id(Long part_type_id) {
        this.part_type_id = part_type_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
