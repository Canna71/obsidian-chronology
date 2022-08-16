
import * as React from "react";
import { Calendar, CalendarItem } from "./Calendar";
import { TimeIndexContext } from "./CalendarView";

export interface CalendarContainerProps {
	date: CalendarItem;
}



export const CalendarContainer = ({date}:CalendarContainerProps) => { 

	const timeIndex = React.useContext(TimeIndexContext);
	const [current, setDate] = React.useState(date);

    
    const notes = timeIndex.getNotesForCalendarItem(current);

	const handleChange = React.useCallback(
		(value:CalendarItem) => {
			setDate(value);
		},
		[setDate],
	)

	return (
		<div className="chronology-container">
			<Calendar current={current} onChange={handleChange}  />

            <ul>
                {notes.map(note=><li key={note.note.path}>{note.note.basename}</li>)}
            </ul>

		</div>
	)
}
