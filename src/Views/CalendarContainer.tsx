
import { PaneType, TFile } from "obsidian";
import * as React from "react";
import { useCallback } from "react";
import { CalendarItem } from "src/CalendarType";
import { getChronologySettings } from "src/main";
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
    
    const notes = timeIndex.getNotesForCalendarItem(current);

	const handleChange = useCallback(
		(value:CalendarItem) => {
			setDate(value);
		},
		[setDate],
	)

    const settings = getChronologySettings();
    
    const useList = !settings.useTimeline;

    const handleOpen = useCallback((note:TFile, paneType: PaneType | boolean)=>{
        onOpen(note, paneType);
    },[onOpen]);

	return (
		<div className="chronology-container">
			<Calendar current={current} onChange={handleChange}  />

            {useList ?
            <NotesList calItem={current} items={notes} onOpen={handleOpen} />
            :
            <TimeLine calItem={current} items={notes} onOpen={handleOpen} />
        }
            

		</div>
	)
}
