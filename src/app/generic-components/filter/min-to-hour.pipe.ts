import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({
	name: 'minToHour'
})
@Injectable()
export class MinuteToHourPipe implements PipeTransform {
	transform(min: any): any {
		let hours: number = min / 60;
		let hour = parseInt(hours.toString());
		let mins: number = (min % 60) / 100;
		let value: number = hour + mins;
		return value.toFixed(2);
		//return hours+"."+mins;
	}
}