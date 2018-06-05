import { WidgetApi } from './widget.api';

export class WidgetConfigApi {
    _widgetApi: WidgetApi;

    setWidgetApi(widgetApi: WidgetApi) {
        this._widgetApi = widgetApi;
    }

    getWidgetApi(): WidgetApi {
        return this._widgetApi;
    }
}