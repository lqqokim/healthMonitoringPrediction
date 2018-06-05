package com.bistel.pdm.app.datagen.provider;

import com.bistel.pdm.app.datagen.provider.RandomValue;

import java.util.Random;

public class FloatRandomValue implements RandomValue<Float> {

    public FloatRandomValue() {
    }

    @Override
    public Float getRandomValue() {
        Random rand = new Random();
        return rand.nextFloat();
    }
}
