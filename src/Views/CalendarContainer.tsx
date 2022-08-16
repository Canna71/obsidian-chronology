
import * as React from "react";
import { CalendarItem } from "src/CalendarType";
import { Calendar } from "./Calendar";
import { TimeIndexContext } from "./CalendarView";
import { TimeLine } from "./TimeLine"
export interface CalendarContainerProps {
	date: CalendarItem;
}



export const CalendarContainer = ({date}:CalendarContainerProps) => { 

	const timeIndex = React.useContext(TimeIndexContext);
	const [current, setDate] = React.useState(date);
    
    const notes = timeIndex.getNotesForCalendarItem(current);

	const handleChange = React.useCallback(
		(value:CalendarItem) => {
            console.log("onchange")
			setDate(value);
		},
		[setDate],
	)

	return (
		<div className="chronology-container">
			<Calendar current={current} onChange={handleChange}  />

            <TimeLine calItem={current} notes={notes} />

		</div>
	)
}
