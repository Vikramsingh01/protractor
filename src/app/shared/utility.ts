export class Utility {
    static filterArrayByKeyAndValue(items: any[], key: any, value: any): any[] {
        return items.filter(function (item) {
            return item[key] === value;
        });
    }

    static getObjectFromArrayByKeyAndSubKeyAndValue(items: any[], key: any,subKey:any, value: any): any[] {
       
        let list = items.filter(function (item) {
            return item[key][subKey] === value;
        });
        if (list.length === 1) {
            return list[0];
        }
        if (list.length <= 0) {
            return null;
        }
        if (list.length > 1) {
            throw new Error("The specified array has multiple objects with key: " + key + " and value: " + value);
        }
        
    }

    static getObjectFromArrayByKeyAndValue(items: any[], key: any, value: any): any {
        let list = items.filter(function (item) {
            return item[key] === value;
        });
        if (list.length === 1) {
            return list[0];
        }
        if (list.length <= 0) {
            return null;
        }
        if (list.length > 1) {
            throw new Error("The specified array has multiple objects with key: " + key + " and value: " + value);
        }
    }

    static convertSizeToArray(size: number): any[] {
        let data = [];
        for (var i = 0; i < size; i++) {
            data.push(i);
        }
        return data;

    }
    static removeSpaces(string) {
        return string.split(' ').join('');
    }

    static convertTimeToMinutes(time) {
        if (time == null || time == "") {
            return time;
        }
        if (!time.match(/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/)) {
            console.error("Unable to convert given time to mins. Given time does not match format (HH:mm)");
        }
        let durationArray: string[] = time.split(":");
        return (parseInt(durationArray[0]) * 60) + parseInt(durationArray[1]);
    }
    static convertMinutesToHours(minutes) {
        if (minutes != null && minutes !== "") {
            if(parseInt(minutes) == NaN){
                console.error("Unable to parse given minutes.");
            }
            let hours = "00";
            let mins = "00";
            if ((minutes/60) < 10) {
                if(Math.floor(minutes / 60) < 0){
                    let temp = (Math.floor(minutes / 60)*-1) % 10 ;
                    if(temp > 9){
                        hours = "-0" + (Math.floor(minutes / 60)*-1); }
                    else{
                        hours = "-" + (Math.floor(minutes / 60)*-1);
                    }

                }else{
                    hours = "0" + Math.floor(minutes / 60);
                }
            }else {
                hours = Math.floor(minutes / 60).toString();
            }
            if((minutes % 60) < 10){
                if(Math.floor(minutes % 60) < 0){
                    mins = "" + (Math.floor(minutes % 60)*-1);
                }else{
                    mins = "0" + Math.floor(minutes % 60);
                }
            }else{
                mins = (minutes % 60).toString();
            }
            minutes = hours + ":" + mins;
        }
        return minutes;
    }

    static convertStringToDate(stringDate){
        if(stringDate != null && stringDate != ""){
            var parts = stringDate.split('/');
            return new Date(parts[2],parts[1]-1,parts[0]);
        }
        return null;
    }

    static convertDateToString(date: Date){
        if(date != null){
            let month = date.getMonth()+1;
            return date.getDate()+"/"+month+"/"+date.getFullYear();
        }
        return null;
    }

    static getDifferenceBetweenDatesInMonths(startDate, endDate){
        let date1: Date = this.convertStringToDate(startDate);
        let date2: Date = this.convertStringToDate(endDate);
        let diffenceInMonths = 0;
        if(date1 != null && date2 != null){
            diffenceInMonths = (date2.getFullYear() - date1.getFullYear())*12 + (date2.getMonth() - date1.getMonth());
        }
        return diffenceInMonths;
    }

    static getToday(){
        let systemdate: Date = new Date();
        return {
            year: systemdate.getFullYear(), month: systemdate.getMonth() + 1, day: systemdate.getDate()
        };
    }

    static getTodayTime(){
        let systemtime: Date = new Date();
        let minutes=systemtime.getMinutes();
        var minutesStr;
        var hrStr;
        if(minutes<10)
            minutesStr="0"+minutes;
        else
            minutesStr=minutes;
        if(systemtime.getHours()<10)
            hrStr="0"+systemtime.getHours();
        else
            hrStr=systemtime.getHours();
        return {

            hours: hrStr, minutes: minutesStr

        };
    }

    static getOneWeekAheadOfToday(){
        let systemdate: Date = new Date();
        systemdate.setDate(systemdate.getDate() + 7);
        return {
            year: systemdate.getFullYear(), month: systemdate.getMonth() + 1, day: systemdate.getDate()
        };
    }

    static escapeHtmlTags(formObj: any) {
        let fields: string[] = Object.keys(formObj);
        fields.forEach(field => {
            if (formObj[field] != null && formObj[field] != '' && (isNaN(formObj[field])&&(typeof formObj[field]=="string")) ){
                   formObj[field] = formObj[field].replace(/(<([^>]+)>)/ig, "");
                  }
        });
        return formObj;
    }
    static removeFromArray (items,property,value)
    {
         return items.filter(function (val) {
          return val[property] !== value;
      });

    }

    static convertTextToBoolean(text:any):boolean{
        if(text === 'true'){
          return true;
        }else if(text === 'false'){
          return false;
        }else if(text == null || text == undefined || text.trim().length>0){
          return null;
        }
      }
}
