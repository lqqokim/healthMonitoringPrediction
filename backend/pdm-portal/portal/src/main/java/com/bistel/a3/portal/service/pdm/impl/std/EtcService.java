package com.bistel.a3.portal.service.pdm.impl.std;

import com.bistel.a3.common.util.Pivot;
import com.bistel.a3.portal.dao.pdm.std.master.STDBearingMapper;
import com.bistel.a3.portal.dao.pdm.std.master.STDEtcMapper;
import com.bistel.a3.portal.dao.pdm.std.master.STDParamMapper;
import com.bistel.a3.portal.dao.pdm.std.master.STDPartMapper;
import com.bistel.a3.portal.dao.pdm.std.report.STDReportMapper;
import com.bistel.a3.portal.dao.pdm.std.trace.STDTraceDataMapper;
import com.bistel.a3.portal.dao.pdm.std.trace.STDTraceRawDataMapper;
import com.bistel.a3.portal.domain.common.FilterCriteriaData;
import com.bistel.a3.portal.domain.common.FilterTraceRequest;
import com.bistel.a3.portal.domain.pdm.*;
import com.bistel.a3.portal.domain.pdm.db.*;
import com.bistel.a3.portal.domain.pdm.enums.EuType;
import com.bistel.a3.portal.domain.pdm.enums.ParamType;
import com.bistel.a3.portal.domain.pdm.enums.PartType;
import com.bistel.a3.portal.domain.pdm.master.Monitoring;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommon;
import com.bistel.a3.portal.module.pdm.RpmDataComponent;
import com.bistel.a3.portal.service.pdm.ITraceDataService;
import com.bistel.a3.portal.util.SqlSessionUtil;
import com.bistel.a3.portal.util.pdm.Outlier;
import org.apache.commons.math3.stat.StatUtils;
import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@ConditionalOnExpression("${run.standard}")
public class EtcService  {
    private static Logger logger = LoggerFactory.getLogger(EtcService.class);

    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Autowired
    private ReportService fabService;


    @Autowired
    private BeanFactory factory;

    public List<Monitoring> getMonitoring(String fabId,String name){
        STDEtcMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEtcMapper.class);

        return mapper.selectMonitoring(name);
    }

    public void CreateMonitoring(String fabId,Monitoring monitoring){
        STDEtcMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEtcMapper.class);
        mapper.insertMonitoring(monitoring);
    }
    public void UpdateMonitoring(String fabId,Monitoring monitoring){
        STDEtcMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEtcMapper.class);
        mapper.updateMonitoring(monitoring);
    }
    public void DeleteMonitoring(String fabId,Long rawId){
        STDEtcMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDEtcMapper.class);
        mapper.deleteMonitoring(rawId);
    }



}
