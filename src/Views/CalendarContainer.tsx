
import { PaneType, TFile } from "obsidian";
import * as React from "react";
import { useCallback } from "react";
import { CalendarItem, CalendarItemType } from "src/CalendarType";
import { getChronologySettings, saveChronologySettings } from "src/main";
import { SortingStrategy } from "src/TimeIndex";
import { Calendar } from "./Calendar";
import { TimeIndexContext } from "./CalendarView";
import { TimeLine } from "./TimeLine"
import NotesList from "./NotesList";
export interface CalendarContainerProps {
	date: CalendarItem;
    onOpen: (note:TFile, paneType: PaneType | boolean)=>void;
}



export const CalendarContainer = ({date, onOpen}:CalendarContainerProps) => {

	const timeIndex = React.useContext(TimeIndexContext);
	const [current, setDate] = React.useState(date);
    const [newestFirst, setNewestFirst] = React.useState(() => getChronologySettings().newestFirst ?? true);

    const notes = timeIndex.getNotesForCalendarItem(current, SortingStrategy.Mixed, newestFirst);

	const handleChange = useCallback(
		(value:CalendarItem, isDelta: boolean) => {
            setDate(current=>{
                if(isDelta){
                    return (new CalendarItem(current.date,CalendarItemType.Range,value.date));
                } else {
                    return (value);
                }
            })
		},
		[setDate],
	)

    const settings = getChronologySettings();

    const useList = settings.useSimpleList || current.type == CalendarItemType.Month || current.type == CalendarItemType.Range;

    const handleOpen = useCallback((note:TFile, paneType: PaneType | boolean)=>{
        onOpen(note, paneType);
    },[onOpen]);

    const toggleSortOrder = useCallback(() => {
        const next = !newestFirst;
        setNewestFirst(next);
        getChronologySettings().newestFirst = next;
        saveChronologySettings();
    }, [newestFirst]);

	return (
		<div className="chronology-container">
			<Calendar current={current} onChange={handleChange}  />
            <div className="chrono-notes-wrapper">
                <button
                    className="chrono-sort-toggle"
                    onClick={toggleSortOrder}
                    title={newestFirst ? "Newest first — click to show oldest first" : "Oldest first — click to show newest first"}
                    aria-label="Toggle sort order"
                >
                    {newestFirst ? "↓" : "↑"}
                </button>
                {useList ?
                <NotesList calItem={current} items={notes} onOpen={handleOpen} />
                :
                <TimeLine calItem={current} items={notes} onOpen={handleOpen} newestFirst={newestFirst} />
                }
            </div>
		</div>
	)
}
