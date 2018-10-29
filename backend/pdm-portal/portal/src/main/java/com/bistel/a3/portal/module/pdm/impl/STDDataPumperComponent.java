package com.bistel.a3.portal.module.pdm.impl;

import com.bistel.a3.portal.module.pdm.IDataPumperComponent;
import org.apache.kafka.clients.producer.Producer;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class STDDataPumperComponent implements IDataPumperComponent {

    @Override
    public void dataPumpBase(String fabId, String regacyName) {

    }

    @Override
    public void dataPumpBase(String fabId, String regacyName, String url) throws NoSuchMethodException {

    }

    @Override
    public void dataPump(String fabId, String regacyName, Date from, Date to, Long eqpId, Producer<String, byte[]> fabProducer) throws NoSuchMethodException {

    }

    @Override
    public void alarmUpdate(String fab, String legacy, Date from, Date to, Long eqp_id) throws NoSuchMethodException {

    }
}
