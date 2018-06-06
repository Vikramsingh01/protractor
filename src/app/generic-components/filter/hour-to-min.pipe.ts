import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'hourToMin'
})
@Injectable()
export class HourToMinutePipe implements PipeTransform {
    transform(hour: any): any {
        let hour1 = parseInt(hour.toString());
        let minutes: number = hour1 * 60;
        let min: number = (hour - hour1) * 100;
        let value: number = minutes + min;
        return value;

    }
}