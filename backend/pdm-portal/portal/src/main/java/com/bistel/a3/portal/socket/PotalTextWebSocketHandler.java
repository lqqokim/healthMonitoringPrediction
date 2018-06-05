package com.bistel.a3.portal.socket;

import com.bistel.a3.common.util.JsonUtil;
import com.bistel.a3.portal.enums.SESSION_ATTRIBUTE;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

/**
 * Created by yohan on 1/12/15.
 */
public abstract class PotalTextWebSocketHandler extends TextWebSocketHandler {
    protected Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        logger.debug("{} is established.", session.getId() );
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        logger.debug("{} received message, it is {}", session.getId(), message.getPayload());
        handlTextMessage(session, message.getPayload());
    }

    protected abstract void handlTextMessage(WebSocketSession session, String payload) throws IOException;

    private boolean checkSession(WebSocketSession session) {
        Object obj = session.getAttributes().get(SESSION_ATTRIBUTE.userData.name());
        if(obj == null) return true;

        return false;
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        logger.debug("{} is closed.", session.getId());
    }

    protected void sendMessage(WebSocketSession session, Object message) {
		try {
			if(message instanceof String) {
				session.sendMessage(new TextMessage((String)message));
			} else {
				session.sendMessage(new TextMessage(JsonUtil.toString(message)));
			}
		} catch (IOException e) {
			logger.error(e.getMessage());
			throw new RuntimeException(e);
		}
	}
}
