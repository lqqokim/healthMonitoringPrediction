package com.bistel.a3.portal.domain.pdm.master;

import com.bistel.a3.portal.domain.pdm.db.Area;

import java.util.List;

public class AreaWithChildren extends Area {
    private List<AreaWithChildren> children;

    public List<AreaWithChildren> getChildren() {
        return children;
    }

    public void setChildren(List<AreaWithChildren> children) {
        this.children = children;
    }
}
