import { IDayLabels } from "./day-labels.interface";
import { IMonthLabels } from "./month-labels.interface";
import { IDate } from "./date.interface";

export interface IOptions {
    dayLabels?: IDayLabels;
    monthLabels?: IMonthLabels;
    dateFormat?: string;
    showTodayBtn?: boolean;
    todayBtnTxt?: string;
    firstDayOfWeek?: string;
    sunHighlight?: boolean;
    markCurrentDay?: boolean;
    disableUntil?: IDate;
    disableSince?: IDate;
    disableDays?: Array<IDate>;
    disableWeekends?: boolean;
    height?: string;
    width?: string;
    selectionTxtFontSize?: string;
    inline?: boolean;
    alignSelectorRight?: boolean;
    indicateInvalidDate?: boolean;
    showDateFormatPlaceholder?: boolean;
    customPlaceholderTxt?: string;
    editableDateField?: boolean;
    editableMonthAndYear?: boolean;
    minYear?: number;
    maxYear?: number;
    componentDisabled?: boolean;
    inputValueRequired?: boolean;
}
