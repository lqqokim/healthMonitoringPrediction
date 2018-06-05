package com.bistel.a3.portal.service.pdm;

import java.util.HashMap;
import java.util.List;

public interface IElectricCurrentSerivce {
    List<List<Object>> getElectriccurrent(String fabId, Long eqpId, Long fromdate, Long todate);
    HashMap<String, Object> getCurrentPattern(int iWindow, int iNearCount, int iFarCount, List<Long> times, List<Double> values) ;
}
