export class ContextUtil {

	static getTarget(config: any): any {
        let target: any;
        if (config.event) {
            target = $(config.event.target);
        } else if (config.target) {
            target = $(config.target);
        }
        return target;
	}

    static getEventPosition(event: any): any {
        console.log(event);
        if (event) {
            // jquery event
            if (!isNaN(Number(event.pageX))) {
                return {x: event.pageX, y: event.pageY};
            }
            // javascript event
            else if (!isNaN(Number(event.clientX))) {
                return {x: event.clientX, y: event.clientY};
            }
        }
        return {x: 0, y: 0};
    }

    static isTickPosition(event: any): boolean {
        if (!event) return false;
        if ($('.qtip-tip').length === 0) return false;
        let gap = 20 ;
        let tick = $('.qtip-tip');
        let tickOffset = tick.offset();
        let eventPosition = ContextUtil.getEventPosition(event);
        let tickPosition = {
            xMin: tickOffset.left - gap,
            xMax: tickOffset.left + gap,
            yMin: tickOffset.top - gap,
            yMax: tickOffset.top + gap
        };
        if (tickPosition.xMin < eventPosition.x
            && tickPosition.xMax > eventPosition.x
            && tickPosition.yMin < eventPosition.y
            && tickPosition.yMax > eventPosition.y) {
            return true;
        }
        return false;
    }
}

