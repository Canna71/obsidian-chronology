import { moment } from "obsidian";

export enum CalendarItemType {
    Day,
    Week,
    Month,
    Year,
    Range,
}

export class CalendarItem {
    date: moment.Moment;
    type: CalendarItemType;
    toDate?: moment.Moment | undefined;

    /**
     *
     */
    constructor(
        date: moment.Moment,
        type = CalendarItemType.Day,
        toDate?: moment.Moment
    ) {
        this.date = date.clone().startOf("day");
        this.type = type;
        this.toDate = toDate?.endOf("day");
        if (this.toDate) {
            this.type = CalendarItemType.Range;
            if(this.toDate.isBefore(this.date)) {
                [this.date, this.toDate] = [this.toDate.startOf("day"), this.date.endOf("day")];
            } 
        }
    }

    toString() {
        return CalendarItemType[this.type] + this.date.toString();
    }

    private getMomentTimeRange(period: moment.unitOfTime.StartOf) {
        const fromTime = moment(this.date).startOf(period);
        const toTime = moment(this.date).endOf(period);
        return { fromTime, toTime };
    }

    isInRange(date: moment.Moment) {
        const { fromTime, toTime } = this.getTimeRange();
        const inRange = fromTime.isSameOrBefore(date) && toTime?.isSameOrAfter(date);
        console.log(date.toString(),fromTime.toString(), toTime?.toString(), inRange)
        return inRange;
    }

    getTimeRange() {
        switch (this.type) {
            case CalendarItemType.Year:
                return this.getMomentTimeRange("year");
                break;
            case CalendarItemType.Month:
                return this.getMomentTimeRange("month");
                break;
            case CalendarItemType.Week:
                return this.getMomentTimeRange("week");
                break;
            case CalendarItemType.Day:
                return this.getMomentTimeRange("day");
                break;
            case CalendarItemType.Range:
                return { fromTime: this.date, toTime: this.toDate };
                break;
            default:
                throw new Error("Unknown Calendar Item Type!!!");
                break;
        }
    }
}
