package com.bistel.a3.portal.util;

import java.util.HashSet;
import java.util.List;

public class ListUtil {

	/**
	 * ArrayList의 순서가 변경될 수 있음.
	 * @param <T>
	 * @param list
	 * @return
	 */
	public static <T> void removeDuplication (List<T> list) {
		
		HashSet<T> hs = new HashSet<T>();
		hs.addAll(list);
		list.clear();
		list.addAll(hs);
	}
	
	public static <T> void mergeListWithoutDuplication (List<T> list1, List<T> list2) {
		
		HashSet<T> hs1 = new HashSet<T>();
		HashSet<T> hs2 = new HashSet<T>();
		hs1.addAll(list1);
		hs2.addAll(list2);
		hs1.addAll(hs2);
		
		list1.clear();
		list1.addAll(hs1);

	}
	
	public static <T> void addItemWithoutDuplication (List<T> list1, T e) {
		if (!list1.contains(e)) {
			list1.add(e);
		}
	}
	
	public static <T> void removeContainListItems (List<T> list1, List<T> list2) {
		if (list2 != null && list2.size() > 0) {
			
			for (T e : list2) {
				if (list1.contains(e)) {
					list1.remove(e);
				}
			}
		}
	}
}
