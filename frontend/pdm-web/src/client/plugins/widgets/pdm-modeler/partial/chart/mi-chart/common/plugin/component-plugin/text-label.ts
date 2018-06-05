import { IDisplay } from '../../i-display.interface';
import { Series } from '../../series/series';

export interface TextLabelPluginConfiguration {
    orient: string;
    total: boolean;
}

export class TextLabel implements IDisplay {
    _width: number;
    _height: number;
    _textLabelContainer: any;
    _textLabelConfig: TextLabelPluginConfiguration;
    seriesInfo: Series;

    constructor(target: any, config: TextLabelPluginConfiguration) {
        this.textLabelConfig = config;
        this._createGroupContainer(target);
    }

    set width(value: number) {
        this._width = value;
    }

    get width() {
        return this._width;
    }

    set height(value: number) {
        this._height = value;
    }

    get height() {
        return this._height;
    }

    set textLabelConfig(value: TextLabelPluginConfiguration) {
        this._textLabelConfig = value;
    }

    get textLabelConfig() {
        return this._textLabelConfig;
    }

    _createGroupContainer(target: any) {
        this._textLabelContainer = target.append('g').attr('class', 'textLabel');
    }

    _createLabelText() {

        const rect = this.seriesInfo.target.selectAll('rect');
        setTimeout(() => {
            rect[0].map((r: any) => {
                const targetElement = d3.select(r);
                let textLabel: any = this._textLabelContainer.select(`.${targetElement.attr('class')}label`);
                if (!textLabel[0][0]) {
                    textLabel = this._textLabelContainer.append('text')
                        .text(targetElement.attr('value'))
                        .attr('fill', 'black')
                        .attr('class',`${targetElement.attr('class')}label`)
                        .attr('y', d3.select(targetElement[0][0].nearestViewportElement).attr('height'));
                }

                const labelWidth: number = textLabel.node().getBoundingClientRect().width;
                const targetWidth: number = targetElement.attr('width');
                const targetHeight: number = targetElement.attr('height');
                const targetX: number = targetElement.attr('x')? +targetElement.attr('x'):0;
                const targetY: number = targetElement.attr('y')? +targetElement.attr('y'):0;

                if (this.textLabelConfig.orient === 'top') {
                    textLabel
                        .transition().delay(700).attr({
                        x: targetX + (targetWidth/2) - (labelWidth/2),
                        y: targetY - 3
                    });
                } else if (this.textLabelConfig.orient === 'right') {
                    console.log('targetWidth', typeof(targetWidth));
                    console.log('targetX', typeof(targetX));
                    textLabel.transition().delay(700).attr({
                        x: targetX  + (targetWidth * 1) + 3,
                        y: targetY + (targetHeight/2),
                        dy: '.35em'
                    });
                }

            });
        }, 800);
    }

    updateDisplay(width?: number, height?: number) {
        this._createLabelText();
    }
}
