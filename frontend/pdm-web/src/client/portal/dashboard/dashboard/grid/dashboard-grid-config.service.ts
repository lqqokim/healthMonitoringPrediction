import { Injectable } from '@angular/core';

@Injectable()
export class DashboardGridConfigService {

    get config() {
        return {
            widget_selector: 'li',
            widget_margins: [3, 3], // width, height (px)
            widget_base_dimensions: [50, 100], // width, height (px)
            widget_width_col_percent: 4.15777, // 4.16666
            // widget_width_col_percent: 4.14444,
            widget_height_row_percent: 8.28888,
            height_margin: 40, // a3 header height
            min_cols: 24,
            max_cols: 24,
            extra_cols: 0,
            min_rows: 12,
            max_rows: 120,
            extra_rows: 0,
            autogrow_cols: false,
            autogenerate_stylesheet: true,
            // resize
            helper: 'clone',
            resize: {
                enabled: true
            },
            // only draggable with widget header
            draggable: {
                handle: '.a3-widget-drag-area',
                distance: 0
            }
        };
    }
}