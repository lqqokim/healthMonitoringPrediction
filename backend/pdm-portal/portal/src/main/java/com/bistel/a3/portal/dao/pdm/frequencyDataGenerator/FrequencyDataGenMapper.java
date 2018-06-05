package com.bistel.a3.portal.dao.pdm.frequencyDataGenerator;

import com.bistel.a3.portal.domain.frequencyData.FrequencyDataGenConfig;
import com.bistel.a3.portal.domain.frequencyData.FrequencyDataGenHarmonicConfig;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;


public interface FrequencyDataGenMapper {
    int insertDataGenConfig(FrequencyDataGenConfig frequencyDataGenConfig);
    int updateDataGenConfig(@Param("rawid") Long rawid,
                            @Param("eqpId") Long eqpId,
                            @Param("paramId") Long paramId,
                            @Param("modify_dtts") Date modify_dtts,
                            @Param("samplingTime") Double samplingTime,
                            @Param("samplingCount") Integer samplingCount,
                            @Param("duration") Long duration,
                            @Param("rpm") Long rpm
    );

    int deleteDataGenConfig(@Param("rawid") long rawid);

    int insertDataGenHarmonicConfig(FrequencyDataGenHarmonicConfig frequencyDataGenHarmonicConfig);
    int updateDataGenHarmonicConfig(
                                    @Param("harmonicName") String harmonicName,
                                    @Param("harmonicFrequency") Double harmonicFrequency,
                                    @Param("amplitude_current") Double amplitude_current,
                                    @Param("amplitude_start") Double amplitude_start,
                                    @Param("amplitude_end") Double amplitude_end,
                                    @Param("frequency_data_config_rawid") Long frequency_data_config_rawid);

    int deleteDataGenHarmonicConfig(@Param("frequency_data_config_rawid") Long frequency_data_config_rawid,@Param("harmonicName") String harmonicName);
    int deleteDataGenHarmonicConfigByParentId(@Param("parent_rawid") long parent_rawid);





    List<FrequencyDataGenConfig> getDataGenConfig();
    List<FrequencyDataGenHarmonicConfig> getDataGenHarmonicConfig(@Param("rawid") long rawid);

    List<FrequencyDataGenConfig> getDataGenConfigByRawid(@Param("rawid") long rawid);
    List<FrequencyDataGenConfig> getDataGenConfigByEqpIdParamId(@Param("eqpId") long eqpId,@Param("paramId") long paramId);

//    int insertOverall(@Param("eqpId") long eqpId, @Param("paramId") long paramId, @Param("overall") double overall);
//    int insertDatas(FrequencyDataGenDatas datas);
//    List<FrequencyData> getDatas(@Param("eqpId") long eqpId, @Param("fromDate") Date fromDate, @Param("toDate") Date toDate);
//    List<FrequencyData> getDatasInfoByDate(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate);
//    List<FrequencyData> getData(@Param("rawid") long rawid);
//    List<HashMap<String,Object>> getOverall(@Param("eqpId") long eqpId, @Param("paramId") long paramId);

}
