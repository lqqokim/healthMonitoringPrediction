package com.bistel.a3.portal.dao.pdm.std.master;

import com.bistel.a3.portal.domain.pdm.db.Part;
import com.bistel.a3.portal.domain.pdm.db.PartType;
import com.bistel.a3.portal.domain.pdm.master.Monitoring;
import com.bistel.a3.portal.domain.pdm.master.PartWithParam;
import com.bistel.a3.portal.domain.pdm.std.master.STDParamHealth;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface STDEtcMapper {



    List<Monitoring> selectMonitoring(@Param("name") String name);
    void insertMonitoring(Monitoring monitoring);

    void updateMonitoring(Monitoring monitoring);

    void deleteMonitoring(@Param("rawId") Long rawId);

    List<STDParamHealth> selectParamHealthSeq(@Param("eqpId") Long eqpId, @Param("paramId") Long paramId);

    STDParamHealth selectParamHealth(@Param("eqpId") Long eqpId, @Param("paramId") Long paramId);

    List<STDParamHealth> selectParamHealthOption(@Param("paramId") Long paramId);

    List<Long> selectParamHealthMstRawIdByParamId(@Param("paramId") Long paramId);

    List<Long> selectParamHealthOptMstRawIdByMstRawId(@Param("param_health_mst_rawid") Long param_health_mst_rawid);


    void deleteParamHealthOptionMstPdmByRawId(@Param("param_health_option_mst_rawid") Long param_health_option_mst_rawid);

    void deleteParamHealthMstPdmByRawId(@Param("param_health_mst_rawid") Long param_health_mst_rawid);

    void deleteParamHealthMstAll();

    void deleteParamHealthOptMstAll();

    void insertParamHealth( @Param("param_mst_rawid") Long param_mst_rawid ,@Param("health_logic_mst_rawid") Long health_logic_mst_rawid, @Param("apply_logic_yn") String apply_logic_yn, @Param("userName") String userName);

    void insertParamHealthOptionTotal(@Param("param_health_mst_rawid") Long param_health_mst_rawid
                                    ,@Param("option_name") String option_name
                                    ,@Param("option_value") Long option_value
                                    ,@Param("description") String description
                                    ,@Param("userName") String userName);



    void insertParamHealthOptionSpecific(@Param("param_health_mst_rawid") Long param_health_mst_rawid
                                        ,@Param("option_name") String option_name
                                        ,@Param("option_value") Long option_value
                                        ,@Param("description") String description
                                        ,@Param("userName") String userName);

}
