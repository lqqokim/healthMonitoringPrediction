package com.bistel.a3.portal.service.pdm.impl.std;
import com.bistel.a3.portal.domain.pdm.db.TestTraceRawTrx;
import com.bistel.a3.portal.domain.pdm.work.MeasureTrxWithBin;
import com.bistel.a3.portal.service.pdm.IBLOBTest;
import com.bistel.a3.portal.util.SqlSessionUtil;
import org.mybatis.spring.SqlSessionTemplate;

import com.bistel.a3.portal.dao.pdm.std.trace.STDTraceRawDataMapper;
import org.junit.After;
import org.junit.Test;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import static org.junit.Assert.*;


@Service
public class BLOBTest implements IBLOBTest
{
    @Autowired
    Map<String, SqlSessionTemplate> sessions;


    public void blobDecompTest() throws NoSuchMethodException{

        System.out.println("asdf");
        STDTraceRawDataMapper traceRawDataMapper = SqlSessionUtil.getMapper(sessions, "fab1", STDTraceRawDataMapper.class);

        TestTraceRawTrx testTraceRawTrx=traceRawDataMapper.selectBlobTest();

//        StringBuilder asdf=byteToString(testTraceRawTrx.getBinary_data());
//        String a=asdf.toString();

        String a=byteToString2(testTraceRawTrx.getBinary_data());

        System.out.println(a);
    }




    private static StringBuilder byteToString(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        int times = Double.SIZE / Byte.SIZE;// Double Size =64, Byte Size=8
        double[] doubles = new double[bytes.length / times]; //BLOB의 길이를 (Double.size/Byte.size)로 나눔

        for (int i = 0; i < doubles.length; i++) {

            ByteBuffer bf=ByteBuffer.wrap(bytes, i * times, times);
            Double bfd=bf.getDouble();

            sb.append(ByteBuffer.wrap(bytes, i * times, times).getDouble()).append("^");
        }
        sb.setLength(sb.length() - 1);
        return sb;
    }

    private static String byteToString2(byte[] bytes){
        String converted = new String(bytes, StandardCharsets.UTF_8);

        return converted;
    }


    private static double[] byteToDoubleArray(byte[] bytes) {
        int times = Double.SIZE / Byte.SIZE;
        double[] doubles = new double[bytes.length / times];
        for (int i = 0; i < doubles.length; i++) {
            doubles[i] = ByteBuffer.wrap(bytes, i * times, times).getDouble();
        }
        return doubles;
    }



}