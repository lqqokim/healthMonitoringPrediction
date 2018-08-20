package com.bistel.a3.common.util;

import com.sun.media.jfxmedia.logging.Logger;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * Created by mitchell on 17. 8. 1.
 */
public class Pivot {
    private HashMap<String,HashMap<String,Object>> pivotDatas = new HashMap<String, HashMap<String, Object>>();

    public List<List<String>> getPivotDataByTime(List<HashMap<String,Object>> datas,String timeColumn,String headPreFixColumn) throws ParseException{
        pivotDatas = new HashMap<String, HashMap<String, Object>>();
        List<String> keys = new ArrayList<String>();
        for( String key: datas.get(0).keySet()) {
        	if(!key.equals(timeColumn)&& !key.equals(headPreFixColumn)) {
        		keys.add(key);	
        	}
        }
        
        HashMap<String,String> fields = new HashMap<String,String>();
        //datas Format
        //time=value,col1=value,col2=value
        //time=value,col1=value,col2=value
        //time=value,col1=value,col2=value
        
        for(HashMap data: datas) {
        	try {
				String keyData = data.get(timeColumn).toString();

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				Date date = sdf.parse(keyData);
				long millisecond = date.getTime();


				String preFix = data.get(headPreFixColumn).toString();
				if (pivotDatas.containsKey(keyData)) { //Pivot에 TimeData가 있으면
					HashMap<String, Object> row = pivotDatas.get(keyData);
					if (row.containsKey(preFix + "_" + keys.get(0))) { //PreFix에 FieldName붙인 값이 있나
						row = new HashMap<String, Object>(); //같은 Time의 데이타가 존재 하기 때문에 새로운 Row로 추가
						row.put(timeColumn, millisecond);
						for (int i = 0; i < keys.size(); i++) {
							String key = keys.get(i);
							row.put(preFix + "_" + key, data.get(key));
						}
						pivotDatas.put(keyData, row);

					} else {  //PreFix에 FieldName붙인 값이  없으면 추가
						row.put(timeColumn, millisecond);
						for (int i = 0; i < keys.size(); i++) {
							String key = keys.get(i);
							String newHead = preFix + "_" + key;
							fields.put(newHead, newHead);
							row.put(newHead, data.get(key));
						}
						pivotDatas.put(keyData, row);
					}
				} else {
					HashMap<String, Object> row = new HashMap<String, Object>();
					row.put(timeColumn, millisecond);
					for (int i = 0; i < keys.size(); i++) {
						String key = keys.get(i);
						String newHead = preFix + "_" + key;
						if (!fields.containsKey(newHead))
							fields.put(newHead, newHead);
						row.put(newHead, data.get(key));
					}
					pivotDatas.put(keyData, row);
				}
			}catch(Exception e){
				e.printStackTrace();
			}
        }
        
        
        //Sort by FieldName
        List<String> sortFields = new ArrayList<String>();
        for( String key: fields.keySet()) {
       		sortFields.add(key);	
        }
        java.util.Collections.sort(sortFields);
        sortFields.add(0, timeColumn);
        
        //Sort by time
        List<String> timeFieldDatas = new ArrayList<String>(pivotDatas.keySet());
        java.util.Collections.sort(timeFieldDatas);

        //Sort time and field로 data 재구성 
        List<List<String>> retValues = new ArrayList<List<String>>();
        retValues.add(sortFields);
        for(int i=0;i<timeFieldDatas.size();i++){
            HashMap<String,Object> rowDatas =  this.pivotDatas.get(timeFieldDatas.get(i));
            
            List<String> rowData = new ArrayList<String>();
            for(int iKey=0;iKey<sortFields.size();iKey++) {
            	String colKey = sortFields.get(iKey);
            	if(rowDatas.containsKey(colKey)) {
            		rowData.add(rowDatas.get(colKey).toString());	
            	}else {
            		if(i>0) {
//            			Object value = this.pivotDatas.get(timeFieldDatas.get(i-1)).get(colKey);
            			Object value = retValues.get(retValues.size()-1).get(iKey);
            			if(value==null) {
            				rowData.add(null);
            			}else {
            				rowData.add(value.toString());
            			}
            		}else {
            			rowData.add(null);
            		}
            	}
            	
            }
            retValues.add(rowData);
            
        }
        return retValues;

    }
	public List<List<String>> getPivotDataByTimeWithAllColumn(List<HashMap<String,Object>> datas,String timeColumn,String pivotColumn) throws ParseException{
		pivotDatas = new HashMap<String, HashMap<String, Object>>();
		List<String> keys = new ArrayList<String>();
		for( String key: datas.get(0).keySet()) {
			if(!key.equals(timeColumn)&& !key.equals(pivotColumn)&&!key.equals("VALUE")) {
				keys.add(key);
			}
		}

		HashMap<String,String> fields = new HashMap<String,String>();
		//datas Format
		//time=value,col1=value,col2=value
		//time=value,col1=value,col2=value
		//time=value,col1=value,col2=value

		for(HashMap data: datas) {
			try {
				String keyData = data.get(timeColumn).toString();

				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				Date date = sdf.parse(keyData);
				long millisecond = date.getTime();


				String preFix = data.get(pivotColumn).toString();
				if (pivotDatas.containsKey(keyData)) { //Pivot에 TimeData가 있으면
					HashMap<String, Object> row = pivotDatas.get(keyData);
					if (row.containsKey(preFix )) { //PreFix에 FieldName붙인 값이 있나
						row = new HashMap<String, Object>(); //같은 Time의 데이타가 존재 하기 때문에 새로운 Row로 추가
						row.put(timeColumn, millisecond);
						for (int i = 0; i < keys.size(); i++) {
							String key = keys.get(i);
							row.put( key, data.get(key));
						}
						row.put(preFix, data.get("VALUE"));
						pivotDatas.put(keyData, row);

					} else {  //PreFix에 FieldName붙인 값이  없으면 추가
						row.put(timeColumn, millisecond);
						for (int i = 0; i < keys.size(); i++) {
							String key = keys.get(i);
							String newHead =  key;
							fields.put(newHead, newHead);
							row.put(newHead, data.get(key));
						}
						fields.put(preFix, preFix);
						row.put(preFix, data.get("VALUE"));
						pivotDatas.put(keyData, row);
					}
				} else {
					HashMap<String, Object> row = new HashMap<String, Object>();
					row.put(timeColumn, millisecond);
					for (int i = 0; i < keys.size(); i++) {
						String key = keys.get(i);
						String newHead =  key;
						if (!fields.containsKey(newHead))
							fields.put(newHead, newHead);
						row.put(newHead, data.get(key));
					}
					if (!fields.containsKey(preFix))
						fields.put(preFix, preFix);
					row.put(preFix, data.get("VALUE"));
					pivotDatas.put(keyData, row);
				}
			}catch(Exception e){
				e.printStackTrace();
			}
		}


		//Sort by FieldName
		List<String> sortFields = new ArrayList<String>();
		for( String key: fields.keySet()) {
			sortFields.add(key);
		}
		java.util.Collections.sort(sortFields);
		sortFields.add(0, timeColumn);

		//Sort by time
		List<String> timeFieldDatas = new ArrayList<String>(pivotDatas.keySet());
		java.util.Collections.sort(timeFieldDatas);

		//Sort time and field로 data 재구성
		List<List<String>> retValues = new ArrayList<List<String>>();
		retValues.add(sortFields);
		for(int i=0;i<timeFieldDatas.size();i++){
			HashMap<String,Object> rowDatas =  this.pivotDatas.get(timeFieldDatas.get(i));

			List<String> rowData = new ArrayList<String>();
			for(int iKey=0;iKey<sortFields.size();iKey++) {
				String colKey = sortFields.get(iKey);
				if(rowDatas.containsKey(colKey)) {
					try {
						if(rowDatas.get(colKey)==null) {
							rowData.add(null);
						}else {
							rowData.add(rowDatas.get(colKey).toString());
						}

					}
					catch(Exception e) {
						System.out.println(e);
					}
				}else {
					if(i>0) {
//            			Object value = this.pivotDatas.get(timeFieldDatas.get(i-1)).get(colKey);
						Object value = retValues.get(retValues.size()-1).get(iKey);
						if(value==null) {
							rowData.add(null);
						}else {
							rowData.add(value.toString());
						}
					}else {
						rowData.add(null);
					}
				}

			}
			retValues.add(rowData);

		}
		return retValues;

	}
	
}

