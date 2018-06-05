package com.bistel.a3.common.util.db;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.io.IOException;
import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class JsonTypeHandler extends BaseTypeHandler<JsonNode> {

	@Override
	public void setNonNullParameter(PreparedStatement paramPreparedStatement, int paramInt, JsonNode paramT, JdbcType paramJdbcType) throws SQLException {
		paramPreparedStatement.setString(paramInt, paramT == null ? null : paramT.toString());
	}

	@Override
	public JsonNode getNullableResult(ResultSet paramResultSet, String paramString) throws SQLException {
		ObjectMapper mapper = new ObjectMapper();
		JsonNode node = null;
		try {
			String sValue = paramResultSet.getString(paramString);
			if(sValue != null) {
				node = mapper.readTree(sValue);
			}
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return node;
	}

	@Override
	public JsonNode getNullableResult(ResultSet paramResultSet, int paramInt) throws SQLException {
		ObjectMapper mapper = new ObjectMapper();
		JsonNode node = null;
		try {
			String sValue = paramResultSet.getString(paramInt);
			if(sValue != null) {
				node = mapper.readTree(sValue);
			}
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return node;
	}

	@Override
	public JsonNode getNullableResult(CallableStatement paramCallableStatement, int paramInt) throws SQLException {
		ObjectMapper mapper = new ObjectMapper();
		JsonNode node = null;
		try {
			String sValue = paramCallableStatement.getString(paramInt);
			if(sValue != null) {
				node = mapper.readTree(sValue);
			}
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return node;
	}

}
