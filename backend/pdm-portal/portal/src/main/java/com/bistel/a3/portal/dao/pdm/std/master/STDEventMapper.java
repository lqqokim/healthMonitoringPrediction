package com.bistel.a3.portal.dao.pdm.std.master;

import com.bistel.a3.portal.domain.pdm.AreaWithTree;
import com.bistel.a3.portal.domain.pdm.Node;
import com.bistel.a3.portal.domain.pdm.db.Area;
import com.bistel.a3.portal.domain.pdm.db.EqpEvent;
import com.bistel.a3.portal.domain.pdm.master.AreaWithChildren;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface STDEventMapper {

    void insert(EqpEvent event);
    void update(EqpEvent event);
    List<EqpEvent> select(@Param("eqpId") Long eqpId);
    List<EqpEvent> selectAll();

    void updateEqpTimeout(@Param("eqpId") Long eqpId, @Param("timeout") Long timeout);

}
