package com.bistel.a3.portal.domain.pdm;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Fab {
    private String fabId;
    @JsonProperty("fabName")
    private String name;

    public Fab() {}

    public Fab(String fabId, String name) {
        this.fabId = fabId;
        this.name = name;
    }

    public String getFabId() {
        return fabId;
    }

    public void setFabId(String fabId) {
        this.fabId = fabId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
