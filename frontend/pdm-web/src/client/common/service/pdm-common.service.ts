import { Injectable } from '@angular/core';
import { PdmModelService } from '../model/app/pdm/pdm-model.service';

import * as wjcCore from 'wijmo/wijmo';
import * as wjGrid from 'wijmo/wijmo.grid';

@Injectable()
export class PdmCommonService {

	constructor(
        private _pdmModel:PdmModelService
    ) {}

	getPlants() {
		return this._pdmModel.getPlants();
	}

	getAreaStatus(plantId, from, to) {
        return this._pdmModel.getAreaStatus(plantId, from, to);
	}

	getEqpStatus(plantId, areaId, from, to) {
		return this._pdmModel.getEqpStatus(plantId, areaId, from, to);
	}

 
    getHealthIndex(plantId, areaId, eqpId, from, to) {
        return this._pdmModel.getHealthIndex(plantId,areaId, eqpId, from, to);
    }
    getContribute(plantId,areaId, eqpId, from, to) {
        return this._pdmModel.getContribute(plantId,areaId, eqpId, from, to);
    }
    getParamStatus(plantId, areaId, eqpId, from, to) {
        return this._pdmModel.getParamStatus(plantId, areaId, eqpId, from, to);
    }

    // TODO : remove
    private _getTempValue() {
        return (Math.random()).toFixed(1);
    }

    private _getTempMeasurement(measurementId, measdate) {
        
        return {
            measdate: measdate,
            measurementId: measurementId,
            rpm: 1000,
            usl: 1.5,
            ucl: 1.0,
            target: 0.5,
            part1x: {
                "모터 1X": 500,
                "팬 1X": 300
            }
        }
    }

    // TODO : remove
    private _getTempMeasurementData() {
        let data = [];
        for (let i=0; i<500; i++) {
            data.push([i, Math.random()*2]);
        }

        return data;
    }

    getMeasurements(plantId, areaId, eqpId, paramId, from, to) {
        return this._pdmModel.getMeasurements(plantId, areaId, eqpId, paramId, from, to);

        // return new Promise<any[]>((resolve, reject) => {
        //     setTimeout(()=>{
        //         let ret = [this._getTempMeasurement(1, Date.now() - 86400000), this._getTempMeasurement(2, Date.now() - 43200000)]
        //         resolve(ret);
        //     }, 500);
        // });
    }
    getMaintenance(plantId, areaId, eqpId, from, to) {
        return this._pdmModel.getMaintenance(plantId, areaId, eqpId, from, to);

        // return new Promise<any[]>((resolve, reject) => {
        //     setTimeout(()=>{
        //         let ret = [this._getTempMeasurement(1, Date.now() - 86400000), this._getTempMeasurement(2, Date.now() - 43200000)]
        //         resolve(ret);
        //     }, 500);
        // });
    }
    getParamInfoByEqpId(plantId, areaId, eqpId) {
        return this._pdmModel.getParamInfoByEqpId(plantId, areaId, eqpId);

        // return new Promise<any[]>((resolve, reject) => {
        //     setTimeout(()=>{
        //         let ret = [this._getTempMeasurement(1, Date.now() - 86400000), this._getTempMeasurement(2, Date.now() - 43200000)]
        //         resolve(ret);
        //     }, 500);
        // });
    }
    
    getTimewave(plantId, areaId, eqpId, measurementId) {
        return this._pdmModel.getTimewave(plantId, areaId, eqpId, measurementId);

        // return new Promise<any[]>((resolve, reject) => {
        //     setTimeout(()=>{
        //         resolve(this._getTempMeasurementData());
        //     }, 500);
        // });
    }

    getSpectra(plantId, areaId, eqpId, measurementId) {
        return this._pdmModel.getSpectrum(plantId, areaId, eqpId, measurementId);

        // return new Promise<any[]>((resolve, reject) => {
        //     setTimeout(()=>{
        //         resolve(this._getTempMeasurementData());
        //     }, 500);
        // });
    }
    getMeasureRPM(plantId, areaId, eqpId, measurementId) {
        return this._pdmModel.getMeasureRPM(plantId, areaId, eqpId, measurementId);

        // return new Promise<any[]>((resolve, reject) => {
        //     setTimeout(()=>{
        //         resolve(this._getTempMeasurementData());
        //     }, 500);
        // });
    }
    getElectricCurrent(plantId, areaId, eqpId, from,to) {
        return this._pdmModel.getElectricCurrent(plantId, areaId, eqpId, from,to);

        // return new Promise<any[]>((resolve, reject) => {
        //     setTimeout(()=>{
        //         resolve(this._getTempMeasurementData());
        //     }, 500);
        // });
    }

    
    getAnalysis(plantId, areaId, eqpId, measurementId) {
        return this._pdmModel.getAnalysis(plantId, areaId, eqpId, measurementId);

        // return new Promise<any[]>((resolve, reject) => {
        //     setTimeout(()=>{
        //         resolve(this._getTempMeasurementData());
        //     }, 500);
        // });
    }
    getAnalysisInfo(plantId, areaId, eqpId, paramId,fromDate,toDate,rate){
        return this._pdmModel.getAnalysisInfo(plantId, areaId, eqpId,paramId,fromDate,toDate,rate);
    }
    getModelMeasurement(plantId, areaId, eqpId, measurementId) {
        return this._pdmModel.getModelMeasurement(plantId, areaId, eqpId, measurementId);

        // return new Promise<any[]>((resolve, reject) => {
        //     setTimeout(()=>{
        //         resolve(this._getTempMeasurementData());
        //     }, 500);
        // });
    }




    // for grid
    bindColumnGroups(flex, columnGroups) {
        // create the columns
        flex.autoGenerateColumns = false;
        this.createColumnGroups(flex, columnGroups, 0);

        // merge the headers
        this.mergeColumnGroups(flex);

        // center-align headers vertically and horizontally
        flex.formatItem.addHandler(function (s, e) {
            if (e.panel == flex.columnHeaders) {
                e.cell.innerHTML = '<div>' + e.cell.innerHTML + '</div>';
				wjcCore.setCss(e.cell, {
                	display: 'table',
                    tableLayout: 'fixed'
				});
                wjcCore.setCss(e.cell.children[0], {
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    textAlign: 'center'
                });
            }
        });

        // select column groups by clicking the merged headers
        flex.allowSorting = false;
        flex.allowDragging = wjGrid.AllowDragging.None;
        flex.addEventListener(flex.hostElement, 'click', function (e) {
            var ht = flex.hitTest(e);
            if (ht.panel == flex.columnHeaders) {
                var rng = flex.getMergedRange(flex.columnHeaders, ht.row, ht.col, false) || ht.range;
                flex.select(new wjGrid.CellRange(0, rng.col, flex.rows.length - 1, rng.col2));
                e.preventDefault();
            }
        });
    }
    createColumnGroups(flex, columnGroups, level) {

        // prepare to generate columns
        var colHdrs = flex.columnHeaders;

        // add an extra header row if necessary
        if (level >= colHdrs.rows.length) {
            colHdrs.rows.splice(colHdrs.rows.length, 0, new wjGrid.Row());
        }

        // loop through the groups adding columns or groups
        for (var i = 0; i < columnGroups.length; i++) {
            var group = columnGroups[i];
            if (!group.columns) {

                // create a single column
                var col = new wjGrid.Column();

                // copy properties from group
                for (var prop in group) {
                    if (prop in col) {
                        col[prop] = group[prop];
                    }
                }

                // add the new column to the grid, set the header
                flex.columns.push(col);
                colHdrs.setCellData(level, colHdrs.columns.length - 1, group.header);

            } else {

                // get starting column index for this group
                var colIndex = colHdrs.columns.length;

                // create columns for this group
                this.createColumnGroups(flex, group.columns, level + 1);

                // set headers for this group
                for (var j = colIndex; j < colHdrs.columns.length; j++) {
                    colHdrs.setCellData(level, j, group.header);
                }
            }
        }
    }
    mergeColumnGroups(flex) {

        // merge headers
        var colHdrs = flex.columnHeaders;
        flex.allowMerging = wjGrid.AllowMerging.ColumnHeaders;

        // merge horizontally
        for (var r = 0; r < colHdrs.rows.length; r++) {
            colHdrs.rows[r].allowMerging = true;
        }

        // merge vertically
        for (var c = 0; c < colHdrs.columns.length; c++) {
            colHdrs.columns[c].allowMerging = true;
        }

        // fill empty cells with content from cell above
        for (var c = 0; c < colHdrs.columns.length; c++) {
            for (var r = 1; r < colHdrs.rows.length; r++) {
                var hdr = colHdrs.getCellData(r, c);
                if (!hdr || hdr == colHdrs.columns[c].binding) {
                    var hdr = colHdrs.getCellData(r - 1, c);
                    colHdrs.setCellData(r, c, hdr);
                }
            }
        }

        // handle top-left panel
        for (var c = 0; c < flex.topLeftCells.columns.length; c++) {
            flex.topLeftCells.columns[c].allowMerging = true;
        }
    }

    getNodeTree(plantId) {
		return this._pdmModel.getNodeTree(plantId);
	}
    //  getHealthIndex(plant,shop,eqp,from,to){
	// 	return this._pdmService.getNodeTree(plant,shop,eqp,from,to);
	// }
    //  getMeasurements(plantId,areaId,eqpId,paramId,from,to){
	// 	return this._pdmModel.getMeasurements(plantId,areaId,eqpId,paramId,from,to);
	// }
    //  getTimewave(plantId,areaId,eqpId,key){
	// 	return this._pdmModel.getTimewave(plantId,areaId,eqpId,key);
	// }
    //  getSpectrum(plantId,areaId,eqpId,key){
	// 	return this._pdmModel.getSpectrum(plantId,areaId,eqpId,key);
	// }

    getReports(plantId, from, to) {
        return this._pdmModel.getReports(plantId, from, to);
    }

    getEqpInfo(plantId, eqpId) {
        return this._pdmModel.getEqpInfo(plantId, eqpId);
    }

    updateReport(plantId, report) {
        return this._pdmModel.updateReport(plantId, report);
    }

    getTrendMultiple(plantId, areaId, eqpId, paramId, from, to) {
        return this._pdmModel.getTrendMultiple(plantId, areaId, eqpId, paramId, from, to);
    }

    getTrendMultipleSpec(plantId, areaId, eqpId, paramId, from, to) {
        return this._pdmModel.getTrendMultipleSpec(plantId, areaId, eqpId, paramId, from, to);
    }
     getTrendMultipleSpecConfig(plantId, areaId, eqpId, paramId, from, to) {
        return this._pdmModel.getTrendMultipleSpecConfig(plantId, areaId, eqpId, paramId, from, to);
    }

    getModels(plantId) {
        return this._pdmModel.getModels(plantId);
    }

    getPpt(img) {
        return this._pdmModel.getPpt(img);
    }

    getContourChart(plantId, areaId, eqpId, from, to) {
        return this._pdmModel.getContourChart(plantId, areaId, eqpId, from, to);
    }

    getParamDetail(plantId, paramId) {
        return this._pdmModel.getParamDetail(plantId, 0, 0, paramId);
    }

    createFeature(from,toDay) {
        return this._pdmModel.createFeature(from,toDay);
    }
}


