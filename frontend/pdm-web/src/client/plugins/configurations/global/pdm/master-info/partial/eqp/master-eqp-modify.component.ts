//Angular
import { Component, Input, OnInit, OnChanges, ViewEncapsulation, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    moduleId: module.id,
    selector: 'eqp-modify',
    templateUrl: 'master-eqp-modify.html',
    styleUrls: ['./master-eqp-modify.css'],
    encapsulation: ViewEncapsulation.None
})
export class MasterEqpModifyComponent implements OnInit, OnChanges {
    @Input() data: any;
    @ViewChild("fileInput") fileInput;

    status: string;
    eqpData: any;
    dataTypes: any[];
    base64Image: any;
    changeImage: boolean;

    constructor(
        private domSanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {

    }

    ngOnChanges(changes: any): void {
        if (changes.data.currentValue) {
            // this.dataTypes = [{ typeId: 1, typeName: 'STD' }, { typeId: 2, typeName: 'SKF' }];
            let currentValue = changes.data.currentValue;
            this.eqpData = currentValue.eqp;
            this.status = currentValue.status;
            this.changeImage = false;

            if (this.fileInput && this.fileInput.nativeElement.value !== "") {
                this.fileInput.nativeElement.value = "";
            }

            if (this.status === "modify") { //for show image 
                if (this.eqpData.image) {
                    this.base64Image = this.domSanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${this.eqpData.image}`);
                } else {
                    if(this.base64Image) {
                        this.base64Image = undefined;
                    }
                }
            } else if (this.status === "create") {
                if (this.base64Image) {
                    this.base64Image = undefined;
                }
            }
        }
    }

    getData(): any {
        if (this.base64Image) {
            this.eqpData.image = this.splitImageData(this.base64Image);
        } else {
            this.eqpData.image = '';
        
        }
        this.eqpData.dataTypeCd ="STD";
        this.eqpData.dataType ="STD";
        
        return this.eqpData;
    }

    splitImageData(base64Image): string {
        let eqpImage;

        if (this.status === "create") {
            eqpImage = base64Image.split(',')[1];
        } else if (this.status === "modify") {
            if (this.changeImage) {
                eqpImage = base64Image.split(',')[1];
            } else {
                eqpImage = base64Image.changingThisBreaksApplicationSecurity.split(',')[1];
            }
        }

        return eqpImage;
    }

    changeListener(ev: any): void {
        if (this.status === "modify") {
            if (ev) {
                this.changeImage = true;
            }
        }

        this.readThis(ev.target);
    }

    readThis(inputValue: any): void {
        if (inputValue.files && inputValue.files[0]) {
            let file: File = inputValue.files[0];
            let fileReader: FileReader = new FileReader();

            fileReader.onloadend = (e: any) => {
                this.base64Image = fileReader.result;
            }
            fileReader.readAsDataURL(file);
        }
    }

    removeImage(ev: any): void {
        if (this.fileInput.nativeElement.value) {
            this.fileInput.nativeElement.value = '';
        }

        if (this.base64Image) {
            this.base64Image = undefined;
        }
    }
}