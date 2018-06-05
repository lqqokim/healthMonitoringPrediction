package com.bistel.pdm.common.settings;

import com.google.common.base.Preconditions;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;
import com.typesafe.config.ConfigRenderOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.regex.Pattern;

/**
 * Utilities for retrieving {@code Config} instances.
 */
public final class ConfigUtils {

    private static final Logger log = LoggerFactory.getLogger(ConfigUtils.class);

    private static final Pattern REDACT_PATTERN =
            Pattern.compile("(\\w*password\\w*\\s*=\\s*).+", Pattern.CASE_INSENSITIVE);

    private static final Config DEFAULT_CONFIG = ConfigFactory.load();

    private static final ConfigRenderOptions RENDER_OPTS =
            ConfigRenderOptions.defaults()
                    .setComments(false)
                    .setOriginComments(false)
                    .setFormatted(true)
                    .setJson(false);

    private ConfigUtils() {
    }

    public static Config getDefault() {
        return DEFAULT_CONFIG;
    }

    public static Config overlayOn(Map<String, ?> overlay, Config underlying) {
        StringBuilder configFileString = new StringBuilder();
        overlay.forEach((k, v) -> configFileString.append(k).append('=').append(v).append('\n'));
        String configFile = configFileString.toString();
        log.debug("Overlaid config: \n{}", configFile);
        return ConfigFactory.parseString(configFile).resolve().withFallback(underlying);
    }

    public static String getOptionalString(Config config, String key) {
        return config.hasPath(key) ? config.getString(key) : null;
    }

    public static List<String> getOptionalStringList(Config config, String key) {
        return config.hasPath(key) ? config.getStringList(key) : null;
    }

    public static Double getOptionalDouble(Config config, String key) {
        return config.hasPath(key) ? config.getDouble(key) : null;
    }

    public static void set(Map<String, Object> overlay, String key, Path path) throws IOException {
        Path finalPath = Files.exists(path, LinkOption.NOFOLLOW_LINKS) ?
                path.toRealPath(LinkOption.NOFOLLOW_LINKS) :
                path;
        overlay.put(key, "\"" + finalPath.toUri() + "\"");
    }

    public static String serialize(Config config) {
        return config.root().withOnlyKey("pdm").render(ConfigRenderOptions.concise());
    }

    public static Config deserialize(String serialized) {
        return ConfigFactory.parseString(serialized).resolve().withFallback(DEFAULT_CONFIG);
    }

    public static String prettyPrint(Config config) {
        return redact(config.root().withOnlyKey("pdm").render(RENDER_OPTS));
    }

    static String redact(String s) {
        return REDACT_PATTERN.matcher(s).replaceAll("$1*****");
    }

    public static Properties keyValueToProperties(Object... keyValues) {
        Preconditions.checkArgument(keyValues.length % 2 == 0);
        Properties properties = new Properties();
        for (int i = 0; i < keyValues.length; i += 2) {
            properties.setProperty(keyValues[i].toString(), keyValues[i + 1].toString());
        }
        return properties;
    }
}
