package com.bistel.a3.common.util.xml;

import javax.xml.bind.annotation.XmlAttribute;

public class MapElements {
	@XmlAttribute
	public String key;

	@XmlAttribute
	public String value;

	public MapElements() {

	}

	public MapElements(String key, String value) {
		this.key = key;
		this.value = value;
	}
}
