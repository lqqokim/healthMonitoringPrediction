import { ChangeDetectorRef, Component, Input, Output } from '@angular/core';
import { OnChanges, EventEmitter, ChangeDetectionStrategy } from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'tree-node',
    templateUrl: `treeview.node.component.html`,
    styleUrls: [`treeview.node.component.css`],

})
export class TreeNodeComponent implements OnChanges {
    @Input() treeData: any[];
    @Input() depth: number = 0;
    @Input() options: any;
    @Output() selectionChange = new EventEmitter();
    @Input() parentNode: any;
    @Input() parentPath: string;
    
    className;
    constructor() { }
    
    ngOnInit() {
    
    }
    ngOnChanges(changes): void {
        if (changes.treeData != undefined && changes.treeData.currentValue != undefined) {
            this.setExpand(changes.treeData.currentValue);
        }
        if (this.options != null && this.options.depthImageNames != undefined) {
            this.className = this.options.depthImageNames[this.depth];
        }
    }

    onSelectionChange(event) {
        this.selectionChange.emit(event);
    }
    
    nodeClick(node) {
        this.selectionChange.emit(node);

    }
    setExpand(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i]['childLocations'] != undefined && data[i]['childLocations'].length > 0) {
                if (data[i]['expand'] == undefined) {
                    data[i]['expand'] = true;
                }
                data[i]['hasChild'] = true;
                this.setExpand(data[i].childLocations);
            } else {
                data[i]['expand'] = false;
                data[i]['hasChild'] = false;
            }
            if (this.parentPath === undefined || data[i].node === 'Root') {
                data[i]['path'] = '';
            }
            else {
                data[i]['path'] = this.parentPath + '/' + data[i].name;
            }
        }
    }
    clickIcon(obj) {
        if (obj.locationTypeName === 'Area' && obj.expand === false) {
            setTimeout(this.nodeClick(obj), 0);
            setTimeout(() => {
                obj.expand = !obj.expand;
            }, 200);
        } else {
            obj.expand = !obj.expand;
        }
    }
}