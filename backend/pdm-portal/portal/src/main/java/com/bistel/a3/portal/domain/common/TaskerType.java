package com.bistel.a3.portal.domain.common;

/**
 * Created by yohan on 15. 11. 3.
 */
public class TaskerType {
    private Long taskerTypeId;
    private String name;
    private String title;
    private String description;

    public Long getTaskerTypeId() {
        return taskerTypeId;
    }

    public void setTaskerTypeId(Long taskerTypeId) {
        this.taskerTypeId = taskerTypeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
