package com.bistel.a3.portal.module.pdm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.*;

@Component
public class FabsComponent {
    @Value("${schedule.fab.list}")
    private String scheduleFabs;

    @Value("${fab.list}")
    private String fabs;

    @Value("${legacy.list}")
    private String legacies;

    private Map<String, String> fabMap;
    private Set<String> scheduleFabSet;

    @PostConstruct
    public void init() {
        setFabMap();
        setSchedulFabMap();
    }

    private void setFabMap() {
        fabMap = new HashMap<>();

        String[] fabList = fabs.split(",");
        String[] legacyList = legacies.split(",");

        for(int i=0; i<fabList.length; i++) {
            fabMap.put(fabList[i], legacyList[i]);
        }
    }

    private void setSchedulFabMap() {
        scheduleFabSet = new HashSet<>();

        String[] fabList = scheduleFabs.split(",");
        scheduleFabSet.addAll(Arrays.asList(fabList));
    }

    public Set<String> fabs() {
        return fabMap.keySet();
    }

    public Set<String> scheduleFabs() {
        return scheduleFabSet;
    }

    public String getLegacy(String fab) {
        return fabMap.get(fab);
    }
}
