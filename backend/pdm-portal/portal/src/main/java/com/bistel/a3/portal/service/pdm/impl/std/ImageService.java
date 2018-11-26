package com.bistel.a3.portal.service.pdm.impl.std;

import au.com.bytecode.opencsv.CSVWriter;
import com.bistel.a3.common.util.imageChart.ImageChart;
import com.bistel.a3.portal.domain.pdm.ImageChartData;
import com.bistel.a3.portal.domain.pdm.SeriesInfo;
import com.bistel.a3.portal.service.pdm.IImageService;
import au.com.bytecode.opencsv.CSVReader;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

@Service
@ConditionalOnExpression("${run.standard}")
public class ImageService implements IImageService{

    public List<List<Object>> getData(String sessionId, Long fromdate, Long todate) {
        List<List<Object>> returnValue = new ArrayList<>();
        List<String[]> fileData = new ArrayList<String[]>();

        String currentPath =new File("").getAbsolutePath();
        String filePath = currentPath +File.separator+"hmp_data"+File.separator+sessionId+".csv";

        fileData = readCsv(filePath);
        Iterator<String[]> it = fileData.iterator();
        while (it.hasNext()) {
            String[] colData = (String[]) it.next();
            Long timestamp = Long.valueOf(colData[0]);
            Double value = Double.valueOf(colData[1]);
            if(timestamp >= fromdate && timestamp <= todate){
                List<Object> returnCol = new ArrayList<>();
                returnCol.add(timestamp);
                returnCol.add(value);
                returnValue.add(returnCol);
            }
        }
        return returnValue;
    }

    public List<List<Object>> getOriginData(String sessionId) {
        List<List<Object>> returnValue = new ArrayList<>();
        List<String[]> fileData = new ArrayList<String[]>();

        String currentPath =new File("").getAbsolutePath();
        String filePath = currentPath +File.separator+"hmp_data"+File.separator+sessionId+".csv";
        fileData = readCsv(filePath);

        Iterator<String[]> it = fileData.iterator();
        while (it.hasNext()) {
            String[] colData = (String[]) it.next();
            Long timestamp = Long.valueOf(colData[0]);
            Double value = Double.valueOf(colData[1]);

            List<Object> returnCol = new ArrayList<>();
            returnCol.add(timestamp);
            returnCol.add(value);
            returnValue.add(returnCol);
        }
        return returnValue;
    }

    public int diffdays(Long from, Long to)
    {
        long diff = to-from;
        int diffDays = (int) (diff / (24 * 60 * 60 * 1000));

        return diffDays;
    }

    //이미지차트 생성
    public ImageChartData drawImageChart(int width, int height, int colorIndex, int boxSize, List<List<Object>> regressionTrend, String sessionId) {

        Long xMin = null;
        Long xMax = null;
        Double yMin = null;
        Double yMax = null;

        ImageChartData imageChartData = new ImageChartData();

        for(int i=0;i<regressionTrend.size();i++){

            List<Object> rowData = regressionTrend.get(i);
            Long timestamp = (Long)rowData.get(0);
            Double value = (Double) rowData.get(1);

            if(xMin == null ||  timestamp < xMin){
                xMin = timestamp;
            }
            if(xMax == null || timestamp > xMax){
                xMax = timestamp;
            }
            if(yMin == null || value < yMin){
                yMin = value;
            }
            if(yMax == null || value > yMax){
                yMax = value;
            }
        }

        ImageChart imageChart = new ImageChart(width,height,xMin,xMax,yMin,yMax,ImageChart.getDefIntColor(colorIndex),boxSize);
        for(int i=0;i<regressionTrend.size();i++){

            List<Object> rowData = regressionTrend.get(i);
            Long timestamp = (Long)rowData.get(0);
            Double value = (Double) rowData.get(1);

            imageChart.addPoint(timestamp,value);
        }
        imageChartData.setHeight(height);
        imageChartData.setImage(imageChart.getImage());
        imageChartData.setWidth(width);
        imageChartData.setSessionId(sessionId);
        imageChartData.setShowProgress(false);
        imageChartData.setxMin(xMin);
        imageChartData.setxMax(xMax);
        imageChartData.setyMin(yMin);
        imageChartData.setyMax(yMax);
        imageChartData.setX_axis_type("DateTime");
        SeriesInfo seriesInfo = new SeriesInfo();
        seriesInfo.setChecked(true);
        seriesInfo.setColor(ImageChart.getDefHexColor(colorIndex));
        seriesInfo.setName("Test");
        List<SeriesInfo> seriesInfos = new ArrayList<>();
        seriesInfos.add(seriesInfo);
        imageChartData.setSeriesInfoList(seriesInfos);

        return imageChartData;
    }

    public void writeCsv(List<String[]> data, String sessionId) {

        String currentPath =new File("").getAbsolutePath();
        String filePath = currentPath +File.separator+"hmp_data"+File.separator;
        String filename = sessionId+".csv";

        try {
            File file = new File(filePath);
            //!표를 붙여주어 파일이 존재하지 않는 경우의 조건을 걸어줌
            if(!file.exists()){
                //디렉토리 생성 메서드
                file.mkdirs();
                System.out.println("created directory successfully!");
            }
            CSVWriter cw = new CSVWriter(new FileWriter(filePath + filename), ',', '"');
            Iterator<String[]> it = data.iterator();
            try {
                while (it.hasNext()) {
                    String[] s = (String[]) it.next();
                    cw.writeNext(s);
                }
            } finally {
                cw.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    private List<String []> readCsv(String filePath) {

        List<String[]> content = new ArrayList<String[]>();
        CSVReader reader = null;

        try {
            reader = new CSVReader(new FileReader(filePath));
            content = reader.readAll(); //전체 데이터를 가져옴.
        } catch (FileNotFoundException e) {

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {  if(reader != null) reader.close(); } catch (IOException e) {}
        }

        return content;
    }

    public Map<String, Object> createSendMessages(Object data, String conditon, String sessionId) {
        Map<String,Object> replyMessage = new HashMap<String,Object>();
        if(conditon.equals("trend")){
            replyMessage.put("chartFlag", "trend"); //image or trend
            replyMessage.put("sessionId", sessionId);
            replyMessage.put("trendData", data);
            replyMessage.put("replyConditon","finish");
        }else{
            replyMessage.put("chartFlag", "image");
            replyMessage.put("sessionId", sessionId);
            replyMessage.put("imageChartData",data);
            replyMessage.put("replyConditon","finish");
        }
        return  replyMessage;
    }

    public List<List<Double>> getRegressionInput(String sessionId, Long fromdate, Long todate) {
        List<List<Double>> returnValue = new ArrayList<>();//[[]]
        List<String[]> fileData = new ArrayList<String[]>();//
        List<Double> returnTimeStamp = new ArrayList<>();//
        List<Double> returnValues = new ArrayList<>();
        String currentPath =new File("").getAbsolutePath();
        String filePath = currentPath +File.separator+"hmp_data"+File.separator+sessionId+".csv";

        fileData = readCsv(filePath);
        Iterator<String[]> it = fileData.iterator();
        while (it.hasNext()) {
            String[] colData = (String[]) it.next();
            Double timestamp = Double.valueOf(colData[0]);
            Double value = Double.valueOf(colData[1]);
            if(timestamp >= fromdate && timestamp <= todate){
                returnTimeStamp.add(timestamp);
                returnValues.add(value);
            }
        }
        returnValue.add(returnTimeStamp);
        returnValue.add(returnValues);
        return returnValue;
    }
}
