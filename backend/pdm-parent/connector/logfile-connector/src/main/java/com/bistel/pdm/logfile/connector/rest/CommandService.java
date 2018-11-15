package com.bistel.pdm.logfile.connector.rest;

import com.bistel.pdm.logfile.connector.exception.Message;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Singleton;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

/**
 *
 */
@Singleton
@Path("/cache")
@Produces(MediaType.APPLICATION_JSON)
public class CommandService {
    private static final Logger log = LoggerFactory.getLogger(CommandService.class);

    //private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private final String clientId = "connector";
    private Producer<String, byte[]> producer;

    public CommandService() {
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
    @Path("/latest/reload/{eqpid}")
    public Response getReload(@PathParam("eqpid") String eqpId) {
        try {


            log.info("requested to {} to update the master information.", eqpId);
            return Response.status(Response.Status.OK).entity(eqpId).build();

        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        } finally {
            producer.close();
        }
    }
}
