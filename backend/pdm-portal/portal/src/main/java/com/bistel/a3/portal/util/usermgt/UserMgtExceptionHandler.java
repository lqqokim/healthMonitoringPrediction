package com.bistel.a3.portal.util.usermgt;

import org.apache.catalina.connector.ClientAbortException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;


public class UserMgtExceptionHandler {
	private final static Logger LOG = LoggerFactory.getLogger(UserMgtExceptionHandler.class);

	@ExceptionHandler(value = ClientAbortException.class)
	public void handleControllerException(ClientAbortException e) {
		LOG.debug("UserMgtExceptionHandler Exception(ClientAbortException)!!!", e);
		// ignore
	}

	@ExceptionHandler(value = Exception.class)
	public @ResponseBody ResponseEntity<String> handleControllerException(Exception e) {
		LOG.error("UserMgtExceptionHandler Exception[" + System.currentTimeMillis()	+ "] :", e);
		return new ResponseEntity<String>("UserMgtExceptionHandler Exception : " + e, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
