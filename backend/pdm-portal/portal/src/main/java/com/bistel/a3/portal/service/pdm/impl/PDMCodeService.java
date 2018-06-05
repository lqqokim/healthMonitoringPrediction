package com.bistel.a3.portal.service.pdm.impl;


import com.bistel.a3.portal.dao.common.CodeMapper;
import com.bistel.a3.portal.domain.common.Code;
import com.bistel.a3.portal.service.pdm.IPDMCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.List;
import java.util.Map;

@Service
public class PDMCodeService implements IPDMCodeService {
    @Autowired
    private CodeMapper codeMapper;

    @Autowired
    private Map<String, PlatformTransactionManager> trMgrs;

    @Override
    public List<Code> getCode(String app, String codeCategory, Boolean useYn) {
        return codeMapper.selectByCategoryName(app, codeCategory, useYn);
    }

    @Override
    public String getCode(List<Code> codes, String cd) {
        for(Code code : codes) {
            if(code.getCode().equals(cd)) {
                return code.getName();
            }
        }
        return null;
    }


    @Override
    public List<Code> getCodeList() {

        return codeMapper.selectCodeList();

    }
    @Override
    public Code getCodebyCategory(Long categoryId){
        return codeMapper.selectCodeByCategoryId(categoryId);
    }

    @Override
    public void addCode(Code code){
        /*
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
        codeMapper.insert(code);
    }

    @Override
    public void updateCode(Code code){
        String name=code.getName();
        Integer codeOrder=code.getCodeOrder();
        Boolean defaultCode=code.getDefault();
        Boolean used=code.getUsed();
        String description=code.getDescription();

        codeMapper.updateCode(name,codeOrder,defaultCode,used,description);
    }

    @Override
    public void deleteCode(Long codeId){
           codeMapper.deleteByCodeId(codeId);
    }


}



