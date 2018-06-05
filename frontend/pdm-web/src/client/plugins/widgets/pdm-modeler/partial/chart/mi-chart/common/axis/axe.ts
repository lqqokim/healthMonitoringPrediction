export class Axe {

    _scaleToAxe: any; // chart base reference, Axis with scale value
    _scale: any;
    _itemDimensions: number;
    name: string;

    // getter setter method
    set scaleToAxe(value: any) {
        this._scaleToAxe = value;
    }

    get scaleToAxe() {
        return this._scaleToAxe;
    }

    set scale(value: any) {
        this._scale = value;
        if (this._scale.rangeBand) {
            this.itemDimensions = this._scale.rangeBand();
        } else {
            this.itemDimensions = 0;
        }
    }

    get scale() {
        return this._scale;
    }

    set itemDimensions(value:number) {
        this._itemDimensions = value;
    }

    get itemDimensions(): number {
        return this._itemDimensions;
    }

    constructor( ) { }
}
