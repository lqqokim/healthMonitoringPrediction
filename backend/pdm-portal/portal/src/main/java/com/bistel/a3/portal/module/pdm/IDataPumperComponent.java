package com.bistel.a3.portal.module.pdm;

import org.apache.kafka.clients.producer.Producer;

import java.util.Date;

public interface IDataPumperComponent {
    void dataPumpBase(String fabId, String regacyName, String url) throws NoSuchMethodException;

    void dataPump(String fabId, String regacyName, Date from, Date to, Long eqpId, Producer<String, byte[]> fabProducer) throws NoSuchMethodException;

    void alarmUpdate(String fab, String legacy, Date from, Date to, Long eqp_id)throws NoSuchMethodException;

    void dataPumpBase(String fab, String legacy) throws NoSuchMethodException;
}
