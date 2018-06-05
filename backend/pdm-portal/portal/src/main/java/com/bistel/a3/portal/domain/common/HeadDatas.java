package com.bistel.a3.portal.domain.common;

import java.util.ArrayList;
import java.util.List;

public class HeadDatas {
    List<String> heads = new ArrayList<>();
    List<List<Object>> datas = new ArrayList<>();

    public List<String> getHeads() {
        return heads;
    }

    public void setHeads(List<String> heads) {
        this.heads = heads;
    }

    public List<List<Object>> getDatas() {
        return datas;
    }

    public void setDatas(List<List<Object>> datas) {
        this.datas = datas;
    }
}
