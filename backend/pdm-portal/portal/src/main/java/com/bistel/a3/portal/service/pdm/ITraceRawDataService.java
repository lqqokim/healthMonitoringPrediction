package com.bistel.a3.portal.service.pdm;

import com.bistel.a3.portal.domain.pdm.db.MeasureTrx;

import java.util.List;
import java.util.Map;

public interface ITraceRawDataService {
    List<List<Object>> getTimewaveData(String fabId, Long measurementId);

    List<List<Double>> getSpectrumData(String fabId, Long measureTrxId);

    Map<Long, List<List<Object>>> getTimewaveMap(String fabId, List<MeasureTrx> measureTrx);
}
