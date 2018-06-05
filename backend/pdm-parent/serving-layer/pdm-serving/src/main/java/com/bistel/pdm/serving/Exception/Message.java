package com.bistel.pdm.serving.Exception;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 *
 */
public final class Message {

    public Message() {
        super();
    }

    public Message(String content) {
        super();
        this.content = content;
    }

    @JsonProperty("message")
    private String content;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
