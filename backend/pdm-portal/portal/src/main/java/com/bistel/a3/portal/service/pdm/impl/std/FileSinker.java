package com.bistel.a3.portal.service.pdm.impl.std;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.BufferedOutputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class FileSinker {
    private static Logger logger = LoggerFactory.getLogger(FileSinker.class);

    private final Map<String, BufferedOutputStream> outputStream = new ConcurrentHashMap<>();
    private Map<String, String> filePathMap = new HashMap<>();

    public FileSinker() {
    }

    public void write(String filePath, String data) {
        try{
            getStream(filePath).write(data.getBytes());
            getStream(filePath).flush();
        } catch(Exception e){
            e.printStackTrace();
        }
    }

    public void flush(String filePath){
        try{
            getStream(filePath).flush();
        } catch (Exception e){
            e.printStackTrace();
        }

    }

    private BufferedOutputStream getStream(String filePath) throws FileNotFoundException {
        BufferedOutputStream stream = outputStream.get(filePath);

        if(stream == null){
            stream = new BufferedOutputStream(new FileOutputStream(filePath, true));
            outputStream.put(filePath, stream);
        }
        return stream;
    }

    public void close(String key, String filePath) {
        //String filePath="/home/bistel/"+ File.separator+fabId+File.separator+areaName+File.separator+eqpName+File.separator+"sensor_"+todayDate+".log";

        if(this.filePathMap.containsKey(key)){
            String prevFilePath = this.filePathMap.get(key);
            if(!filePath.equalsIgnoreCase(prevFilePath)){
                BufferedOutputStream stream = outputStream.get(prevFilePath);
                try {
                    stream.close();
                    outputStream.remove(prevFilePath);
                    this.filePathMap.put(key, filePath);
                    logger.info("{} closed.", prevFilePath);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        } else {
            this.filePathMap.put(key, filePath);
        }
    }

    public void close(){
        try{
            for(BufferedOutputStream stream : outputStream.values()){
                stream.close();
            }
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}
