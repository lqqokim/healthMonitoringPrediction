package com.bistel.a3.portal.domain.thin.workspace;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.powermock.modules.junit4.PowerMockRunner;

import static org.junit.Assert.assertEquals;

@RunWith(PowerMockRunner.class)
public class ParameterMstTest {
    private Long id;
    private Integer moduleId;
    private String moduleIdees;
    private String paramName;
    private String paramAlias;
    private String unit;
    private String dataLoadYn;

    @InjectMocks
    private ParameterMst actual = new ParameterMst();

    @Test
    public final void testId() {
        long id = 44L;
        this.id = id;
        actual.setId(id);

        assertEquals(this.id, actual.getId());
    }

    @Test
    public final void testModuleId() {
        Integer moduleId = 2516;
        this.moduleId = moduleId;
        actual.setModuleId(moduleId);

        assertEquals(this.moduleId, actual.getModuleId());
    }

    @Test
    public final void testModuleIdees() {
        String moduleIdees = "moduleIdees";
        this.moduleIdees = moduleIdees;
        actual.setModuleIdees(moduleIdees);

        assertEquals(this.moduleIdees, actual.getModuleIdees());
    }

    @Test
    public final void testParamName() {
        String paramName = "paramName";
        this.paramName = paramName;
        actual.setParamName(paramName);

        assertEquals(this.paramName, actual.getParamName());
    }

    @Test
    public final void testParamAlias() {
        String paramAlias = "paramAlias";
        this.paramAlias = paramAlias;
        actual.setParamAlias(paramAlias);

        assertEquals(this.paramAlias, actual.getParamAlias());
    }

    @Test
    public final void testUnit() {
        String unit = "unit";
        this.unit = unit;
        actual.setUnit(unit);

        assertEquals(this.unit, actual.getUnit());
    }

    @Test
    public final void testDataLoadYn() {
        String dataLoadYn = "dataLoadYn";
        this.dataLoadYn = dataLoadYn;
        actual.setDataLoadYn(dataLoadYn);

        assertEquals(this.dataLoadYn, actual.getDataLoadYn());
    }
}
