package com.bistel.a3.portal.util;

import java.util.*;

public class DataWindow<C, R> {
	private List<C> columns;
	private List<C> columnAliases;
	private List<List<R>> rows;

	public DataWindow() {
		columns = new ArrayList<C>();
		columnAliases = new ArrayList<C>();
		rows = new ArrayList<List<R>>();
	}

	public DataWindow(Collection<Map<C, R>> mapList) {
		this();
		
		if(mapList.size() == 0) return;

		Iterator<Map<C, R>> iterator = mapList.iterator();

		List<R> record = new ArrayList<R>();
		Map<C, R> map = iterator.next();
		for (C key : map.keySet()) {
			columns.add(key);
			record.add(map.get(key));
		}
		rows.add(record);

		while (iterator.hasNext()) {
			record = new ArrayList<R>();
			map = iterator.next();
			for (C key : map.keySet()) {
				record.add(map.get(key));
			}
			rows.add(record);
		}
	}

	public List<C> getColumns() {
		return columns;
	}
	
	public C getColumn(int index){
		return columns.get(index);
	}

	public void setColumns(List<C> columns) {
		this.columns = columns;
	}
	
	public void addColumn(C column) {
		this.columns.add(column);
	}
	
	public void removeColumn(C column) {
		this.columns.remove(column);
	}
	
	public List<C> getColumnAliases() {
		if(columnAliases.size() < 1){			
			return null;
		}
		return columnAliases;
	}

	public void setColumnAliases(List<C> columnAliases) {
		this.columnAliases = columnAliases;
	}
	public void addColumnAliases(C columnAliases) {
		this.columnAliases.add(columnAliases);
	}
	
	public void removeColumnAliases(C columnAliases) {
		this.columnAliases.remove(columnAliases);
	}

	public int getColumnSize(){
		return this.columns.size();
	}
	
	
	public Collection<List<R>> getRows() {
		return rows;
	}
	
	public List<R> getRow(int index){
		return rows.get(index);
	}

	public void setRows(List<List<R>> rows) {
		this.rows = rows;
	}
	
	public void addRow(List<R> row) {
		this.rows.add(row);
	}

	public void removeRow(List<R> row) {
		this.rows.remove(row);
	}
	
	public int getRowSize(){
		return this.rows.size();
	}

	public List<DataWindow<C, R>> getSubWindows(int count) {
		List<DataWindow<C, R>> subWindows = new ArrayList<DataWindow<C, R>>();

		if (rows.size() <= count) {
			subWindows.add(this);
			return subWindows;
		}

		Iterator<List<R>> valueIterator = rows.iterator();
		int subWindowSize = rows.size() / count;
		for (int i = 0; i < subWindowSize; i++) {
			subWindows.add(getSubWindow(count, valueIterator, i));
		}
		subWindows.add(getSubWindow(rows.size() % count, valueIterator, subWindowSize));

		return subWindows;
	}

	private DataWindow<C, R> getSubWindow(int count, Iterator<List<R>> valueIterator, int windowCount) {
		DataWindow<C, R> subWindow = new DataWindow<C, R>();
		subWindow.setColumns(this.getColumns());

		List<List<R>> subRows = new ArrayList<List<R>>();
		for (int j = 0; j < count; j++) {
			subRows.add(valueIterator.next());
		}
		subWindow.setRows(subRows);

		return subWindow;
	}

	public int getColumnIndex(String name) {
		return columns.indexOf(name);
	}

	@Override
	public String toString() {
		return "DataWindow [columns=" + columns + ", rows=" + rows + "]";
	}

	public int size() {
		return rows.size();
	}
}
