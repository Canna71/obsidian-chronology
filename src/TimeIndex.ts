
// import { moment } from "obsidian";
import { App, TFile, moment} from "obsidian";
import { CalendarItem, CalendarItemType } from "./CalendarType";

export interface ITimeIndex {
    getHeatForDate(date: string): number;
    getNotesForCalendarItem(item: CalendarItem): TimeResult[];
}

export enum DateAttribute {
    Created,
    Modified,
    Both
}

const AttributesMatches = {
    "truefalse": DateAttribute.Created,
    "falsetrue": DateAttribute.Modified,
    "truetrue": DateAttribute.Both,
    "falsefalse": -1
}

export interface TimeResult {
    note: TFile;
    attribute: DateAttribute;
}

export class TimeIndex implements ITimeIndex {

    app: App;

    constructor(app: App) {
        this.app = app;
    }

    getNotesForCalendarItem(item: CalendarItem): TimeResult[] {
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

        const notes = allNotes.reduce<TimeResult[]>((acc,note) => {
            const createdTime = moment(note.stat.ctime);
            const modifiedTime = moment(note.stat.mtime);

            const matchCreated = createdTime.isBetween(fromTime,toTime);
            const matchModified = modifiedTime.isBetween(fromTime, toTime);
            if(matchCreated || matchModified){
                acc.push({
                    note,
                    attribute: AttributesMatches[`${matchCreated}${matchModified}`],
                });
            }
            return acc; 
        },[]);

        

        return notes;
    }

    getHeatForDate(date: string | moment.Moment): number {
        const mom = moment(date);
        return mom.date() / 31;
    }
}


export class MockTimeIndex implements ITimeIndex {
    getNotesForCalendarItem(item: CalendarItem) {

        return [];
    }


    getHeatForDate(date: string | moment.Moment): number {
        const mom = moment(date);

        return mom.date() / 31;

    }

}


