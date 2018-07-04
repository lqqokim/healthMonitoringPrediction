package com.bistel.a3.portal.dao.pdm.std.summary;

import com.bistel.a3.portal.domain.pdm.AreaFaultCountSummary;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface STDSummaryMapper {


    List<AreaFaultCountSummary> selectStatusCountSummary(@Param("fromdate") Date fromdate, @Param("todate") Date todate);



}
