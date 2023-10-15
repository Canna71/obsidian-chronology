import { getChronologySettings } from 'src/main';

import { App, TFile, moment } from "obsidian";
import { CalendarItem, CalendarItemType } from "./CalendarType";

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

    index?: Map<string, NoteAttributes[]>;

    constructor(app: App) {
        this.app = app;
    } 

    resetCache(){
        this.index = undefined;
    }

    getNotesForCalendarItem(item: CalendarItem, sortingStrategy = SortingStrategy.Mixed, desc = true): NoteAttributes[] {
        const allNotes = this.app.vault.getMarkdownFiles();
        const { fromTime, toTime } = item.getTimeRange();
        const rebuildCache = !this.index;
        if (!this.index) {
            this.index = new Map<string, NoteAttributes[]>();
        } else {
            if (item.type === CalendarItemType.Day) {
                const day = item.date.format("YYYY-MM-DD");
                if (this.index.has(day)) {
                    return this.index.get(day) as NoteAttributes[];
                }
            }
        }
 
        let notes = allNotes.reduce<NoteAttributes[]>((acc, note) => {
            let createdTime = moment(note.stat.ctime);
            let modifiedTime = moment(note.stat.mtime);
            const creationStr = getChronologySettings().creationDateAttribute;
            const modifiedStr = getChronologySettings().modifiedDateAttribute;
            if(creationStr || modifiedStr ){
                const md = app.metadataCache.getFileCache(note);
                if(md?.frontmatter){
                    if(creationStr){
                        const ctime = md.frontmatter[creationStr];
                        if(ctime){
                            createdTime = moment(ctime);
                        }
                    }
                    if(modifiedStr){
                        const mtime = md.frontmatter[modifiedStr];
                        if(mtime){
                            modifiedTime = moment(mtime);
                        }
                    }
                }
            }

            

            const matchCreated = createdTime.isBetween(fromTime, toTime);
            const matchModified = modifiedTime.isBetween(fromTime, toTime);
            // use momentjs to find the time difference between createdTime and modifiedTime
            const timeDiffMs = moment.duration(modifiedTime.diff(createdTime)).asMilliseconds();

            // gets the createdTime as a number
            const ctime = createdTime.valueOf();
            const mtime = modifiedTime.valueOf();

            const createdInfo = {
                note,
                time: ctime,
                attribute: DateAttribute.Created
            };
            const modifiedInfo = {
                note,
                time: mtime,
                attribute: DateAttribute.Modified
            };

            if(rebuildCache && this.index){
                // stores the note in the cache with an entry 
                // for each day it was modified or created
                const createdDate = createdTime.format("YYYY-MM-DD");
                const modifiedDate = modifiedTime.format("YYYY-MM-DD");
                if(!this.index.has(createdDate)){
                    this.index.set(createdDate, []);
                }
                if(!this.index.has(modifiedDate)){
                    this.index.set(modifiedDate, []);
                }
                
                if(sortingStrategy === SortingStrategy.Mixed
                    ||
                    sortingStrategy === SortingStrategy.Created    
                ) {
                    this.index.get(createdDate)!.push(createdInfo);
                }
                if(sortingStrategy === SortingStrategy.Mixed
                    ||
                    sortingStrategy === SortingStrategy.Modified    
                ) {
                    this.index.get(modifiedDate)!.push(modifiedInfo);
                }
                
            }

            if (sortingStrategy === SortingStrategy.Mixed && matchCreated && matchModified && timeDiffMs > LIMIT_TIME_DIFF_MS) {
                acc.push(createdInfo);
                acc.push(modifiedInfo);
                return acc;
            }

            if ((sortingStrategy === SortingStrategy.Mixed || sortingStrategy === SortingStrategy.Created)
                && matchCreated
            ) {
                acc.push(createdInfo);
                return acc;
            }
            if ((sortingStrategy === SortingStrategy.Mixed || sortingStrategy === SortingStrategy.Modified)
                && matchModified
            ) {
                acc.push(modifiedInfo);
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



