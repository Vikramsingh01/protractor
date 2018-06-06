import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({
    name: 'excludeFilter'
})
@Injectable()
export class ExcludeFilterPipe implements PipeTransform {
    transform(items: any[], field: string, value: any): any[] {
        let returnItems:any[] = [];
        if (value && value instanceof Array) {
            items.forEach((item, index) => {
                if (value.indexOf(item[field]) == -1) {
                    returnItems.push(item);
                }
            })
           return returnItems; 
        }
        else if (value && value instanceof String) {
           return items.filter(it => it[field] != value);
        }
    }
}


@Pipe({
    name: 'includeFilter'
})
@Injectable()
export class IncludeFilterPipe implements PipeTransform {
    transform(items: any[], field: string, value: any): any[] {
        let returnItems:any[] = [];
        if (value && value instanceof Array && value.length > 0) {
            items.forEach((item, index) => {
                if (value.indexOf(item[field]) > -1) {
                    returnItems.push(item);
                }
            })
            return returnItems;
        }else{
            return items;
        }
    }
}