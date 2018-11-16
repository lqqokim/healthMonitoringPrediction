package com.bistel.a3.portal.domain.pdm;

import java.util.List;

public class ImageChartData {
    private int height;
    private int width;
    private String image;
    private String sessionId;
    private boolean showProgress = false;
    private Long xMax;
    private Long xMin;
    private String x_axis_type;
    private String yLabel;
    private Double yMax;
    private Double yMin;
    private List<SeriesInfo> seriesInfoList;

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public boolean isShowProgress() {
        return showProgress;
    }

    public void setShowProgress(boolean showProgress) {
        this.showProgress = showProgress;
    }

    public Long getxMax() {
        return xMax;
    }

    public void setxMax(Long xMax) {
        this.xMax = xMax;
    }

    public Long getxMin() {
        return xMin;
    }

    public void setxMin(Long xMin) {
        this.xMin = xMin;
    }

    public String getX_axis_type() {
        return x_axis_type;
    }

    public void setX_axis_type(String x_axis_type) {
        this.x_axis_type = x_axis_type;
    }

    public String getyLabel() {
        return yLabel;
    }

    public void setyLabel(String yLabel) {
        this.yLabel = yLabel;
    }

    public Double getyMax() {
        return yMax;
    }

    public void setyMax(Double yMax) {
        this.yMax = yMax;
    }

    public Double getyMin() {
        return yMin;
    }

    public void setyMin(Double yMin) {
        this.yMin = yMin;
    }

    public List<SeriesInfo> getSeriesInfoList() {
        return seriesInfoList;
    }

    public void setSeriesInfoList(List<SeriesInfo> seriesInfoList) {
        this.seriesInfoList = seriesInfoList;
    }
}
