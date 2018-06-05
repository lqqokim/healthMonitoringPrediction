package com.bistel.a3.portal.service.pdm.impl.ulsan;

import com.bistel.a3.portal.dao.pdm.ulsan.ElectricMapper;
import com.bistel.a3.portal.domain.pdm.DeviceTable;
import com.bistel.a3.portal.domain.pdm.ElectricData;
import com.bistel.a3.portal.service.pdm.IElectricCurrentSerivce;
import com.bistel.a3.portal.util.SqlSessionUtil;
import com.bistel.algo.tspr.standalone.mp.MatrixProfile;
import com.bistel.algo.tspr.standalone.mp.model.Motif;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@ConditionalOnExpression("!${run.standard}")
public class ElectricCurrentService implements IElectricCurrentSerivce {
    private static Logger logger = LoggerFactory.getLogger(ElectricCurrentService.class);

    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Override
    public List<List<Object>> getElectriccurrent(String fabId, Long eqpId, Long fromdate, Long todate) {
        ElectricMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, ElectricMapper.class);
        DeviceTable device = mapper.selectDeviceByEqpId(eqpId);

        if(device == null) return new ArrayList<>();
        List<ElectricData> data = mapper.selectElectricData(device.getTag(), new Date(fromdate), new Date(todate));
        return makeElectricResult(data);
    }

    private List<List<Object>> makeElectricResult(List<ElectricData> data) {
        List<List<Object>> result = new ArrayList<>();
        for(ElectricData d : data) {
            result.add(Arrays.asList(d.getDatasavedtime().getTime() + d.getMillisecond(), d.getData()));
        }
        return result;
    }
    public HashMap<String, Object> getCurrentPattern(int iWindow, int iNearCount, int iFarCount, List<Long> times, List<Double> values) {
//        result: 'success',
//                data:{
//            near: {
//                pairIndexes: [
//                {location: [10, 100], score: 9, neighborhood: [10, 90, ...] },
//                {location: [10, 100], score: 9, neighborhood: [10, 90, ...] },
//                {location: [10, 100], score: 9, neighborhood: [10, 90, ...] }
//                                 ]
//            },
//            far: [20, 30, 70, ...]
//        }
        HashMap<String,Object> result = new HashMap<>();

        try{
            double[]  datas = new double[values.size()];
            for (int i = 0; i < values.size(); i++) {
                try {
                    datas[i] = Double.valueOf( values.get(i).toString());
                }catch(Exception e){
                    datas[i] = 0.0;
                    logger.error("Data "+i+"'st problem:"+e.getMessage());
                }
            }
            MatrixProfile mp = new MatrixProfile(datas,iWindow);
            mp.run();

            HashMap<String,Object> currentPattern = new HashMap<>();

            List<HashMap<String,Object>> pairIndexes = new ArrayList<>();

            List<Motif> motifList = mp.getMotifList(iNearCount);
            List<Integer> discordList = mp.getDiscordList(iFarCount);


            for (int i = 0; i < motifList.size(); i++) {
                HashMap<String,Object> pairIndex = new HashMap<>();
                Motif motif = motifList.get(i);

                pairIndex.put("score",motif.getDistance());
                pairIndex.put("location",motif.getPairIdx());

                List<Integer> neighborhoods = new ArrayList<>();
                pairIndex.put("neighborhood",motif.getNeihborhood());

                pairIndexes.add(pairIndex);
            }
            currentPattern.put("near",pairIndexes);


            List<Integer> fars = new ArrayList<>();
            for (int i = 0; i < discordList.size(); i++) {

                fars.add(discordList.get(i));
            }

            currentPattern.put("far",fars);

            result.put("result","success");
            result.put("data",currentPattern);

        }catch(Exception err){
            result.put("result","fail");
            result.put("data",err.getMessage());

        }


        return result;
    }
}
