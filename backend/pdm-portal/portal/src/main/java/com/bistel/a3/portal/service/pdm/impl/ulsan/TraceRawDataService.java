package com.bistel.a3.portal.service.pdm.impl.ulsan;

import com.bistel.a3.portal.dao.pdm.ulsan.MeasureTrxMapper;
import com.bistel.a3.portal.domain.pdm.db.MeasureTrx;
import com.bistel.a3.portal.domain.pdm.enums.BinDataType;
import com.bistel.a3.portal.domain.pdm.work.MeasureTrxWithBin;
import com.bistel.a3.portal.util.SqlSessionUtil;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;

import java.io.ByteArrayInputStream;
import java.io.DataInputStream;
import java.io.IOException;
import java.util.*;

@Service
@ConditionalOnExpression("!${run.standard}")
public class TraceRawDataService implements com.bistel.a3.portal.service.pdm.ITraceRawDataService {
    private static Logger logger = LoggerFactory.getLogger(TraceRawDataService.class);

    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Autowired
    private Map<String, PlatformTransactionManager> trMgrs;

    
    @Override
    public List<List<Object>> getTimewaveData(String fabId, Long measurementId) {
        MeasureTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);
        MeasureTrxWithBin data = mapper.selectMeasureTrxWithBinById(BinDataType.TIMEWAVE.cd(), measurementId);
        if(data == null) return new ArrayList<>();

        return makeTimewaveList(data);
    }

    
    @Override
    public List<List<Double>> getSpectrumData(String fabId, Long measureTrxId) {
        MeasureTrxMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, MeasureTrxMapper.class);
        MeasureTrxWithBin data = mapper.selectMeasureTrxWithBinById(BinDataType.SPECTRUM.cd(), measureTrxId);
        if(data == null) return new ArrayList<>();

        return makeSpectrumList(data);
    }

    
    @Override
    public Map<Long, List<List<Object>>> getTimewaveMap(String fabId, List<MeasureTrx> measureTrx) {
        Map<Long, List<List<Object>>> result = new HashMap<>();
        for(MeasureTrx m : measureTrx) {
            result.put(m.getMeasure_trx_id(), getTimewaveData(fabId, m.getMeasure_trx_id()));
        }
        return result;
    }

    private List<List<Double>> makeSpectrumList(MeasureTrxWithBin data) {
        List<List<Double>> result = new ArrayList<>();

        byte[] binary = data.getBinary();
        int size = binary.length / Double.BYTES;
        double delta = (double) data.getEnd_freq()/data.getSpectra_line();
        try(ByteArrayInputStream bis = new ByteArrayInputStream(binary);
            DataInputStream dis = new DataInputStream(bis)
        ) {
            for(int i=0; i<size; i++) {
                result.add(Arrays.asList(i*delta, dis.readDouble()));
            }
        } catch (IOException e) {
            logger.error(e.getMessage());
            throw new RuntimeException(e);
        }
        return result;
    }

    private List<List<Object>> makeTimewaveList(MeasureTrxWithBin data) {
        List<List<Object>> result = new ArrayList<>();

        byte[] binary = data.getBinary();
        int size = binary.length / Double.BYTES;
        try(ByteArrayInputStream bis = new ByteArrayInputStream(binary);
            DataInputStream dis = new DataInputStream(bis)
        ) {
            for(int i=0; i<size; i++) {
                result.add(Arrays.asList(i, dis.readDouble()));
            }
        } catch (IOException e) {
            logger.error(e.getMessage());
            throw new RuntimeException(e);
        }
        return result;
    }
}
