package com.bistel.a3.portal.dao.pdm.db;

import org.apache.ibatis.annotations.Param;

public interface ProcedureMapper {
    void createPartition(@Param("date") String date, @Param("tableName") String tableName);
}
