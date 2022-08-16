import * as React from "react";

import { Calendar, CalendarSelectionMode } from "./Calendar";

export interface CalendarViewProps {
	date: moment.Moment;
}



export const CalendarContainer = (props: CalendarViewProps) => {

	const [date, setDate] = React.useState(moment());

	const handleChange = React.useCallback(
		(e) => {
			setDate(e);
		},
		[setDate],
	)


	return (
		<div className="chronology-container">
			<Calendar date={date} onChange={handleChange} mode={CalendarSelectionMode.Day} />
		</div>
	)
}
