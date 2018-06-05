package com.bistel.a3.common.util.imageChart;

public class ImageChartReply {
	String image;
//	Date xDateMin;
//	Date xDateMax;
	long xMin;
	long xMax;
	double yMin;
	double yMax;
	int width;
	int height;
	String name;
	String color;
	boolean seriesChecked = true;
	long dataCount;
//	ImageChart imageChart;
	public long getDataCount() {
		return dataCount;
	}
	public void setDataCount(long dataCount) {
		this.dataCount = dataCount;
	}
	public boolean getSeriesChecked() {
		return seriesChecked;
	}
	public void setSeriesChecked(boolean seriesChecked) {
		this.seriesChecked = seriesChecked;
	}

	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	public long getxMin() {
		return xMin;
	}
	public void setxMin(long xMin) {
		this.xMin = xMin;
	}
	public long getxMax() {
		return xMax;
	}
	public void setxMax(long xMax) {
		this.xMax = xMax;
	}
	public double getyMin() {
		return yMin;
	}
	public void setyMin(double yMin) {
		this.yMin = yMin;
	}
	public double getyMax() {
		return yMax;
	}
	public void setyMax(double yMax) {
		this.yMax = yMax;
	}
	public int getWidth() {
		return width;
	}
	public void setWidth(int width) {
		this.width = width;
	}
	public int getHeight() {
		return height;
	}
	public void setHeight(int height) {
		this.height = height;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
//	public ImageChart getImageChart() {
//		return imageChart;
//	}
//	public void setImageChart(ImageChart imageChart) {
//		this.imageChart = imageChart;
//	}
//	public void setBufferdImage(BufferedImage bufferedImage){
//		  ByteArrayOutputStream bao = new ByteArrayOutputStream();
//
//	        // Write to output stream
//	        try {
//				ImageIO.write(bufferedImage, "png", bao);
//			} catch (IOException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//
//	        byte[] result = bao.toByteArray();
//
//	        StringBuilder sb = new StringBuilder();
//	        sb.append("data:image/png;base64,");
//	        sb.append(StringUtils.newStringUtf8(Base64.encodeBase64(result, false)));
//	        this.image = sb.toString();
//	}
}
