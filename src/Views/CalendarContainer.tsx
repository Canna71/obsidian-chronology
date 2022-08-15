import * as React from "react";

import { Calendar } from "./Calendar";

export interface CalendarViewProps {
	date: string;
}


export const CalendarContainer = (props: CalendarViewProps) => {

		return (
			<div>
				<Calendar date={"2022-08-15"} />
			</div>
		)
}
