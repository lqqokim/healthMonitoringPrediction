package com.bistel.pdm.datastore.model;

import org.junit.Test;

import static org.junit.Assert.*;

public class SensorRawDataTest {

    @Test
    public void test_byteToDouble() {
        String value = "2.16746037276737^-0.3279440185894371";

        String[] values = value.split("\\^");
        double[] doubles = new double[values.length];
        for(int i = 0; i < doubles.length; i++){
            doubles[i] = Double.parseDouble(values[i]);
        }

        System.out.println(doubles.length);
    }
}