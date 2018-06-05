package com.bistel.pdm.app.datagen.formatter;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class SvFormatter implements Formatter {

    private String defaultDelimiter = DelimiterConst.COMMA;
    private Set<String> header;

    public SvFormatter(String defaultDelimiter) {
        this.defaultDelimiter = defaultDelimiter;
    }

    public SvFormatter() {
    }

    @Override
    public void init() {
    }

    @Override
    public String format(Map<String, Object> columnAndValueMap) {
        StringBuilder stringBuilder = new StringBuilder();
        if (header == null) {
            header = columnAndValueMap.keySet();
        }

        boolean first = true;
        for (String column : header) {
            if (!first) {
                stringBuilder.append(defaultDelimiter);
            }
            stringBuilder.append(columnAndValueMap.get(column));
            first = false;
        }
        stringBuilder.append(DelimiterConst.NEW_LINE);
        return stringBuilder.toString();
    }

    @Override
    public String format(List<Map<String, Object>> maps) {
        StringBuilder stringBuilder = new StringBuilder();
        for (Map<String, Object> map : maps) {
            stringBuilder.append(format(map));
        }
        return stringBuilder.toString();
    }

    @Override
    public boolean supportMultiInsert() {
        return false;
    }
}
