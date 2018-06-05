package com.bistel.a3.portal.util.frequencyData;

import org.apache.commons.math3.complex.Complex;
import org.apache.commons.math3.transform.DftNormalization;
import org.apache.commons.math3.transform.FastFourierTransformer;
import org.apache.commons.math3.transform.TransformType;

import java.nio.ByteBuffer;

public class FrequencyUtil {
    public static double[] getFFT(double samplingTime, int sampleCount, double[] timeWaveData) {
        FastFourierTransformer fft = new FastFourierTransformer(DftNormalization.STANDARD);
        Complex[] complx = fft.transform(timeWaveData, TransformType.FORWARD);

        double frequency = 0;
        double[] tempConversion = new double[sampleCount/2];


        for (int i = 0; i < (complx.length / 2); i++) {           // 대칭되는 값을 제외하기위해 절반만을 사용

            double rr = (complx[i].getReal()) / sampleCount * 2;        // maginute값 계산을 위한 마사지

            double ri = (complx[i].getImaginary())  / sampleCount * 2;    // maginute값 계산을 위한 마사지

            tempConversion[i] = Math.sqrt((rr * rr) + (ri * ri));    // maginute계산

            double mag = tempConversion[i];

//            frequency = (sampleRate * i) / sampleCount;            // frequency계산
            frequency = i*(1/samplingTime);

//            System.out.println(frequency+"\t"+mag);

        }
        return tempConversion;
    }
    public static double overall(double [] frequency){
        double sqrtSum =0;
        for (int i = 0; i < frequency.length; i++) {
            sqrtSum += Math.pow(frequency[i],2);
        }
        return Math.sqrt(sqrtSum/1.5);
    }
    public static byte[] doubleToByteArray(double[] doubleArray){

        int times = Double.SIZE / Byte.SIZE;
        byte[] bytes = new byte[doubleArray.length * times];
        for(int i=0;i<doubleArray.length;i++){
            ByteBuffer.wrap(bytes, i*times, times).putDouble(doubleArray[i]);
        }
        return bytes;
    }

    public static double[] byteToDoubleArray(byte[] bytes){
        int times = Double.SIZE / Byte.SIZE;
        double[] doubles = new double[bytes.length / times];
        for(int i=0;i<doubles.length;i++){
            doubles[i] = ByteBuffer.wrap(bytes, i*times, times).getDouble();
        }
        return doubles;
    }
}
