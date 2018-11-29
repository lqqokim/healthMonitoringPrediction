package com.bistel.pdm.scheduler.service.impl;

import com.bistel.pdm.scheduler.service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Service
public class WebSocketServiceImpl implements WebSocketService {

    private static final String BROKER_NAME = "/refreshcache/";

    private final SimpMessagingTemplate template;

    @Autowired
    public WebSocketServiceImpl(SimpMessagingTemplate template) {
        this.template = template;
    }

    @Override
    public void broadcast(String id, String message) {
        this.template.convertAndSend(BROKER_NAME + id, message);
    }

    @Override
    public void onReceivedMessage(String message) {
        // to do something
    }
}
