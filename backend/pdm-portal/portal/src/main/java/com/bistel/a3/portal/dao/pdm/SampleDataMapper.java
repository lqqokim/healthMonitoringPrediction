package com.bistel.a3.portal.dao.pdm;

import com.bistel.a3.portal.domain.pdm.Count;
import com.bistel.a3.portal.domain.pdm.ParamVariance;
import com.bistel.a3.portal.domain.pdm.db.SampleData;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface SampleDataMapper {

    List<SampleData> selectSampleDataByRawId(@Param("rawId") Long rawId);

}
