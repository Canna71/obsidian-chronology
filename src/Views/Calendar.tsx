import moment from "moment";
import * as React from "react";

export interface CalendarViewProps {
	date: string;
}

/*

var weeknumber = moment("12-25-1995", "MM-DD-YYYY").week();
    
const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD hh:mm');
*/

const Week = ({ weekNumber, month }: { weekNumber: number, month: number }) => {

	const weekStart = moment().weekday(0).format("dddd");
	const firstDayOfWeek = moment().day(weekStart).week(weekNumber);
	const lastDayOfWeek = moment().day(weekStart).week(weekNumber).endOf("week");

	const weekRange = [];
	for (let i = firstDayOfWeek.clone(); i.isBefore(lastDayOfWeek); i = i.add(1, "days")) {
		weekRange.push(i.clone());
	}
	// weekRange.push(lastDayOfWeek); 

	console.log(weekRange);

	return (
		<div className="chronology-calendar-week-wrapper">
			<div>{weekNumber}</div>
			{weekRange.map(date => (
				<div key={date.dayOfYear()}>{date.date()}</div>
			))}
		</div>
	)
}

const GridCell = ({day, month}:{day: number | moment.Moment | string, month:number}) => {
	if(typeof day === "number") {
		return <div key={day}>{day}</div>
	} else if (typeof day === "string") {
		return <div key={day}>{day}</div>
	} else {
		return <div className={month===day.month()?"chronology-current-month":"chronology-other-month"} key={day.dayOfYear()}>{day.date()}</div>
	}
}

export const Calendar = ({ date }: CalendarViewProps) => {
	const weekStart = moment().weekday(0).format("dddd");
	const firstOfMonth = moment(date).startOf("month");
	const endOfMonth = moment(date).endOf("month");
	const monthName = moment(date).format("MMMM");
	const yearName = moment(date).format("YYYY");
	const month = moment(date).month();
	const startWeek = firstOfMonth.week();
	const endWeek = endOfMonth.week();
	const firstDayOGrid = moment().day(weekStart).week(startWeek);
	const lastDayOfGrid = moment().day(weekStart).week(endWeek).endOf("week");


	// const monthRange = Array.from({ length: endWeek - startWeek + 1 }, (_, i) => i + startWeek);
	const monthRange:(number | moment.Moment | string)[] = [""];
	const endofFirstFeek = firstDayOGrid.clone().endOf("week")
	for (let d=firstDayOGrid.clone();d.isBefore(endofFirstFeek);d = d.add(1, "days")){
		monthRange.push(d.format("dd"));  
	}

	for (let d = firstDayOGrid.clone(), week = startWeek, n = 0; d.isBefore(lastDayOfGrid); d = d.add(1, "days")) {
		if ((n++ % 7) === 0) monthRange.push(week++);
		monthRange.push(d.clone());
	}

	console.log(monthRange);

	return (
		<div className="chronology-calendar-box">
			<div>{monthName} {yearName}</div>
			<div className="chronology-days-grid">
				{monthRange.map((day,i) => <GridCell key={day.toString()} {...{day, month}} />
				)}
			</div>
		</div>
	)
}
