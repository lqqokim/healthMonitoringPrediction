package com.bistel.pdm.app.datagen.provider;

import java.util.Random;

public class DoubleRandomValue implements RandomValue<Double> {

    @Override
    public Double getRandomValue() {
        Random rand = new Random();
        return rand.nextDouble();
    }
}
