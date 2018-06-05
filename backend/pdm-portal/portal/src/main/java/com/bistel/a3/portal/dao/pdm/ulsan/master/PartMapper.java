package com.bistel.a3.portal.dao.pdm.ulsan.master;

import com.bistel.a3.portal.domain.pdm.db.PartType;
import com.bistel.a3.portal.domain.pdm.master.PartWithParam;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PartMapper {
    List<PartWithParam> selectList(@Param("eqpId") Long eqpId);

    PartWithParam selectOne(@Param("partId") Long partId);

    void insertOne(PartWithParam part);

    void insertLnk(PartWithParam part);

    void updateOne(PartWithParam part);

    void deleteOne(@Param("partId") Long partId);

    void deleteLnk(@Param("partId") Long partId);

    List<PartType> selectTypeList();

}
