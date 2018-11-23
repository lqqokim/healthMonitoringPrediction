//package com.bistel.pdm.speed.processor;
//
//import com.bistel.pdm.data.stream.MailConfigMaster;
//import com.bistel.pdm.lambda.kafka.master.MasterCache;
//import org.apache.commons.mail.DefaultAuthenticator;
//import org.apache.commons.mail.Email;
//import org.apache.commons.mail.SimpleEmail;
//import org.apache.kafka.streams.processor.AbstractProcessor;
//import org.apache.kafka.streams.processor.ProcessorContext;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
///**
// * send alarm messages to
// */
//public class SendMailProcessor extends AbstractProcessor<String, byte[]> {
//    private static final Logger log = LoggerFactory.getLogger(SendMailProcessor.class);
//
//    private final String userName = "bisteldemo@gmail.com";
//    private final String password = "bistel!@";
//
//    @Override
//    public void init(ProcessorContext context) {
//        super.init(context);
//    }
//
//    @Override
//    public void process(String partitionKey, byte[] streamByteRecord) {
//        String message = new String(streamByteRecord);
//
//        try {
//            MailConfigMaster conf = MasterCache.Mail.get(partitionKey);
//
//            if (conf != null && conf.getFromAddr().length() > 0) {
//                Email email = new SimpleEmail();
//                email.setHostName(conf.getHost());
//                //email.setSmtpPort(conf.getPort());
//                email.setSmtpPort(25);
//                email.setSslSmtpPort("465");
//
//                if (conf.getSsl().equalsIgnoreCase("Y")) {
//                    email.setSSLOnConnect(true);
//                } else {
//                    email.setSSLOnConnect(false);
//                }
//
//                email.setAuthenticator(new DefaultAuthenticator(userName, password));
//
//                email.setFrom("bisteldemo@gmail.com");
//                email.setSubject("[HMP-ALARM] - Alarm has occurred.");
//                email.setMsg(message);
//
//                String[] toArray = conf.getToAddr().split(",");
//                for (String to : toArray) {
//                    email.addTo(to);
//                }
//                email.send();
//
//                log.info("sent mail to : {}", conf.getToAddr());
//            }
//        } catch (Exception e) {
//            log.error(e.getMessage(), e);
//        }
//    }
//}
