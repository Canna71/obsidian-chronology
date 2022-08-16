import { CalendarItem, CalendarItemType } from './Views/Calendar';
import moment from "moment";
import { App, TFile, } from "obsidian";

export interface ITimeIndex {
    getHeatForDate(date: string): number;
    getNotesCalendarItem(item: CalendarItem): TFile[];
}

export class TimeIndex implements ITimeIndex {

    app: App;

    constructor(app: App) {
        this.app = app;
    }

    getNotesCalendarItem(item: CalendarItem): TFile[] {
        const allNotes = this.app.vault.getMarkdownFiles();
        let fromTime: moment.Moment, 
            toTime: moment.Moment;

        switch (item.type) {
            case (CalendarItemType.Year):
                fromTime = moment(item.date).startOf("year");
                toTime = moment(item.date).endOf("year");
                break;
            case (CalendarItemType.Month):
                fromTime = moment(item.date).startOf("month");
                toTime = moment(item.date).endOf("month");
                break;
            case (CalendarItemType.Week):
                fromTime = moment(item.date).startOf("week");
                toTime = moment(item.date).endOf("week");
                break;
            case (CalendarItemType.Day):
                fromTime = moment(item.date).startOf("day");
                toTime = moment(item.date).endOf("day");
                break;
            default:
                console.error("Unknown Calendar Item Type!!!");
                break;
        }

        const notes = allNotes.filter(note => {
            const createdTime = moment(note.stat.ctime);
            const modifiedTime = moment(note.stat.mtime);
            return createdTime.isBetween(fromTime,toTime)
                || modifiedTime.isBetween(fromTime, toTime);
        })

        return notes;
    }

    getHeatForDate(date: string | moment.Moment): number {
        const mom = moment(date);
        return mom.date() / 31;
    }
}


export class MockTimeIndex implements ITimeIndex {
    getNotesCalendarItem(item: CalendarItem): TFile[] {

        return [];
    }


    getHeatForDate(date: string | moment.Moment): number {
        const mom = moment(date);

        return mom.date() / 31;

    }

}


