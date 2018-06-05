package com.bistel.a3.portal.domain.pdm.db;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Date;

public class SampleData {

    @JsonProperty("rawId")
    private Long rawId;
    @JsonProperty("problem_type")
    private String problem_type;
    private String data_type;

    public Long getRawId() {
        return rawId;
    }

    public void setRawId(Long rawId) {
        this.rawId = rawId;
    }

    public String getProblem_type() {
        return problem_type;
    }

    public void setProblem_type(String problem_type) {
        this.problem_type = problem_type;
    }

    public String getData_type() {
        return data_type;
    }

    public void setData_type(String data_type) {
        this.data_type = data_type;
    }




}
