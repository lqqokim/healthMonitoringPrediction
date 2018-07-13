package com.bistel.pdm.serving.rest;

import com.bistel.pdm.serving.Exception.Message;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

@Singleton
@Path("/master")
@Produces(MediaType.APPLICATION_JSON)
public class StreamUpdateService {
    private static final Logger log = LoggerFactory.getLogger(StreamUpdateService.class);

    private final String clientId = "serving";
    private Producer<String, byte[]> producer;

    public StreamUpdateService() {
        Properties producerProperties = new Properties();
        try (InputStream propStream = new FileInputStream("./config/producer.properties")) {
            producerProperties.load(propStream);

            producerProperties.put("client.id", this.clientId + "_trace");
            producer = new KafkaProducer<>(producerProperties);

        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    @GET
    @Path("/latest/reload")
    public Response getAreaById() {

        try {
            String topicName = "pdm-input-reload";
            producer.send(new ProducerRecord<>(topicName, "all", "http://localhost:28000".getBytes()));

            log.info("stream update.");
            return Response.status(Response.Status.OK).entity("").build();

        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        }
    }
}
