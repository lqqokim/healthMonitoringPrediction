package com.bistel.pdm.serving.rest;

import com.bistel.pdm.data.stream.EquipmentMaster;
import com.bistel.pdm.lambda.kafka.master.MasterCache;
import com.bistel.pdm.lambda.kafka.partitioner.CustomStreamPartitioner;
import com.bistel.pdm.serving.Exception.Message;
import com.bistel.pdm.serving.HostInfo;
import com.bistel.pdm.serving.jdbc.dao.StreamingMasterDataDao;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.PartitionInfo;
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
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Properties;

/**
 *
 */
@Singleton
@Path("/master")
@Produces(MediaType.APPLICATION_JSON)
public class StreamUpdateService {
    private static final Logger log = LoggerFactory.getLogger(StreamUpdateService.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");

    private final String inputReload1Topic = "pdm-input-trace";
    private final String inputReload2Topic = "pdm-input-raw";

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
    @Path("/latest/reload/{eqpid}")
    public Response getReload(@PathParam("eqpid") String eqpId) {
        try {
            Timestamp timestamp = new Timestamp(System.currentTimeMillis());
            String msg = dateFormat.format(timestamp) + ",CMD-REFRESH-CACHE";

            StreamingMasterDataDao repository = new StreamingMasterDataDao();
            EquipmentMaster masterDataSet = repository.getEqpMasterDataSet(eqpId);

            List<PartitionInfo> partitions = producer.partitionsFor(inputReload1Topic);
            int partitionNum = masterDataSet.getEqpRawId().intValue() % partitions.size();

            producer.send(new ProducerRecord<>(inputReload1Topic, partitionNum, eqpId, msg.getBytes()));

            partitions = producer.partitionsFor(inputReload2Topic);
            partitionNum = masterDataSet.getEqpRawId().intValue() % partitions.size();

            producer.send(new ProducerRecord<>(inputReload2Topic, partitionNum, eqpId, msg.getBytes()));

            log.info("requested to {} to update the master information. partition:{}", eqpId, partitionNum);
            return Response.status(Response.Status.OK).entity(eqpId).build();

        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return Response.status(Response.Status.NOT_FOUND).entity(new Message(e.getMessage())).build();
        } finally {
            producer.close();
        }
    }
}
