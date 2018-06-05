package com.bistel.pdm.common.settings;

import com.typesafe.config.ConfigObject;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

/**
 * Utility that outputs all configuration as key-value pairs (as in a .properties file)
 * to stdout.
 */
public final class ConfigToProperties {

    private ConfigToProperties() {
    }

    public static void main(String[] args) {
        buildPropertiesLines().forEach(System.out::println);
    }

    static List<String> buildPropertiesLines() {
        ConfigObject config = (ConfigObject) ConfigUtils.getDefault().root().get("bistel");
        Map<String, String> keyValueMap = new TreeMap<>();
        add(config, "bistel", keyValueMap);
        return keyValueMap.entrySet().stream().map(e -> e.getKey() + "=" + e.getValue()).collect(Collectors.toList());
    }

    private static void add(ConfigObject config, String prefix, Map<String, String> values) {
        config.forEach((key, value) -> {
            String nextPrefix = prefix + "." + key;
            switch (value.valueType()) {
                case OBJECT:
                    add((ConfigObject) value, nextPrefix, values);
                    break;
                case NULL:
                    // do nothing
                    break;
                default:
                    values.put(nextPrefix, String.valueOf(value.unwrapped()));
            }
        });
    }

}
