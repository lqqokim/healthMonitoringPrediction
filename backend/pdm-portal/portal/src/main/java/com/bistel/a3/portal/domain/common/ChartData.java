package com.bistel.a3.portal.domain.common;

import java.util.ArrayList;
import java.util.List;

public class ChartData {
    private List<SeriesData> series = new ArrayList<>();

    public List<SeriesData> getSeries() {
        return series;
    }

    public void setSeries(List<SeriesData> series) {
        this.series = series;
    }

    public void addSeries(SeriesData series) {
        this.series.add(series);
    }
}
