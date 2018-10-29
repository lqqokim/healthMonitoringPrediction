package com.bistel.a3.portal.domain.pdm.master;

import com.bistel.a3.portal.domain.pdm.db.Eqp;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Base64;

public class EqpWithEtc extends Eqp {

//    private String image;
//
//    @JsonIgnore
//    private byte[] binary;
//
//    public String getImage() {
//        return image;
//    }
//
//    public void setImage(String image) {
//
//        if(image==null)
//        {
//            this.image=null;
//        }
//        else
//        {
//            this.image = image;
//            this.binary = Base64.getDecoder().decode(image);
//        }
//
//    }
//
//    public byte[] getBinary() {
//        return binary;
//    }
//
//    public void setBinary(byte[] binary) {
//        this.binary = binary;
//        this.image = Base64.getEncoder().encodeToString(binary);
//    }
}
