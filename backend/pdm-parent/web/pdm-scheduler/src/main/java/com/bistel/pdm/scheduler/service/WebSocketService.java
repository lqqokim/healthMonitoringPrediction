package com.bistel.pdm.scheduler.service;

public interface WebSocketService {

    public void broadcast(String id, String message);

    public void onReceivedMessage(String message);

}
