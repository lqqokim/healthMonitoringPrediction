package com.bistel.pdm.lambda.kafka;

import com.bistel.pdm.lambda.kafka.master.MasterDataUpdater;
import org.junit.Test;

import static org.junit.Assert.*;

public class AbstractPipelineTest {

    @Test
    public void reloadTest() {
        String tartgetUrl = "http://192.168.7.230:28000/pdm/api/master/latest/features";
        MasterDataUpdater.updateParamFeatureDataSet(tartgetUrl);
    }
}