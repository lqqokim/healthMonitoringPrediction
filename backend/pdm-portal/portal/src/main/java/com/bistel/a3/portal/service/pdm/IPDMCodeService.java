package com.bistel.a3.portal.service.pdm;

import com.bistel.a3.portal.domain.common.Code;
import com.bistel.a3.portal.domain.common.CodeCategory;
import com.bistel.a3.portal.domain.pdm.master.ParamWithCommonWithRpm;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public interface IPDMCodeService {
    List<Code> getCode(String app, String codeCategory, Boolean useYn);

    String getCode(List<Code> jobCodes, String job_cd);

    //Allen 2018-04-02
    List<Code> getCodeList();

    Code getCodebyCategory(Long categoryId);

    void addCode(Code code);

    void updateCode(Code code);

    void deleteCode(Long codeId);

}
