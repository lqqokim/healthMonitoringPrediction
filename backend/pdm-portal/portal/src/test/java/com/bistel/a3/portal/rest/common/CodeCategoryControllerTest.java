package com.bistel.a3.portal.rest.common;

import com.bistel.a3.portal.dao.common.CodeCategoryMapper;
import com.bistel.a3.portal.dao.common.CodeMapper;
import com.bistel.a3.portal.domain.common.Code;
import com.bistel.a3.portal.domain.common.CodeCategory;
import com.bistel.a3.portal.util.StringUtil;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Matchers;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

/**
 * Created by yohan on 5/4/16.
 */
@RunWith(MockitoJUnitRunner.class)
public class CodeCategoryControllerTest {
    @Mock
    private CodeCategoryMapper codeCategoryMapper;

    @Mock
    private CodeMapper codeMapper;

    @InjectMocks
    private CodeCategoryController controller = new CodeCategoryController();

    private String appName = "TEST";
    private CodeCategory codeCategory = new CodeCategory();
    private String categoryName = "TESTCATE";

    @Test
    public void getCodeCategories() throws Exception {
        List<CodeCategory> list = new ArrayList<>();
        doReturn(list).when(codeCategoryMapper).selectByAppName(appName);

        List<CodeCategory> retList = controller.gets(appName);

        verify(codeCategoryMapper).selectByAppName(appName);
        assertEquals(retList, list);
    }

    @Test
    public void setCodeCategory() throws Exception {
        doNothing().when(codeCategoryMapper).insert(appName, codeCategory);

        controller.set(appName, codeCategory);

        verify(codeCategoryMapper).insert(appName, codeCategory);
    }

    @Test
    public void getCodeCategory() throws Exception {
        CodeCategory cate = new CodeCategory();
        doReturn(cate).when(codeCategoryMapper).selectByName(appName, categoryName);

        CodeCategory retCate = controller.gets(appName, categoryName);

        verify(codeCategoryMapper).selectByName(appName, categoryName);
        assertEquals(retCate, cate);
    }

    @Test
    public void updateCodeCategory() throws Exception {
        CodeCategory cate = new CodeCategory();
        cate.setName("TESTCATE");
        doReturn(cate).when(codeCategoryMapper).selectByName(appName, categoryName);
        doNothing().when(codeCategoryMapper).update(cate);

        controller.set(appName, categoryName, cate);

        verify(codeCategoryMapper).selectByName(appName, categoryName);
        verify(codeCategoryMapper).update(cate);
    }

    @Test
    public void remove() throws Exception {
        CodeCategory cate = new CodeCategory();
        doReturn(cate).when(codeCategoryMapper).selectByName(appName, categoryName);
        doNothing().when(codeMapper).deleteByCategoryId(cate.getCodeCategoryId());
        doNothing().when(codeCategoryMapper).delete(cate);

        controller.remove(appName, categoryName);

        verify(codeCategoryMapper).selectByName(appName, categoryName);
        verify(codeMapper).deleteByCategoryId(cate.getCodeCategoryId());
        verify(codeCategoryMapper).delete(cate);
    }

    @Test
    public void getCodes_ParamEmpty() throws Exception {
        Map<String, String> params = new HashMap<>();
        List<Code> codes = new ArrayList<>();

        doReturn(codes).when(codeMapper).selectByCategoryName(appName, categoryName, null);

        List<Code> retCodes = controller.getCodes(appName, categoryName, params);

        verify(codeMapper).selectByCategoryName(appName, categoryName, null);
        assertEquals(retCodes, codes);
    }

    @Test
    public void getCodes_ParamNotEmpty() throws Exception {
        Map<String, String> params = new HashMap<>();
        params.put("used", "true");
        List<Code> codes = new ArrayList<>();

        doReturn(codes).when(codeMapper).selectByCategoryName(appName, categoryName, StringUtil.parseBoolean(params.get("used")));

        List<Code> retCodes = controller.getCodes(appName, categoryName, params);

        verify(codeMapper).selectByCategoryName(appName, categoryName, StringUtil.parseBoolean(params.get("used")));
        assertEquals(retCodes, codes);
    }

    @Test
    public void setCodes() throws Exception {
        CodeCategory codeCategory = new CodeCategory();
        List<Code> codes = new ArrayList<>();
        codes.add(new Code());
        codes.add(new Code());

        doReturn(codeCategory).when(codeCategoryMapper).selectByName(appName, categoryName);
        doNothing().when(codeMapper).insert(Matchers.<Code>anyObject());

        controller.setCodes(appName, categoryName, codes);

        verify(codeCategoryMapper).selectByName(appName, categoryName);
        verify(codeMapper, times(2)).insert(Matchers.<Code>anyObject());
    }

    @Test
    public void removeCodes() throws Exception {
        List<Code> codes = new ArrayList<>();
        codes.add(new Code());
        codes.add(new Code());

        doNothing().when(codeMapper).delete(Matchers.<Code>anyObject());

        controller.removeCodes(codes);

        verify(codeMapper, times(2)).delete(Matchers.<Code>anyObject());
    }

}