import { getChronologySettings } from 'src/main';

import { App, TFile, moment } from "obsidian";
import { CalendarItem } from "./CalendarType";

export interface ITimeIndex {
    getHeatForDate(date: string): number;
    getNotesForCalendarItem(item: CalendarItem): NoteAttributes[];
}

export enum DateAttribute {
    Created,
    Modified,
    Both
}

export enum SortingStrategy {
    Created,
    Modified,
    Mixed
}


const LIMIT_TIME_DIFF_MS = 60 * 60 * 1000;
const HEAT_SCALE=10;
export interface NoteAttributes {
    note: TFile;
    time: number;
    attribute: DateAttribute;
}


export class TimeIndex implements ITimeIndex {

    app: App;

    constructor(app: App) {
        this.app = app;
    } 

    getNotesForCalendarItem(item: CalendarItem, sortingStrategy = SortingStrategy.Mixed, desc = true): NoteAttributes[] {
        const allNotes = this.app.vault.getMarkdownFiles();
        const { fromTime, toTime } = item.getTimeRange();
 
        let notes = allNotes.reduce<NoteAttributes[]>((acc, note) => {
            const createdTime = moment(note.stat.ctime);
            const modifiedTime = moment(note.stat.mtime);

            const matchCreated = createdTime.isBetween(fromTime, toTime);
            const matchModified = modifiedTime.isBetween(fromTime, toTime);
            const timeDiffMs = Math.abs(note.stat.mtime - note.stat.ctime);
            if (sortingStrategy === SortingStrategy.Mixed && matchCreated && matchModified && timeDiffMs > LIMIT_TIME_DIFF_MS) {
                acc.push({
                    note,
                    time: note.stat.ctime,
                    attribute: DateAttribute.Created
                });
                acc.push({
                    note,
                    time: note.stat.mtime,
                    attribute: DateAttribute.Modified
                });
                return acc;
            }

            if ((sortingStrategy === SortingStrategy.Mixed || sortingStrategy === SortingStrategy.Created)
                && matchCreated
            ) {
                acc.push({
                    note,
                    time: note.stat.ctime,
                    attribute: DateAttribute.Created
                });
                return acc;
            }
            if ((sortingStrategy === SortingStrategy.Mixed || sortingStrategy === SortingStrategy.Modified)
                && matchModified
            ) {
                acc.push({
                    note,
                    time: note.stat.mtime,
                    attribute: DateAttribute.Modified
                });
                return acc
            }

            return acc;
        }, [])

            ;

        notes = this.sortNotes(notes, sortingStrategy, desc);

        return notes;
    }

    // private getTimeRange(item: CalendarItem) {
    //     let fromTime: moment.Moment, toTime: moment.Moment;

    //     function getMomentTimeRange(period: moment.unitOfTime.StartOf) {
    //         fromTime = moment(item.date).startOf(period);
    //         toTime = moment(item.date).endOf(period);
    //         return { fromTime, toTime };
    //     }

    //     switch (item.type) {
    //         case (CalendarItemType.Year):
    //             return getMomentTimeRange("year");
    //             break;
    //         case (CalendarItemType.Month):
    //             return getMomentTimeRange("month");
    //             break;
    //         case (CalendarItemType.Week):
    //             return getMomentTimeRange("week");
    //             break;
    //         case (CalendarItemType.Day):
    //             return getMomentTimeRange("day");
    //             break;
    //         default:
    //             throw new Error("Unknown Calendar Item Type!!!");
    //             break;
    //     }

    // }

    sortNotes(items: NoteAttributes[], sortingStrategy: SortingStrategy, desc = false): NoteAttributes[] {
        const res = items.sort((a,b)=>
            (a.time-b.time)  
        )
        if(desc){
            res.reverse();
        }
        return res;
    }


    getHeatForDate(date: string | moment.Moment): number {
        const mom = moment(date);

        const items = this.getNotesForCalendarItem(new CalendarItem(mom));

        // this formula is logaritmic
        const heat = Math.log(items.length+1)/Math.log(getChronologySettings().avgDailyNotes*HEAT_SCALE);

        return heat;
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



