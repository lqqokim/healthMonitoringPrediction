package com.bistel.a3.portal.domain.pdm.master;

import com.bistel.a3.portal.domain.pdm.db.Part;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Monitoring  {
    private Long rawId;
    private String name;
    private String image;
    private String datas;
    private Double width;
    private Double height;
    private String userName;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getRawId() {
        return rawId;
    }

    public void setRawId(Long rawId) {
        this.rawId = rawId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDatas() {
        return datas;
    }

    public void setDatas(String datas) {
        this.datas = datas;
    }

    public Double getWidth() {
        return width;
    }

    public void setWidth(Double width) {
        this.width = width;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }
}
