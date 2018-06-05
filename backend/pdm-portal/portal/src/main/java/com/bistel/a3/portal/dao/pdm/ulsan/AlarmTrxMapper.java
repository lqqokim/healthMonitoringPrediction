package com.bistel.a3.portal.dao.pdm.ulsan;

import com.bistel.a3.portal.domain.pdm.db.AlarmTrx;
import com.bistel.a3.portal.domain.pdm.db.EqpAlarmTrx;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

public interface AlarmTrxMapper {
    void insertAlarm(AlarmTrx alarmTrx);

    void deleteAlarm(AlarmTrx alarmTrx);

    void insertEqpAlarm(@Param("eqpId") Long eqpId, @Param("start") Date start, @Param("end") Date end);

    void deleteEqpAlarm(@Param("eqpId") Long eqpId, @Param("start") Date start, @Param("end") Date end);

    EqpAlarmTrx selectStartAlarm(@Param("eqpId") Long eqpId, @Param("status") Integer status, @Param("start") Date start, @Param("end") Date end);
}
