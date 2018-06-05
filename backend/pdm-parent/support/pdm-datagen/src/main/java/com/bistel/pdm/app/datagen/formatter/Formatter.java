package com.bistel.pdm.app.datagen.formatter;

import java.util.List;
import java.util.Map;

public interface Formatter {

    void init();

    String format(Map<String, Object> map);

    String format(List<Map<String, Object>> maps);
    
    boolean supportMultiInsert();

}
