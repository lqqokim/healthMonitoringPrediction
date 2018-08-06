import { Component, OnInit, ViewEncapsulation } from '@angular/core'

@Component({
    moduleId: module.id,
    selector: 'log-sql-parse',
    templateUrl: 'log-sql-parse.html',
    styleUrls: ['log-sql-parse.css']

})
export class LogSqlParseComponent implements OnInit {

    constructor() {

    }

    ngOnInit(): void {

    }

    parse(){
        var datas = $('#data').val().split(',');
        var replaceDatas =[];
        for (let index = 0; index < datas.length; index++) {
            const element = datas[index].trim();
            let type = element.match(/\(.*?\)/g)
            if(type[0] =="(Timestamp)"){
                replaceDatas.push("timestamp'"+element.replace(type[0],'')+"'");
            }else{
                replaceDatas.push(element.replace(type[0],''));
            }
        }
        var sql = $('#sql').val();
        for(let i=0;i<replaceDatas.length;i++){
            sql = sql.replace('?',replaceDatas[i]);
        }

        $('#result').text(sql);
        

    }
    logParse(){
        try{
            var datas = $('#log').val().split('\n');
            var sql = datas[0].split('Preparing: ')[1];
            var param = datas[1].split(' Parameters: ')[1];
            $('#sql').text(sql);
            $('#data').text(param);
            this.parse();
    
        }catch(err){
            console.log(err);
        }
    }

}