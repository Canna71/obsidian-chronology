

export enum CalendarItemType {
	Day,
	Week,
	Month,
	Year,
    Range
}

export class CalendarItem {
	date: moment.Moment;
	type: CalendarItemType;

    /**
     *
     */
    constructor(date: moment.Moment, type=CalendarItemType.Day) {
        this.date=date;
        this.type=type;
    }

    toString(){
        return CalendarItemType[this.type]+this.date.toString();
    }
}
