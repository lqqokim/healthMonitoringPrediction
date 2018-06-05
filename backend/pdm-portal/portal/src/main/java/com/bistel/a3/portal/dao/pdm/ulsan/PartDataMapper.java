package com.bistel.a3.portal.dao.pdm.ulsan;

import com.bistel.a3.portal.domain.pdm.db.Bearing;
import com.bistel.a3.portal.domain.pdm.db.ManualRpm;
import com.bistel.a3.portal.domain.pdm.db.Part;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface PartDataMapper {
    List<Part> selectPartsByEqpWithPartType(@Param("param_id") Long param_id, @Param("part_type_id") Integer part_type_id);

    Bearing selectBearingInfo(@Param("manufacture") String manufacture, @Param("modelNumber") String modelNumber);

    @MapKey("param_id")
    Map<Long, ManualRpm> selectManualRpm();
}
