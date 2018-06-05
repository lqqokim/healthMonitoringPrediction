package com.bistel.a3.common.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.DecimalFormat;
import java.util.Hashtable;
import java.util.UUID;

public class AMessageIdMaker {
	private final static Logger LOG = LoggerFactory.getLogger(AMessageIdMaker.class);
	
    private final static DecimalFormat DECIMAL_FORMAT = new DecimalFormat("00000");

    private static String prefixMessageId = null;
	
    // key : 현재 시간(milisecond까지),  동일 시간일 경우 일련번호를 부여하기 위해서 관리함.
    public static Hashtable<String, Integer> messageIdInfo = new Hashtable<String, Integer>();
    
    static {
        /* Get Host Address */
        String hostAddress = "AMP";  //default AMP
        try {
            hostAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            LOG.error("Host Address get Error!!", e);
        }

        /* Get UUID */
        String uuid16radix = UUID.randomUUID().toString().replaceAll("-", ""); //32자리 16진수
        prefixMessageId = hostAddress + "_" + uuid16radix;
    }
    
    public static String getCreatedMessageId() {
        synchronized (messageIdInfo) {
            String key = prefixMessageId + "_" + System.currentTimeMillis();

            int serialNum = 0;
            if (messageIdInfo.containsKey(key)) {
                serialNum = messageIdInfo.get(key) + 1;
            } else {
                messageIdInfo.clear();
            }

            messageIdInfo.put(key, serialNum);

            return (key + "_" + DECIMAL_FORMAT.format(serialNum));
        }
    }
}
