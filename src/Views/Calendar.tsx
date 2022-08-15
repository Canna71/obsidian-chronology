import * as React from "react";

export interface CalendarViewProps {
	date: string;
}


export const Calendar = (props: CalendarViewProps) => {



		return (
			<div>
				Cal {props.date}
			</div>
		)
}
