
import * as React from "react";

import { Calendar, CalendarItem } from "./Calendar";

export interface CalendarContainerProps {
	date: CalendarItem;
}



export const CalendarContainer = ({date}:CalendarContainerProps) => {


	const [current, setDate] = React.useState(date);

	const handleChange = React.useCallback(
		(value:CalendarItem) => {
			setDate(value);
		},
		[setDate],
	)


	return (
		<div className="chronology-container">
			<Calendar current={current} onChange={handleChange}  />
		</div>
	)
}
