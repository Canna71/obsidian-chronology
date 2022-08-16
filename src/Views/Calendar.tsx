import moment from "moment";
import * as React from "react";
import { TimeIndexContext } from "./CalendarView";

export interface CalendarViewProps {
	date: string;
}



/*

var weeknumber = moment("12-25-1995", "MM-DD-YYYY").week();
    
const startOfMonth = moment().startOf('month').format('YYYY-MM-DD hh:mm');
const endOfMonth   = moment().endOf('month').format('YYYY-MM-DD hh:mm');
*/

type WeekOrDay = number | moment.Moment;

const Cell = ({ data: weekOrDay, month }: { data: WeekOrDay, month: number }) => {

	const timeIndex = React.useContext(TimeIndexContext)


	if (typeof weekOrDay === "number") {
		return <td key={`week-${weekOrDay}`} className="chronology-calendar-weeknumber chronology-calendar-selectable">{weekOrDay}</td>
	} else {
		const classes = ["chronology-calendar-day", "chronology-calendar-selectable"]
		classes.push(month === weekOrDay.month() ? "chronology-current-month" : "chronology-other-month");
		if (weekOrDay.isSame(moment(), "day")) classes.push("chronology-calendar-today");

		const heatLevel = timeIndex.getHeatForDate(weekOrDay.format("YYYY-MM-DD"));
		const percentage = Math.max(0, Math.min(Math.ceil(heatLevel * 100), 100));
		const height = `${percentage}%`;

		return (
			<td key={weekOrDay.dayOfYear()} className={classes.join(" ")}>
				<div className="chronology-calendar-heat-background" style={{ height }}></div>
				<span>{weekOrDay.date()}</span>

			</td>
		)
	}

}

const Week = ({ weekNumber, month }: { weekNumber: number, month: number }) => {

	const weekStart = moment().weekday(0).format("dddd");
	const firstDayOfWeek = moment().day(weekStart).week(weekNumber);
	const lastDayOfWeek = moment().day(weekStart).week(weekNumber).endOf("week");

	const weekRange: WeekOrDay[] = [weekNumber];
	for (let i = firstDayOfWeek.clone(); i.isBefore(lastDayOfWeek); i = i.add(1, "days")) {
		weekRange.push(i.clone());
	}
	// weekRange.push(lastDayOfWeek); 

	// console.log(weekRange);

	return (
		<tr className="chronology-calendar-week-row">
			{weekRange.map((date, i) => <Cell key={date.toString()} data={date} month={month} />

			)}
		</tr>
	)
}

// const GridCell = ({ day, month }: { day: number | moment.Moment | string, month: number }) => {
// 	if (typeof day === "number") {
// 		return <div key={day}>{day}</div>
// 	} else if (typeof day === "string") {
// 		return <div key={day}>{day}</div>
// 	} else {
// 		const classes = [".chronology-calendar-day"]
// 		classes.push(month === day.month() ? "chronology-current-month" : "chronology-other-month");
// 		if (day.isSame(moment(), "day")) classes.push("chronology-calendar-today");
// 		return <div className={classes.join(" ")} key={day.dayOfYear()}>{day.date()}</div>
// 	}
// }

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
	// const lastDayOfGrid = moment().day(weekStart).week(endWeek).endOf("week");

	const daysOfTheWeek = [""];
	const endofFirstFeek = firstDayOGrid.clone().endOf("week")
	for (let d = firstDayOGrid.clone(); d.isBefore(endofFirstFeek); d = d.add(1, "days")) {
		daysOfTheWeek.push(d.format("dd"));
	}

	const monthRange = Array.from({ length: endWeek - startWeek + 1 }, (_, i) => i + startWeek);

	// This is the version with one item per cell:

	// const monthRange:(number | moment.Moment | string)[] = [""];
	// const endofFirstFeek = firstDayOGrid.clone().endOf("week")
	// for (let d=firstDayOGrid.clone();d.isBefore(endofFirstFeek);d = d.add(1, "days")){
	// 	monthRange.push(d.format("dd"));  
	// }

	// for (let d = firstDayOGrid.clone(), week = startWeek, n = 0; d.isBefore(lastDayOfGrid); d = d.add(1, "days")) {
	// 	if ((n++ % 7) === 0) monthRange.push(week++);
	// 	monthRange.push(d.clone());
	// }

	// console.log(monthRange);

	return (
		<div className="chronology-calendar-box">
			<table className="chronology-calendar-grid">

				<thead>
					<tr>
						<th colSpan={8}>
							<span className="chronology-calendar-selectable">
								{monthName}
							</span>
							<span className="chronology-calendar-selectable">
								{yearName}
							</span>
						</th>
					</tr>
					<tr>
						{daysOfTheWeek.map(dow => <th className="chronology-grid-dayofweek" key={dow} >{dow}</th>)}
					</tr>
				</thead>
				<tbody>
					{monthRange.map(week => <Week key={week} weekNumber={week} month={month} />)}
				</tbody>
			</table>

			{/* <div className="chronology-days-grid">
				{monthRange.map((day,i) => <div  key={day.toString()}  className="chronology-days-gridcell"><GridCell{...{day, month}} /></div>
				)}
			</div> */}
		</div>
	)
}
