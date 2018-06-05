package com.bistel.a3.portal.service.pdm;

import java.util.HashMap;
import java.util.List;

public interface ICurrentService {

    HashMap<String,Object> getCurrentPattern(int iWindow, int iNearCount, int iFarCount, List<Long> times, List<Double> values);
}
