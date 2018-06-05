package com.bistel.a3.common.util.imageChart;

import org.apache.tomcat.util.codec.binary.Base64;
import org.apache.tomcat.util.codec.binary.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static java.lang.Math.*;

public class ImageChart {
	public int width,height;
	public double xMin,xMax,yMin,yMax;
	private float xRate;
	private float yRate;
	private int margin = 10;
	private BufferedImage image;
	private int color;
	private int pointCount ;
	private long dataCount;
	private Logger logger = LoggerFactory.getLogger(this.getClass());
	private Integer prevX=null;
	private Integer prevY=null;

	private Set<Integer> xKey;
    private Set<Integer> yKey;


	public ImageChart(int width,int height,long xMin,long xMax,double yMin,double yMax,int color,int boxSize ){
		this.width = width;
		this.height = height;
		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;
		this.image = new BufferedImage(width,height, BufferedImage.TYPE_INT_ARGB);
		this.color = color;
		
		this.pointCount  = (int)(boxSize / 2);
		this.margin = pointCount+1;

        this.xRate = (float)(width - margin * 2) /(float) (xMax - xMin);
        this.yRate = (float)(height - margin * 2) /(float) (yMax - yMin);
        
        this.dataCount =0;

        this.xKey = new HashSet<>();
        this.yKey = new HashSet<>();
	}
	
	public void addPoint(double x,double y){
		
		this.dataCount++;
		
		int xPos, yPos;
       
        xPos = (int)((x -xMin) * xRate) + margin;
        yPos = height - ((int)((y-yMin) * yRate) + margin);

        if(xKey.contains(xPos) && yKey.contains(yPos)) return;

        xKey.add(xPos);
        yKey.add(yPos);

        int xStart = xPos - pointCount;
        int yStart = yPos - pointCount;

//		image.setRGB(xPos, yPos, color);

		if(prevX!=null){
			line(prevX,prevY,xPos,yPos,color);
		}
		prevX = xPos;
		prevY = yPos;

        for (int ix = xStart; ix <= xStart + pointCount; ix++) {
            for (int iy = yStart; iy <= yStart + pointCount; iy++) {
            	//image.setRGB(ix,iy,color);
            	try{
            		image.setRGB(ix,iy,color);
            	}catch(Exception err){
            		logger.error("x:"+x + " y:"+y + " xMin:"+xMin+ " yMin:"+yMin +  " xRate:"+xRate+ " yRate:"+ yRate +" xPos:"+xPos+ " yPos:"+yPos +" ix:"+ix+ " iy:"+iy);  
            	}
            }

        }
		
	}
	public void addLine(double x,double y,double x2,double y2,int color){

		int xPos, yPos,x2Pos, y2Pos;

		xPos = (int)((x -xMin) * xRate) + margin;
		yPos = height - ((int)((y-yMin) * yRate) + margin);

		x2Pos = (int)((x2 -xMin) * xRate) + margin;
		y2Pos = height - ((int)((y2-yMin) * yRate) + margin);

//		line(xPos,yPos,x2Pos,y2Pos,color);
		Color c = new Color(color);

		drawLine(Double.valueOf(xPos),Double.valueOf(yPos),Double.valueOf(x2Pos),Double.valueOf(y2Pos),c.getRed(),c.getGreen(),c.getBlue());

	}
	private void line(int x,int y,int x2, int y2, int color) {
		Color c = new Color(color);
//		System.out.println("x:"+x+"y:"+y+"x2:"+x2+"y2:"+y2);
		drawLine(Double.valueOf(x),Double.valueOf(y),Double.valueOf(x2),Double.valueOf(y2),c.getRed(),c.getGreen(),c.getBlue());

	}
	public long getDataCount(){
		return this.dataCount;
	}


	void plot( double x, double y, int r,int g,int b, double c) {
//		g.setColor(new Color(0f, 0f, 0f, (float)c));
		//int color = ImageChart.getColor(r,g,b,(int)c);
		int color = ImageChart.getColor(r,g,b,(int)(c*255));
//		g.fillOval((int) x, (int) y, 2, 2);
		try {
			image.setRGB((int) x, (int) y, color);
		}catch (Exception e){
//			logger.error(e.getMessage());
		}


	}

	int ipart(double x) {
		return (int) x;
	}

	double fpart(double x) {
		return x - floor(x);
	}

	double rfpart(double x) {
		return 1.0 - fpart(x);
	}

	void drawLine(double x1, double y1, double x2,double y2, int r,int g,int b) {
		double dx = x2 - x1;
		double dy = y2 - y1;


		if (abs (dx) > abs (dy))
		{
			if (x2 < x1) {
				drawLine(x2,y2,x1,y1,r,g,b);
				return;
			}

			double gradient = dy / dx;
			double xend = round(x1);
			double yend = y1 + gradient * (xend - x1);
			double xgap = rfpart(x1 + 0.5);

			int xpxl1 =(int)xend;
			int ypxl1 = ipart(yend);

			// Add the first endpoint
			plot( xpxl1, ypxl1,r,g,b, rfpart(yend) * xgap);
			plot(xpxl1, ypxl1 + 1,r,g,b,fpart(yend) * xgap);

			double intery = yend + gradient;

			xend = round(x2);
			yend = y2 + gradient * (xend - x2);
			xgap = fpart(x2 + 0.5);

			int xpxl2 = (int)(xend);
			int ypxl2 = ipart(yend);

			// Add the second endpoint
			plot(xpxl2, ypxl2,r,g,b,rfpart(yend) * xgap);
			plot( xpxl2, ypxl2 + 1,r,g,b, fpart(yend) * xgap);

			// Add all the points between the endpoints
			for (int x = xpxl1 + 1; x <= xpxl2 - 1; ++x) {
				plot( x, ipart(intery),r,g,b, rfpart(intery));
				plot( x, ipart(intery) + 1,r,g,b, fpart(intery));
				intery += gradient;
			}
		}
	else
		{
			if (y2 < y1) {
				drawLine(x2,y2,x1,y1,r,g,b);
			}

			double gradient = dx / dy;
			double yend = round(y1);
			double xend = x1 + gradient * (yend - y1);
			double ygap = rfpart(y1 + 0.5);

			int ypxl1 =  (int)(yend);
			int xpxl1 = ipart(xend);

			// Add the first endpoint
			plot(xpxl1, ypxl1,r,g,b, rfpart(xend) * ygap);
			plot(xpxl1, ypxl1 + 1,r,g,b, fpart(xend) * ygap);

			double interx = xend + gradient;

			yend = (round(y2));
			xend = x2 + gradient * (yend - y2);
			ygap = fpart(y2 + 0.5);

			int ypxl2 = (int)(yend);
			int xpxl2 = ipart(xend);

			// Add the second endpoint
			plot( xpxl2, ypxl2,r,g,b, rfpart(xend) * ygap);
			plot(xpxl2, ypxl2 + 1,r,g,b, fpart(xend) * ygap);

			// Add all the points between the endpoints
			for (int y = ypxl1 + 1; y <= ypxl2 - 1; ++y) {
				plot( ipart(interx), y,r,g,b, rfpart(interx));
				plot(ipart(interx) + 1, y, r,g,b,fpart(interx));
				interx += gradient;
			}
		}

	}










	public static int getColor(int r,int g,int b,int a){
		return (a << 24) | (r << 16) | (g << 8) | b;
	}
	public static int getDefIntColor(int i){
		List<Integer[]> colors = new ArrayList<>();
		colors.add(new Integer[]{0,0,255,255});           //Blue
		colors.add(new Integer[]{255,255,0,255});          //Yellow
		colors.add(new Integer[]{0,255,255,255});          //Cyan / Aqua
		colors.add(new Integer[]{255,0,255,255});          //Magenta /Fuchsia
		colors.add(new Integer[]{192,192,192,255});        //Silver
		colors.add(new Integer[]{128,128,128,255});        //Gray
		colors.add(new Integer[]{128,0,0,255});            //Maroon
		colors.add(new Integer[]{128,128,0,255});          //Olive
		colors.add(new Integer[]{0,128,0,255});            //Green
		colors.add(new Integer[]{128,0,128,255});          //Purple
		colors.add(new Integer[]{0,128,128,255});          //Teal
		colors.add(new Integer[]{0,0,128,255});            //Navy
		colors.add(new Integer[]{ 255,255,255,255});    	 //White
		colors.add(new Integer[]{255,0,0,255});            //Red	#FF0
		colors.add(new Integer[]{0,255,0,255});           //Lime

		return ImageChart.getColor( colors.get(i)[0],colors.get(i)[1],colors.get(i)[2],colors.get(i)[3] );
	}
	public static String getDefHexColor(int i){
		List<String> colors = new ArrayList<String>();
		//colors.add("#000000");                 //Black
		colors.add("#0000FF");                 //Blue
		colors.add("#FFFF00");                 //Yellow
		colors.add("#00FFFF");                 //Cyan / Aqua
		colors.add("#FF00FF");                 //Magenta /Fuchsia
		colors.add("#C0C0C0");                 //Silver
		colors.add("#808080");                 //Gray
		colors.add("#800000");                 //Maroon
		colors.add("#808000");                 //Olive
		colors.add("#008000");                 //Green
		colors.add("#800080");                 //Purple
		colors.add("#008080");                 //Teal
		colors.add("#000080");                 //Navy
		colors.add("#FFFFFF");               //White
		colors.add("#FF0000");                 //Red	#FF0
		colors.add("#00FF00");                 //Lime

		return colors.get(i);
	}
	public static double getRandom(int min,int max){
		return (double)(Math.random()*max)+min;
	}

	public String getImage(){

        // Create a byte array output stream.
        ByteArrayOutputStream bao = new ByteArrayOutputStream();

        // Write to output stream
        try {
			ImageIO.write(image, "png", bao);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

        byte[] result = bao.toByteArray();

        StringBuilder sb = new StringBuilder();
        sb.append("data:image/png;base64,");
        sb.append(StringUtils.newStringUtf8(Base64.encodeBase64(result, false)));
        return sb.toString();
	}
	public static String getImageConvertText(BufferedImage srcImage){

        // Create a byte array output stream.
        ByteArrayOutputStream bao = new ByteArrayOutputStream();

        // Write to output stream
        try {
			ImageIO.write(srcImage, "png", bao);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

        byte[] result = bao.toByteArray();

        StringBuilder sb = new StringBuilder();
        sb.append("data:image/png;base64,");
        sb.append(StringUtils.newStringUtf8(Base64.encodeBase64(result, false)));
        return sb.toString();
	}
	public static BufferedImage attachImages(BufferedImage img1, BufferedImage img2)
	{

		try{
			Graphics g = img1.getGraphics();
//	            g.drawImage(img1, 0, 0, null);
			g.drawImage(img2, 0, 0, null);
			g.dispose();
			g = null;
		}finally{

		}
		return img1;

	}

	public BufferedImage getBufferdImage(){
		return this.image;
	}
	public void destroy(){
		this.image = null;
	}

}
