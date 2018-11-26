package com.bistel.a3.portal.service.pdm;

import java.util.List;
import java.util.Map;

import com.bistel.a3.portal.domain.pdm.ImageChartData;

public interface IImageService {

    List<List<Object>> getData(String sessionId, Long fromdate, Long todate);

    List<List<Double>> getRegressionInput(String sessionId, Long fromdate, Long todate);

    List<List<Object>> getOriginData(String sessionId);

    void writeCsv(List<String[]> data, String sessionId);

    ImageChartData drawImageChart(int width, int height, int colorIndex, int boxSize, List<List<Object>> regressionTrend, String sessionId);

    Map<String, Object> createSendMessages(Object data, String conditon, String sessionId);

    int diffdays(Long from, Long to);

}
