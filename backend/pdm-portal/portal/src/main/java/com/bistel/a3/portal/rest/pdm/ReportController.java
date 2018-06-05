package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.domain.pdm.ImageData;
import org.apache.poi.sl.usermodel.PictureData;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFPictureShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("pdm/report")
public class ReportController {
    @RequestMapping(value = "ppt", method = RequestMethod.POST)
    public ResponseEntity<byte[]> ppt(@RequestBody ImageData request) throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream ();

        XMLSlideShow ppt = createPPT(request);
        ppt.write(bos);
        byte[] content = bos.toByteArray();
        bos.close();

        HttpHeaders headers = createHeader(content.length);
        ResponseEntity<byte[]> response = new ResponseEntity<>(content, headers, HttpStatus.OK);
        return response;
    }

    private XMLSlideShow createPPT(@RequestBody ImageData request) {
        XMLSlideShow ppt = new XMLSlideShow();
        XSLFSlide slide = ppt.createSlide();

        String base64Image = request.getData();
        PictureData pictureData = ppt.addPicture(Base64.getDecoder().decode(base64Image), PictureData.PictureType.PNG);
        XSLFPictureShape shape = slide.createPicture(pictureData);

        Dimension oriDim = pictureData.getImageDimension();
        Dimension dim = ppt.getPageSize();

        int height = oriDim.height * dim.width / oriDim.width;
        shape.setAnchor(new Rectangle(0, (dim.height - height)/2, dim.width, height));
        return ppt;
    }

    private HttpHeaders createHeader(int length) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/ppt"));
        headers.set("Accept", "application/ppt");
        headers.set("Content-Transfer-Encoding", "binary");
        headers.set("Content-Length", String.valueOf(length));
        headers.set("Cache-Control", "must-revalidate");
        headers.set("Pragma", "public");
        String filename = "test.ppt";
        headers.setContentDispositionFormData(filename, filename);
        return headers;
    }
}
