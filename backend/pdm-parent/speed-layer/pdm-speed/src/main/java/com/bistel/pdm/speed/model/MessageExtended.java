package com.bistel.pdm.speed.model;

public class MessageExtended {

    private final static String SEPARATOR = ",";

    private Long longTime;
    private String previousStatus;
    private String currentStatus;

    public MessageExtended(Long longTime, String statusContext){
        this.longTime = longTime;

        String[] recordColumns = statusContext.split(SEPARATOR, -1);
        this.currentStatus = recordColumns[recordColumns.length - 4];
        this.previousStatus = recordColumns[recordColumns.length - 3];
    }

    public Long getLongTime() {
        return longTime;
    }

    public String getPreviousStatus() {
        return previousStatus;
    }

    public String getCurrentStatus() {
        return currentStatus;
    }
}
