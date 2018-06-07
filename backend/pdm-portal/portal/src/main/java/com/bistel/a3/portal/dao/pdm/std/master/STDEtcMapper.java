package com.bistel.a3.portal.dao.pdm.std.master;

import com.bistel.a3.portal.domain.pdm.db.Part;
import com.bistel.a3.portal.domain.pdm.db.PartType;
import com.bistel.a3.portal.domain.pdm.master.Monitoring;
import com.bistel.a3.portal.domain.pdm.master.PartWithParam;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface STDEtcMapper {



    List<Monitoring> selectMonitoring(@Param("name") String name);
    void insertMonitoring(Monitoring monitoring);

    void updateMonitoring(Monitoring monitoring);

    void deleteMonitoring(@Param("rawId") Long rawId);

}
