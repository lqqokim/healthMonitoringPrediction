package com.bistel.a3.portal.domain.pdm;

import com.bistel.a3.portal.domain.pdm.db.Area;

import java.util.List;

public class AreaWithStatus extends Area {
    private Score score;
    private Long alarm = 0L;
    private Long warning = 0L;
    private Long inactive = 0L;
    private Long normal = 0L;
    private List<AreaWithStatus> children;

    public Long getAlarm() {
        return alarm;
    }

    public void setAlarm(Long alarm) {
        this.alarm = alarm;
    }

    public Long getWarning() {
        return warning;
    }

    public void setWarning(Long warning) {
        this.warning = warning;
    }

    public Long getInactive() {
        return inactive;
    }

    public void setInactive(Long inactive) {
        this.inactive = inactive;
    }

    public Long getNormal() {
        return normal;
    }

    public void setNormal(Long normal) {
        this.normal = normal;
    }

    public List<AreaWithStatus> getChildren() {
        return children;
    }

    public void setChildren(List<AreaWithStatus> children) {
        this.children = children;
    }

    public Score getScore() {
        return score;
    }

    public void setScore(Score score) {
        this.score = score;
    }
}
