package com.bistel.pdm.app.datagen;

import org.junit.Test;

public class StarterTest {

   @Test
    public void test(){
        Integer threadCount = 4;

        TestLogGenerator generator = new TestLogGenerator();
        generator.setThreadCount(threadCount);
        generator.setAsync(true);
        generator.generate();
    }
}