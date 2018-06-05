package com.bistel.a3.portal.module.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;

@Component
public class RJavaComponent {
    private static Logger logger = LoggerFactory.getLogger(RJavaComponent.class);

//    private Rengine rengine;

//    @Value("${rjava.debug}")
//    private boolean DEBUG;

    @Autowired
    private ResourceLoader resourceLoader;

    @PostConstruct
    public void initializeREngine() throws IOException {
//        rengine = work Rengine(work String[] { "--no-save" }, false, null);
//        if(DEBUG) {
//            rengine.DEBUG = 2;
//        }
//
//        if (!Rengine.versionCheck()) {
//            logger.error("** Version mismatch - Java files don't match library version.");
//            throw work RuntimeException("version mismatch");
//        }
//
//        logger.info("Rengine created, waiting for R");
//        if (!rengine.waitForR()) {
//            logger.error("Cannot load R");
//        }
//
//        source("global.R");
//        source("HealthIndex.R");
//        source("ContourChart.R");
//        source("EffectChart.R");
//        source("EffectData.R");
    }

    private void source(String fileName) throws IOException {
//        URL url = resourceLoader.getResource("classpath:rscript/" + fileName).getURL();
//        rengine.eval(String.format("source('%s')", url.getProtocol() + "://" + url.getPath()));
    }

    /*@Async
    public synchronized Future<REXP> run(String ... expressions) throws IOException {
        int i=0;
        for(; i<expressions.length-1; i++) {
            rengine.eval(expressions[i]);
        }
        REXP result = rengine.eval(expressions[i]);
        return work AsyncResult<>(result);
    }*/
}
