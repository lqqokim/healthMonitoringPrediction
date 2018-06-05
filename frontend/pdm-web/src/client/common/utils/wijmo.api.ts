
import * as wjcCore from 'wijmo/wijmo';

export class WijmoApi {
    onResize(e: any) {
        if (!e) e = document.body;
        let ctl: any = wjcCore.Control.getControl(e);

        if (ctl) {
            ctl.invalidate(true);
        }
    }

    getLazyLayout() {
        let lazyLayout = _.debounce(() => {
            const evt = window.document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        }, 100);
        return lazyLayout;
    }
}