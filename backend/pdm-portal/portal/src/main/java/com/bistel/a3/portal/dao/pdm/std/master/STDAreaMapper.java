package com.bistel.a3.portal.dao.pdm.std.master;

import com.bistel.a3.portal.domain.pdm.AreaWithTree;
import com.bistel.a3.portal.domain.pdm.Node;
import com.bistel.a3.portal.domain.pdm.db.Area;
import com.bistel.a3.portal.domain.pdm.master.AreaWithChildren;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface STDAreaMapper {
    List<AreaWithChildren> selectList(@Param("parentId") Long parentId);

    List<Area> selectAllArea();

    Area selectOne(@Param("areaId") Long areaId);

    void insertOne(Area area);

    void deleteOne(@Param("areaId") Long areaId);

    void updateOne(Area area);

    List<AreaWithTree> selectAreaWithTree();
    List<Node> selectNodes();

}
