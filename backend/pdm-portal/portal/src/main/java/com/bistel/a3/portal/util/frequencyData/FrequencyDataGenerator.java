package com.bistel.a3.portal.util.frequencyData;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

import static com.bistel.a3.portal.util.frequencyData.FrequencyUtil.getFFT;
import static com.bistel.a3.portal.util.frequencyData.FrequencyUtil.overall;

public class FrequencyDataGenerator {

    public static FrequencyData getFrequencyData(double samplingTime, int sampleCount, List<FrequencyHarmonic> harmonics){

        FrequencyData frequencyData = new FrequencyData();
        frequencyData.setSamplingCount(sampleCount);
        frequencyData.setSamplingTime(samplingTime);


        double[] timeWaveData =  new double[sampleCount];

        double timeInterval = samplingTime/(sampleCount-1);
        for (int i = 0; i < sampleCount; i++) {
            double x = i*timeInterval;
            double sumValue = 0;
            for (int j = 0; j < harmonics.size(); j++) {
                sumValue +=Math.sin(2*Math.PI*x*harmonics.get(j).frequency)*harmonics.get(j).amplitude;
            }
            timeWaveData[i] =sumValue;
        }

        frequencyData.setTimeWaveData(timeWaveData);

        double[] tempConversion = getFFT(samplingTime, sampleCount, timeWaveData);
        frequencyData.setFrequencyData(tempConversion);

        double overall = overall(tempConversion);
        frequencyData.setOverall(overall);

        return frequencyData;
    }



    public static FrequencyData getGenHarmonicDataSimulation(String dataType, Double amplitude_min, Double amplitude_max, Double rpm, Double bearing_1x, double samplingTime, int samplingCount) {

        List<FrequencyHarmonic> harmonics = getAutoGenHarmonics(dataType,samplingTime,samplingCount, amplitude_min, amplitude_max, rpm,bearing_1x);

        FrequencyData frequencyData = FrequencyDataGenerator.getFrequencyData(samplingTime, samplingCount,harmonics);

        return frequencyData;
    }

    public static List<FrequencyHarmonic> getAutoGenHarmonics(String dataType, double samplingTime, int samplingCount, Double amplitude_min, Double amplitude_max, Double rpm,Double bearing_1x) {

        Random rnd = new Random(new Date().getTime());
        List<FrequencyHarmonic> harmonics = new ArrayList<>();

        double frequencyInterval = 1/samplingTime;
        double frequencyCount = samplingCount/2.0;

        double maxFrequency = frequencyCount*frequencyInterval;
        if(dataType.equals("Normal")){

            FrequencyHarmonic harmonic = new FrequencyHarmonic();
            double max_value=0;

            for (int i = 0; i < frequencyCount; i++) {
                if(maxFrequency<rpm*(i+1)){
                    break;
                }

                harmonic = new FrequencyHarmonic();

                max_value =  amplitude_max*0.7 + (Math.random() *amplitude_max); ;

                harmonic.setAmplitude(max_value);
                harmonic.setName((i+1)+"x");
                harmonic.setFrequency(rpm*(i+1));
                harmonic.setAmplitude_start(0.01);
                harmonic.setAmplitude_end(max_value);

                harmonics.add(harmonic);
            }
        }else if(dataType.equals("Misalignment")){

            FrequencyHarmonic harmonic = new FrequencyHarmonic();
            harmonic.setAmplitude(amplitude_max);
            harmonic.setName("1x");
            harmonic.setFrequency(rpm);
            harmonic.setAmplitude_start(amplitude_min);
            harmonic.setAmplitude_end(amplitude_max);
            harmonics.add(harmonic);

            harmonic = new FrequencyHarmonic();
            double max_value = amplitude_max*0.5;

            harmonic.setAmplitude(max_value);
            harmonic.setName("2x");
            harmonic.setFrequency(rpm*2);
            harmonic.setAmplitude_start(amplitude_min);
            harmonic.setAmplitude_end(max_value);
            harmonics.add(harmonic);

            harmonic = new FrequencyHarmonic();
            max_value = amplitude_max*0.25;
            harmonic.setAmplitude(max_value);
            harmonic.setName("3x");
            harmonic.setFrequency(rpm*3);
            harmonic.setAmplitude_start(amplitude_min);
            harmonic.setAmplitude_end(max_value);
            harmonics.add(harmonic);

            for (int i = 3; i < frequencyCount; i++) {
                if(maxFrequency<rpm*(i+1)){
                    break;
                }

                harmonic = new FrequencyHarmonic();

                max_value =  amplitude_max*0.01 + (Math.random() *amplitude_max* 0.03); ;

                harmonic.setAmplitude(max_value);
                harmonic.setName((i+1)+"x");
                harmonic.setFrequency(rpm*(i+1));
                harmonic.setAmplitude_start(0.01);
                harmonic.setAmplitude_end(max_value);

                harmonics.add(harmonic);
            }
        }else if(dataType.equals("Unbalance")){

            FrequencyHarmonic harmonic = new FrequencyHarmonic();

            harmonic.setAmplitude(amplitude_max);
            harmonic.setName("1x");
            harmonic.setFrequency(rpm);
            harmonic.setAmplitude_start(amplitude_min);
            harmonic.setAmplitude_end(amplitude_max);
            harmonics.add(harmonic);

            harmonic = new FrequencyHarmonic();
            double max_value = amplitude_max*0.05;
            harmonic.setAmplitude(max_value);
            harmonic.setName("2x");
            harmonic.setFrequency(rpm*2);
            harmonic.setAmplitude_start(amplitude_min);
            harmonic.setAmplitude_end(max_value);
            harmonics.add(harmonic);

            harmonic = new FrequencyHarmonic();
            max_value = amplitude_max*0.04;
            harmonic.setAmplitude(max_value);
            harmonic.setName("3x");
            harmonic.setFrequency(rpm*3);
            harmonic.setAmplitude_start(amplitude_min);
            harmonic.setAmplitude_end(max_value);
            harmonics.add(harmonic);

            for (int i = 3; i < frequencyCount; i++) {
                if(maxFrequency<rpm*(i+1)){
                    break;
                }
                max_value =  amplitude_max*0.01 + (Math.random() *amplitude_max* 0.03); ;

                harmonic = new FrequencyHarmonic();
                harmonic.setAmplitude(max_value);
                harmonic.setName((i+1)+"x");
                harmonic.setFrequency(rpm*(i+1));
                harmonic.setAmplitude_start(0.01);
                harmonic.setAmplitude_end(max_value);

                harmonics.add(harmonic);
            }
        }else if(dataType.length()>7 && dataType.substring(0,7).equals("Bearing")){

            FrequencyHarmonic harmonic = new FrequencyHarmonic();
            double max_value=0;

            double normalAmplitude_max = 0.1;
            for (int i = 0; i < frequencyCount; i++) {
                if(maxFrequency<rpm*(i+1)){
                    break;
                }

                harmonic = new FrequencyHarmonic();

                max_value = normalAmplitude_max *0.7 + (Math.random() *normalAmplitude_max); ;

                harmonic.setAmplitude(max_value);
                harmonic.setName((i+1)+"x");
                harmonic.setFrequency(rpm*(i+1));
                harmonic.setAmplitude_start(0.01);
                harmonic.setAmplitude_end(max_value);

                harmonics.add(harmonic);
            }

            for (int i = -10; i < 10; i++) {
                harmonic = new FrequencyHarmonic();

                //max_value =  amplitude_max*0.7 + (Math.random() *amplitude_max); ;
                max_value =  amplitude_max - amplitude_max * Math.abs(i) *0.1;

                harmonic.setAmplitude(max_value);
                harmonic.setName("bearing"+(i+1));
                harmonic.setFrequency( bearing_1x +(i));
                harmonic.setAmplitude_start(0.01);
                harmonic.setAmplitude_end(max_value);

                harmonics.add(harmonic);

            }



        }else if(dataType.equals("Oiling")){

            FrequencyHarmonic harmonic = new FrequencyHarmonic();
            double max_value=0;

            double normalAmplitude_max = 0.1;
            for (int i = 0; i < frequencyCount; i++) {
                if(maxFrequency<rpm*(i+1)){
                    break;
                }

                harmonic = new FrequencyHarmonic();

                max_value = normalAmplitude_max *0.7 + (Math.random() *normalAmplitude_max); ;

                harmonic.setAmplitude(max_value);
                harmonic.setName((i+1)+"x");
                harmonic.setFrequency(rpm*(i+1));
                harmonic.setAmplitude_start(0.01);
                harmonic.setAmplitude_end(max_value);

                harmonics.add(harmonic);
            }

            for (int i = -30; i < 30; i++) {
                harmonic = new FrequencyHarmonic();

                //max_value =  amplitude_max*0.7 + (Math.random() *amplitude_max); ;
                max_value =  amplitude_max - amplitude_max * Math.abs(i) *0.03;

                harmonic.setAmplitude(max_value);
                harmonic.setName("oiling"+(i+1));
                harmonic.setFrequency( frequencyCount*2/3*frequencyInterval +(i));
                harmonic.setAmplitude_start(0.01);
                harmonic.setAmplitude_end(max_value);

                harmonics.add(harmonic);

            }



        }
        return harmonics;
    }


}
