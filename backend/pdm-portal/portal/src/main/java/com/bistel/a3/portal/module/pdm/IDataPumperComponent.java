package com.bistel.a3.portal.module.pdm;

import java.util.Date;

public interface IDataPumperComponent {
    void dataPumpBase(String fabId, String regacyName) throws NoSuchMethodException;

    void dataPump(String fabId, String regacyName, Date from, Date to, Long eqpId) throws NoSuchMethodException;

    void alarmUpdate(String fab, String legacy, Date from, Date to, Long eqp_id)throws NoSuchMethodException;
}
