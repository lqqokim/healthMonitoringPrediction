import {
    Component, OnInit, AfterViewInit, OnDestroy, Input, Output,
    Pipe, PipeTransform, OnChanges, SimpleChanges, EventEmitter,
    ElementRef, ViewEncapsulation
} from '@angular/core';

import { UUIDUtil } from '../../../utils/uuid.util';
import { SelectorGroupService } from '../selector-group.service';

@Component({
    moduleId: module.id,
    selector: 'a3s-location-selector',
    template: `
        <div class="a3-configuration-forms-wrapper clearfix" 
             [id]="locationDomId" 
             (click)="closeDropdown($event)">

            <div class="a3-form-text">{{ locationType.name }}</div>
        	<div class="btn-group" 
                [ngClass]="{open: isOpen}">
        		<a class="btn btn-default btn-sm btn-configuration" 
                   [ngClass]="{'disabled': isDisabled}"
                   (click)="openDropdown()">
        			<span class="pull-left">{{ selectedText }}</span>
        			<span class="caret pull-right caret-adjustment"></span>
        		</a>
        		<ul class="dropdown-menu configuration-multi-menu" aria-labelledby="dropdownMenu">
        			<li *ngFor="let item of locations">
        				<a (click)="toggleSelectItem(item)">
        					<span class="fa fa-check configuration-adjustment" 
                                  [ngStyle]="getClassName(item)" aria-hidden="true">
                                </span>{{ item.name }}
        				</a>
        			</li>
        		</ul>
        	</div>

        </div>
    `,
    encapsulation: ViewEncapsulation.None
})
export class LocationSelectorComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    @Input() locationType: any;
    @Input() locationFn: any;
    @Input() outsideClassToClose: string;
    @Output() outsideClick: EventEmitter<any> = new EventEmitter();
    @Output() changedLocation: EventEmitter<any> = new EventEmitter();
    @Output() location: EventEmitter<any> = new EventEmitter();

    isLoad: boolean = false;
    isDisabled: boolean = true;
    isOpen: boolean = false;
    locationDomId: string;
    selectedId: any = -1;
    selectedText: string = 'Select';
    locations: any;

    constructor(
        private element: ElementRef,
        private selectorGroup: SelectorGroupService
    ) {
        this.locationDomId = `location-selector-${UUIDUtil.new()}`;
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.location.emit({
            location: this
        });
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    setLocationData(locationId, selectedId) {
        //locationId : 데이터를 가져오기 위한 조건, selectedId configuration 로드시 선택 되어야 할 id
        this.isDisabled = false;
        if (selectedId != null && selectedId > -1) {
            this.selectedId = selectedId;
            this.isLoad = true;
        }

        this.selectorGroup
            .getLocations(locationId)
            .then((response) => {
                this.selectedText = '-';
                this.locations = response;
                if (!this.isLoad) {
                    if (this.locations && this.locations.length > 0) {
                        this.selectedId = this.locations[0].locationId;
                        this.selectedText = this.locations[0].name;
                    }
                } else {
                    for (var i = 0; i < this.locations.length; i++) {
                        if (this.locations[i].locationId === this.selectedId) {
                            this.selectedText = this.locations[i].name;
                            break;
                        }
                    }
                }
                this._change();
            }, (err) => {
                console.log('setLocationData exception: ', err);
            });
    }

    toggleSelectItem({locationId, name}) {
        this.selectedId = locationId;
        this.selectedText = name;
        this._change();
        this._closeDropdown();
    }

    private _change() {
        if (!this.isDisabled) {
            this.changedLocation.emit({
                locationType: this.locationType,
                selectedId: this.selectedId,
                isLoad: this.isLoad
            });
            this.isLoad = false;
        }
    }

    private _closeDropdown() {
        if( this.isOpen === false ) { return; }
        this.isOpen = false;
    }

    disable() {
        this.locations = null;
        this.isDisabled = true;
        this.selectedId = -1;
    }

    getSelectedId() {
        return this.selectedId;
    }

    getSelectedName() {
        return this.selectedText;
    }

    openDropdown() {
        this.isOpen = true;
    }

    /**
    * closet 에 안들어오면 multiselector를 닫아준다. 
    * clickDOMtoClose
    */
    closeDropdown($event?: any) {
        if (this.isOpen === false) return;

        if ($event) {
             let dom: any;
            if (this.outsideClassToClose) {
                dom = jQuery(this.outsideClassToClose);
            } else {
                dom = jQuery(document);
            }

            dom.on('click', (evt: any) => {
                if (!jQuery(evt.target).closest('#' + this.locationDomId).length) {
                    this.isOpen = false;
                    this._closeEmit();
                }

                $event.stopPropagation();
            });
        } else {
            this.isOpen = false;
        }
    }

    private _closeEmit() {
        if (this.outsideClick) {
            this.outsideClick.emit({
                locationType: this.locationType,
                selectedId: this.selectedId,
                isLoad: this.isLoad
            });
        }
    }

    getClassName({locationId, name}) {
        let varClassName = { visibility: 'hidden' };
        if (this.selectedId === locationId) {
            varClassName = { visibility: 'visible' };
        }
        return (varClassName);
    }

    ngOnDestroy() {
        $(this.element.nativeElement).remove();
    }
}