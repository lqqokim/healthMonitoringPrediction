package com.bistel.a3.portal.service.pdm.impl.std;


import com.bistel.a3.portal.dao.pdm.std.master.STDCodeMapper;
import com.bistel.a3.portal.domain.common.Code;
import com.bistel.a3.portal.domain.pdm.std.master.STDCode;
import com.bistel.a3.portal.util.SqlSessionUtil;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.List;
import java.util.Map;

@Service
public class CodeService {
    @Autowired
    private Map<String, SqlSessionTemplate> sessions;

    @Autowired
    private Map<String, PlatformTransactionManager> trMgrs;

    
    public List<Code> getCode(String fabId, String category, Boolean useYn) {
        STDCodeMapper codeMapper = SqlSessionUtil.getMapper(sessions, fabId, STDCodeMapper.class);

        return codeMapper.selectByCategory(category, useYn);
    }

    
    public String getCode(List<Code> codes, String cd) {
        for(Code code : codes) {
            if(code.getCode().equals(cd)) {
                return code.getName();
            }
        }
        return null;
    }


    
    public List<Code> getCodeList(String fabId) {
        STDCodeMapper codeMapper = SqlSessionUtil.getMapper(sessions, fabId, STDCodeMapper.class);

        return codeMapper.selectCodeList();

    }
    
    public List<Code> getCodebyCategory(String fabId,String category){
        STDCodeMapper codeMapper = SqlSessionUtil.getMapper(sessions, fabId, STDCodeMapper.class);

        return codeMapper.selectByCategory(category,true);
    }

    
    public void addCode(String fabId,STDCode code){
        STDCodeMapper codeMapper = SqlSessionUtil.getMapper(sessions, fabId, STDCodeMapper.class);

        /*트랜잭션
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, "mi");
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try{
            codeMapper.insert(code);
        }
        catch (Exception e){
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
        manager.commit(status);
        */
        Integer ordering=codeMapper.selectMaxOrdering();
        code.setCreate_by(code.getUser_name());
        code.setUpdate_by(code.getUser_name());
        code.setOrdering(ordering+1);
        codeMapper.insertSTDCode(code);
    }

    
    public void updateCode(String fabId,STDCode code, long rawId){
        STDCodeMapper codeMapper = SqlSessionUtil.getMapper(sessions, fabId, STDCodeMapper.class);

        //code.setCreate_by(code.getUser_name());
        code.setUpdate_by(code.getUser_name());
        code.setRawId(rawId);
        codeMapper.updateSTDCode(code);

    }

    public void updateOrdering(String fabId,List<STDCode> codes)
    {
        STDCodeMapper codeMapper = SqlSessionUtil.getMapper(sessions, fabId, STDCodeMapper.class);

        Long rawId=null;
        Integer ordering=null;
        String update_by=null;
        for (int i = 0; i < codes.size(); i++) {
            rawId=codes.get(i).getRawId();
            ordering=codes.get(i).getOrdering();
            update_by=codes.get(i).getUser_name();
            codeMapper.updateSTDCodeOrdering(rawId,ordering,update_by);

        }
    }

    
    public void deleteCode(String fabId,Long rawId){
        STDCodeMapper codeMapper = SqlSessionUtil.getMapper(sessions, fabId, STDCodeMapper.class);

        codeMapper.deleteByCodeId(rawId);
    }


    public List<Code> getCodesByCategory(String fabId,String category) {
        STDCodeMapper codeMapper = SqlSessionUtil.getMapper(sessions, fabId, STDCodeMapper.class);
        return codeMapper.selectByCategory(category,true);
    }

    public List<String> getCategories(String fabId) {
        STDCodeMapper codeMapper = SqlSessionUtil.getMapper(sessions, fabId, STDCodeMapper.class);
        return codeMapper.selectCategories();
    }








    /*
    public void removeParams(String fabId, Long eqpId, Long[] paramIds) {
        STDParamMapper mapper = SqlSessionUtil.getMapper(sessions, fabId, STDParamMapper.class);
        PlatformTransactionManager manager = TransactionUtil.getTransactionManger(trMgrs, fabId);
        TransactionStatus status = TransactionUtil.getTransactionStatus(manager);
        try {
            for (Long paramId : paramIds) {
                mapper.deleteCommonOne(paramId);
                mapper.deleteRpmOne(paramId);
                mapper.deleteOne(paramId);
            }
            manager.commit(status);
        } catch (Exception e) {
            manager.rollback(status);
            throw new RuntimeException(e.getMessage());
        }
    }
    */


}



