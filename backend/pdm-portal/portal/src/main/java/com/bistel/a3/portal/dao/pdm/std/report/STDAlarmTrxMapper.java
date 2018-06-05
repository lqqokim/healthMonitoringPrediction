package com.bistel.a3.portal.dao.pdm.std.report;

import com.bistel.a3.portal.domain.pdm.db.AlarmTrx;
import com.bistel.a3.portal.domain.pdm.db.EqpAlarmTrx;
import org.apache.ibatis.annotations.Param;

import java.util.Date;

public interface STDAlarmTrxMapper {
    void insertAlarm(AlarmTrx alarmTrx);

    void deleteAlarm(AlarmTrx alarmTrx);
    void deleteAlarmByEqpId(@Param("eqpId") Long eqpId, @Param("start") Date start, @Param("end") Date end);


    void insertEqpAlarm(@Param("userName") String userName,@Param("eqpId") Long eqpId, @Param("start") Date start, @Param("end") Date end);

    void deleteEqpAlarm(@Param("eqpId") Long eqpId, @Param("start") Date start, @Param("end") Date end);

    EqpAlarmTrx selectStartAlarm(@Param("eqpId") Long eqpId, @Param("status") Integer status, @Param("start") Date start, @Param("end") Date end);
}
