package com.bistel.a3.common.util.xml;

import javax.xml.bind.annotation.adapters.XmlAdapter;
import java.util.HashMap;
import java.util.Map;

public class MapAdapter extends XmlAdapter<MapElements[], Map<String, String>> {

	@Override
	public Map<String, String> unmarshal(MapElements[] v) throws Exception {
		if (v == null) {
			return null;
		}

		Map<String, String> result = new HashMap<>();
		for (MapElements mapElements : v) {
			result.put(mapElements.key, mapElements.value);
		}
		return result;
	}

	@Override
	public MapElements[] marshal(Map<String, String> v) throws Exception {
		if (v == null) {
			return null;
		}

		MapElements[] mapElements = new MapElements[v.size()];
		int idx = 0;
		for (Map.Entry<String, String> entry : v.entrySet()) {
			mapElements[idx++] = new MapElements(entry.getKey(), entry.getValue());
		}
		return mapElements;
	}
}
