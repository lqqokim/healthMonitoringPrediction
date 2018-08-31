package com.bistel.pdm.batch.model;

public class StatusWindow {

    private String currentStatusCode;
    private Long currentLongTime;

    private String previousStatusCode;
    private Long previousLongTime;

    public void addCurrent(String currentStatusCode, Long currentLongTime){
        this.currentStatusCode = currentStatusCode;
        this.currentLongTime = currentLongTime;
    }

    public void addPrevious(String previousStatusCode, Long previousLongTime){
        this.previousStatusCode = previousStatusCode;
        this.previousLongTime = previousLongTime;
    }

    public String getCurrentStatusCode() {
        return currentStatusCode;
    }

    public Long getCurrentLongTime() {
        return currentLongTime;
    }

    public String getPreviousStatusCode() {
        return previousStatusCode;
    }

    public Long getPreviousLongTime() {
        return previousLongTime;
    }
}
