package com.bistel.a3.portal.domain.pdm;

import com.bistel.a3.portal.domain.pdm.db.Area;

public class AreaWithTree extends Area {
    private Integer leaf;

    public Integer getLeaf() {
        return leaf;
    }

    public void setLeaf(Integer leaf) {
        this.leaf = leaf;
    }
}
