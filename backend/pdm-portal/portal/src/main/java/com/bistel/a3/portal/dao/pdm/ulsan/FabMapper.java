package com.bistel.a3.portal.dao.pdm.ulsan;

import com.bistel.a3.portal.domain.pdm.*;
import com.bistel.a3.portal.domain.pdm.db.Eqp;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface FabMapper {
    List<EqpWithArea> selectEqpsByArea(@Param("area_id") Long area_id);

    EqpStatus selecEqpStatusByEqpId(@Param("eqpId") Long eqpId, @Param("start") Date start, @Param("end") Date end, @Param("from90") Date from90);

    List<AreaWithTree> selectAreaWithTree();

    AreaWithStatus selectAreaStatusByAreaId(@Param("area_id") Long area_id, @Param("start") Date start, @Param("end") Date end);

    List<Node> selectNodes();

    void deleteBatchJobHst(BatchJobHst batchJobHst);

    void insertBatchJobHst(BatchJobHst batchJobHst);

    List<BatchJobHst> selectJobHst(@Param("start") Date start, @Param("end") Date end, @Param("job_type_cd") String job_type_cd);

    Eqp selectEqpById(@Param("eqpId") Long eqpId);

    Eqp selectEqpByMeasureTrxId(@Param("measureTrxId") Long measureTrxId);

    List<Eqp> selectEqps();
}
