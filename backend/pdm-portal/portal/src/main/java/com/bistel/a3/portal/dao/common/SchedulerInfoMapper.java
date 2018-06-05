package com.bistel.a3.portal.dao.common;

import com.bistel.a3.portal.domain.common.SchedulerInfo;
import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;

public interface SchedulerInfoMapper {
	ArrayList<SchedulerInfo> selectSchedulerInfos(@Param("cutoffType") String cutoffType); 

}
