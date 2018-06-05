package com.bistel.a3.portal.dao.pdm.std.trace;

import com.bistel.a3.portal.domain.pdm.DeviceTable;
import com.bistel.a3.portal.domain.pdm.ElectricData;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface STDElectricMapper {

    DeviceTable selectDeviceByEqpId(@Param("eqpId") Long eqpId);

    List<ElectricData> selectElectricData(@Param("tag") String tag, @Param("start") Date start, @Param("end") Date end);
}
