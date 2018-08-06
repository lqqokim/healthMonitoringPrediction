package com.bistel.pdm.speed.processor;

import com.bistel.pdm.lambda.kafka.master.MasterDataCache;
import com.bistel.pdm.lambda.kafka.master.MasterDataUpdater;
import org.apache.kafka.streams.processor.AbstractProcessor;
import org.apache.kafka.streams.processor.ProcessorContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Reload metadata in-memory.
 */
public class ReloadMetadataProcessor extends AbstractProcessor<String, byte[]> {
    private static final Logger log = LoggerFactory.getLogger(ReloadMetadataProcessor.class);

    private final static String SEPARATOR = ",";

    @Override
    public void init(ProcessorContext context) {
        super.init(context);
    }

    @Override
    public void process(String partitionKey, byte[] streamByteRecord) {
        String recordValue = new String(streamByteRecord);
        String[] recordColumns = recordValue.split(SEPARATOR);
        String servingAddr = recordColumns[0];

        log.info("request to update master...");

        String targetUrl = servingAddr + "/pdm/api/master/latest/equipment/" + partitionKey;
        log.info("call to {}", targetUrl);
        MasterDataUpdater.updateEqpMasterDataSet(partitionKey, targetUrl);

        targetUrl = servingAddr + "/pdm/api/master/latest/param/" + partitionKey;
        log.info("call to {}", targetUrl);
        MasterDataUpdater.updateParameterMasterDataSet(partitionKey, targetUrl);

        targetUrl = servingAddr + "/pdm/api/master/latest/event/" + partitionKey;
        log.info("call to {}", targetUrl);
        MasterDataUpdater.updateEventMasterDataSet(partitionKey, targetUrl);

//        targetUrl = servingAddr + "/pdm/api/master/latest/spec/" + partitionKey;
//        log.info("call to {}", targetUrl);
//        MasterDataUpdater.updateParamSpecDataSet(targetUrl);

        targetUrl = servingAddr + "/pdm/api/master/latest/health/" + partitionKey;
        log.info("call to {}", targetUrl);
        MasterDataUpdater.updateParamHealthDataSet(partitionKey, targetUrl);

        targetUrl = servingAddr + "/pdm/api/master/latest/smtp";
        log.info("call to {}", targetUrl);
        MasterDataUpdater.updateSmtpConfigDataSet(targetUrl);

        log.info("all master data(equipment, param, event, spec, health, smtp) is reloaded.");

        context().forward(partitionKey, streamByteRecord);
        context().commit();
    }
}
