package com.bistel.a3.common.util;

import com.bistel.a3.common.exception.A3Exception;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.File;
import java.io.StringReader;
import java.net.URL;

public class XmlUtil {
	/**
     * XML 파일을 Object로 변환
     * 
     * @param xmlFilePath XML 파일의 Path
     * @param clazz 변환할 Object의 class 타입
     * @return
     */
    public static Object convertXmlFileToObject(String xmlFilePath, Class<?> clazz) {
        Object obj = null;
        
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(clazz);
            Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
            
            URL url = XmlUtil.class.getResource(xmlFilePath);
            File file = new File(url.getFile());
            
            obj = unmarshaller.unmarshal(file);
        } catch (JAXBException e) {
            throw new A3Exception("XML Convert Error!!", e);
        }
        
        return obj;
    }
    
    /**
     * XML String을 Object로 변환
     * 
     * @param xml XML String
     * @param clazz 변환할 Object의 class 타입
     * @return
     */
    public static Object convertXmlStringToObject(String xml, Class<?> clazz) {
        Object obj = null;
        
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(clazz);
            Unmarshaller unmarshaller = jaxbContext.createUnmarshaller();
            
            StringReader reader = new StringReader(xml);
            obj = unmarshaller.unmarshal(reader);
            
        } catch (JAXBException e) {
            throw new A3Exception("XML Convert Error!!", e);
        }
        
        return obj;
    }
}
