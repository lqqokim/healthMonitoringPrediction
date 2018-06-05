package com.bistel.a3.portal.domain.thin.workspace;

public class CodeMst {
	private Long id;

    private String category;

    private String code;

    private String name;

    private String useYn;

    private Long codeOrder;

    private String defaultCol;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUseYn() {
        return useYn;
    }

    public void setUseYn(String useYn) {
        this.useYn = useYn;
    }

    public Long getCodeOrder() {
        return codeOrder;
    }

    public void setCodeOrder(Long codeOrder) {
        this.codeOrder = codeOrder;
    }

    public String getDefaultCol() {
        return defaultCol;
    }

    public void setDefaultCol(String defaultCol) {
        this.defaultCol = defaultCol;
    }
}
