package com.bistel.a3.portal.domain.thin.workspace;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.powermock.modules.junit4.PowerMockRunner;

import static org.junit.Assert.assertEquals;

@RunWith(PowerMockRunner.class)
public class CodeMstTest {
	private Long id;
    private String category;
    private String code;
    private String name;
    private String useYn;
    private Long codeOrder;
    private String defaultCol;

    @InjectMocks
    private CodeMst actual = new CodeMst();

    @Test
    public final void testId() {
        long id = 44L;
        this.id = id;
        actual.setId(id);

        assertEquals(this.id, actual.getId());
    }

    @Test
    public final void testCategory() {
        String category = "category";
        this.category = category;
        actual.setCategory(category);

        assertEquals(this.category, actual.getCategory());
    }

    @Test
    public final void testCode() {
        String code = "code";
        this.code = code;
        actual.setCode(code);

        assertEquals(this.code, actual.getCode());
    }

    @Test
    public final void testName() {
        String name = "name";
        this.name = name;
        actual.setName(name);

        assertEquals(this.name, actual.getName());
    }

    @Test
    public final void testUseYn() {
        String useYn = "Y";
        this.useYn = useYn;
        actual.setUseYn(useYn);

        assertEquals(this.useYn, actual.getUseYn());
    }

    @Test
    public final void testCodeOrder() {
        long codeOrder = 44L;
        this.codeOrder = codeOrder;
        actual.setCodeOrder(codeOrder);

        assertEquals(this.codeOrder, actual.getCodeOrder());
    }

    @Test
    public final void testDefaultCol() {
        String defaultCol = "defaultCol";
        this.defaultCol = defaultCol;
        actual.setDefaultCol(defaultCol);

        assertEquals(this.defaultCol, actual.getDefaultCol());
    }
}
