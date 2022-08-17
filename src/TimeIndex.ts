
// import { moment } from "obsidian";
import { App, TFile, moment, FileStats} from "obsidian";
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

const AttributesMatches = {
    "truefalse": DateAttribute.Created,
    "falsetrue": DateAttribute.Modified,
    "truetrue": DateAttribute.Both,
    "falsefalse": -1
}

const LIMIT_TIME_DIFF_MS = 60*60*1000;

export interface NoteAttributes {
    note: TFile;
    attribute: DateAttribute;
}

export interface NoteAttributesSorted extends NoteAttributes {
    sortedBy: DateAttribute
}

export class TimeIndex implements ITimeIndex {

    app: App;

    constructor(app: App) {
        this.app = app;
    }

    getNotesForCalendarItem(item: CalendarItem, sortingStrategy=SortingStrategy.Mixed, desc=true): NoteAttributes[] {
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

        let notes = allNotes.reduce<NoteAttributes[]>((acc,note) => {
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
        },[])
        
        ;

        notes = this.sortNotes(notes, sortingStrategy, desc);

        return notes;
    }

    sortNotes(items: NoteAttributes[], sortingStrategy:SortingStrategy, desc=false):NoteAttributesSorted[] {
        switch(sortingStrategy){
            case(SortingStrategy.Created):
                return items.sort((a,b)=>(desc ? b.note.stat.ctime-a.note.stat.ctime : a.note.stat.ctime-b.note.stat.ctime))
                        .map<NoteAttributesSorted>(item=>({...item, sortedBy: DateAttribute.Created}))
                ;
            break;
            case(SortingStrategy.Modified):
                return items.sort((a,b)=>(desc ? b.note.stat.mtime-a.note.stat.mtime : a.note.stat.mtime-b.note.stat.mtime))
                        .map<NoteAttributesSorted>(item=>({...item, sortedBy: DateAttribute.Modified}))
                ;
            break;
            case(SortingStrategy.Mixed):
                return this.sortMix(items, desc);
            break;
            default:
                console.error("Unknown sorting strategy!");
                return items;
            break
        }
    }
    sortMix(items: NoteAttributes[], desc=false): NoteAttributesSorted[] {
        // we need to duplicate notes for which creation and modification are
        // separated by a reasonable amount of time (how much??) 1 hour?

        const mixedNotes = items.reduce<any[]>((acc,item)=>{

            if(item.attribute === DateAttribute.Both){
                acc.push({item,time:item.note.stat.ctime, sortedBy:DateAttribute.Created});
                if(Math.abs(item.note.stat.mtime-item.note.stat.ctime)>LIMIT_TIME_DIFF_MS){
                    acc.push({item,time:item.note.stat.mtime, sortedBy: DateAttribute.Modified});
                }
            } else if (item.attribute === DateAttribute.Created){
                acc.push({item,time:item.note.stat.ctime, sortedBy:DateAttribute.Created});
            } else if (item.attribute === DateAttribute.Modified){
                acc.push({item,time:item.note.stat.mtime, sortedBy:DateAttribute.Modified});
            }
            return acc;
        },[]);

        mixedNotes.sort((a,b)=>desc?b.time-a.time:a.time-b.time);
        return mixedNotes.map(mn => mn.item as NoteAttributes);
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



