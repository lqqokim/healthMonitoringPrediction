package com.bistel.a3.portal.util;

import org.apache.commons.dbcp.BasicDataSource;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Map;

public class SqlSessionUtil {
    public static <T> T getMapper(Map<String, SqlSessionTemplate> sessions, String key, Class<T> type) {
        return sessions.get(key).getMapper(type);
    }

    public static String[] sourceInfo(Map<String, SqlSessionTemplate> sessions, String key) {
        BasicDataSource source = ((BasicDataSource)sessions.get(key).getSqlSessionFactory().getConfiguration().getEnvironment().getDataSource());
        return new String[] { source.getUrl(), source.getUsername(), source.getPassword() };
    }
}
