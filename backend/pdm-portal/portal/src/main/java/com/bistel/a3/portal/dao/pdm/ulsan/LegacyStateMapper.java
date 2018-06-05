package com.bistel.a3.portal.dao.pdm.ulsan;

import com.bistel.a3.portal.domain.pdm.EqpWithArea;
import com.bistel.a3.portal.domain.pdm.LegacyState;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface LegacyStateMapper {
    LegacyState selectState(@Param("eqps") List<EqpWithArea> eqps, @Param("start")  Date start, @Param("end") Date end);

    LegacyState selectStateByEqpId(@Param("eqpId") Long eqpId, @Param("start")  Date start, @Param("end") Date end);
}
