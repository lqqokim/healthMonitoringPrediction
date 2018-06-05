package com.bistel.a3.common.util.db;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class YNTypeHandler extends BaseTypeHandler<Boolean> {
	private static final String YES = "Y";
	private static final String NO = "N";
	
	@Override
	public void setNonNullParameter(PreparedStatement ps, int i, Boolean parameter, JdbcType jdbcType) throws SQLException {
		ps.setString(i, parameter.booleanValue() ? YES : NO);
	}

	@Override
	public Boolean getNullableResult(ResultSet rs, String columnName) throws SQLException {
		return rs.getString(columnName).equalsIgnoreCase(YES);
	}

	@Override
	public Boolean getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
		return rs.getString(columnIndex).equalsIgnoreCase(YES);
	}

	@Override
	public Boolean getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
		return cs.getString(columnIndex).equalsIgnoreCase(YES);
	}

}
