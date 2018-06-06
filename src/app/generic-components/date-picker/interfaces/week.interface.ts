import { IDate } from "./date.interface";

export interface IWeek {
    dateObj: IDate;
    cmo: number;
    currDay: boolean;
    dayNbr: number;
    disabled: boolean;
}