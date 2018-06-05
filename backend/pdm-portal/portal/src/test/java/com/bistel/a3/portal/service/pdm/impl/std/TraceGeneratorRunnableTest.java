package com.bistel.a3.portal.service.pdm.impl.std;

import org.junit.Test;

import java.util.Random;

import static org.junit.Assert.*;

public class TraceGeneratorRunnableTest {

    @Test
    public void run() {
        Random random = new Random(System.currentTimeMillis());
        int index = 2+(int)(Math.random() * (24 -2)+1);
        if(index>=2 && index<=6){
            System.out.println("ALARM");
        }else if (index>=7 && index<=18){
            System.out.println("Normal");
        }else{
            System.out.println("Warning");
        }
    }
}