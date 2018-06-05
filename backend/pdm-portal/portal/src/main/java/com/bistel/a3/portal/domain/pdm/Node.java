package com.bistel.a3.portal.domain.pdm;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Node {
    @JsonProperty("nodeId")
    private Long node_id;
    @JsonProperty("nodeName")
    private String node_name;
    @JsonProperty("nodeType")
    private Long node_type;
    @JsonIgnore
    private Long parent_id;
    @JsonIgnore
    private Integer sort_order;
    private List<Node> children;

    public Long getParent_id() {
        return parent_id;
    }

    public void setParent_id(Long parent_id) {
        this.parent_id = parent_id;
    }

    public Long getNode_id() {
        return node_id;
    }

    public void setNode_id(Long node_id) {
        this.node_id = node_id;
    }

    public String getNode_name() {
        return node_name;
    }

    public void setNode_name(String node_name) {
        this.node_name = node_name;
    }

    public Long getNode_type() {
        return node_type;
    }

    public void setNode_type(Long node_type) {
        this.node_type = node_type;
    }

    public List<Node> getChildren() {
        return children;
    }

    public Integer getSort_order() {
        return sort_order;
    }

    public void setSort_order(Integer sort_order) {
        this.sort_order = sort_order;
    }

    public void setChildren(List<Node> children) {
        this.children = children;
    }
}
