package com.bistel.a3.portal.domain.pdm;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class EqpInfo {
    private String shopFullName;
    private String eqpName;
    private String eqpImage;
    private byte[] binaryImage;
    private String imageType;

    @JsonIgnore
    public byte[] getBinaryImage() {
        return binaryImage;
    }

    public void setBinaryImage(byte[] binaryImage) {
        this.binaryImage = binaryImage;
    }

    public String getShopFullName() {
        return shopFullName;
    }

    public void setShopFullName(String shopFullName) {
        this.shopFullName = shopFullName;
    }

    public String getEqpName() {
        return eqpName;
    }

    public void setEqpName(String eqpName) {
        this.eqpName = eqpName;
    }

    public String getEqpImage() {
        return eqpImage;
    }

    public void setEqpImage(String eqpImage) {
        this.eqpImage = eqpImage;
    }

    public void setImageType(String imageType) {
        this.imageType = imageType;
    }

    public String getImageType() {
        return imageType;
    }
}
