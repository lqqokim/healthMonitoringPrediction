package com.bistel.a3.portal.dao.pdm.ulsan.master;

import com.bistel.a3.portal.domain.pdm.db.Bearing;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface BearingMapper {
    List<Bearing> selectList();

    Bearing selectOne(@Param("modelNumber") String modelNumber, @Param("manufacture") String manufacture);

    void insertOne(Bearing bearing);

    void deleteOne(@Param("modelNumber") String modelNumber, @Param("manufacture") String manufacture);

    void updateOne(Bearing bearing);
}
