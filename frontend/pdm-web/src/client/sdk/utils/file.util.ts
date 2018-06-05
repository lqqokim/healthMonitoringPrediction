export class FileUtil {

    static isCSVFile(file) {
        if (file) {
            return file.name.endsWith('.csv');
        } else {
            return false;
        }
    }

    static getHeaderArray(csvRecordsArr) {
        let headers = csvRecordsArr[0].split(';');
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    static validateHeaders(origHeaders, fileHeaaders) {
        if (origHeaders.length !== fileHeaaders.length) {
            return false;
        }

        let fileHeaderMatchFlag = true;
        for (let j = 0; j < origHeaders.length; j++) {
            if (origHeaders[j] !== fileHeaaders[j]) {
                fileHeaderMatchFlag = false;
                break;
            }
        }
        return fileHeaderMatchFlag;
    }

    static getDataRecordsArrayFromCSVFile(csvRecordsArray, headerLength) {
        let dataArr = [];

        for (let i = 1; i < csvRecordsArray.length; i++) {
            let data = csvRecordsArray[i].split(';');

            if (data.length === headerLength) {
                let col = [];

                for (let j = 0; j < data.length; j++) {
                    col.push(data[j]);
                }

                dataArr.push(col);
            } else {
                return null;
            }
        }
        return dataArr;
    }
}

