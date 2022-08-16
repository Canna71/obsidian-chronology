import moment from "moment";
import * as React from "react";
import { useCallback } from "react";
import { TimeIndexContext } from "./CalendarView";


export enum CalendarSelectionMode {
	Day,
	Week,
	Month,
	Year
}
export interface CalendarViewProps {
	date: moment.Moment;
	mode: CalendarSelectionMode;
	onChange: (sel: DayOrWeek | string)=>void;
}




type DayOrWeek = number | moment.Moment;


interface CalendarCellProps {
	dayOrWeek: DayOrWeek;
	month: number;
	date: moment.Moment;
	mode: CalendarSelectionMode;
	weekNumber: number;
	onChange: (dow: DayOrWeek) => void
}

const Cell = ({ dayOrWeek, month, date, mode, onChange }: CalendarCellProps) => {

	const timeIndex = React.useContext(TimeIndexContext);

	const handleChange = useCallback(
		() => {
			onChange(dayOrWeek);
		},
		[dayOrWeek],
	)


	// let selected = false;

	if (typeof dayOrWeek === "number") {
		const classes = ["chronology-calendar-weeknumber", "chronology-calendar-selectable"]
		if (mode === CalendarSelectionMode.Week && date.week() === dayOrWeek) {
			classes.push("selected")
		}
		return <td key={`week-${dayOrWeek}`} className={classes.join(" ")} onClick={handleChange} >{dayOrWeek}</td>
	} else {
		const classes = ["chronology-calendar-day", "chronology-calendar-selectable"]
		classes.push(month === dayOrWeek.month() ? "chronology-current-month" : "chronology-other-month");

		if (dayOrWeek.isSame(moment(), "day")) classes.push("chronology-calendar-today");

		if (mode === CalendarSelectionMode.Day && dayOrWeek.isSame(date, "day")) {
			classes.push("selected")
		}

		const heatLevel = timeIndex.getHeatForDate(dayOrWeek.format("YYYY-MM-DD"));
		const percentage = Math.max(0, Math.min(Math.ceil(heatLevel * 100), 100));
		const height = `${percentage}%`;

		return (
			<td key={dayOrWeek.dayOfYear()} className={classes.join(" ")} onClick={handleChange}>
				<div className="chronology-calendar-heat-background" style={{ height }}></div>
				<span>{dayOrWeek.date()}</span>

			</td>
		)
	}

}

const Week = ({ weekNumber, month, date, mode, onChange }: CalendarCellProps) => {

	const weekStart = moment().weekday(0).format("dddd");
	const firstDayOfWeek = moment().day(weekStart).week(weekNumber);
	const lastDayOfWeek = moment().day(weekStart).week(weekNumber).endOf("week");

	const weekRange: DayOrWeek[] = [weekNumber];
	for (let i = firstDayOfWeek.clone(); i.isBefore(lastDayOfWeek); i = i.add(1, "days")) {
		weekRange.push(i.clone());
	}


	return (
		<tr className="chronology-calendar-week-row">
			{weekRange.map(d => <Cell key={d.toString()} dayOrWeek={d} month={month} date={date} mode={mode} onChange={onChange} weekNumber={weekNumber} />

			)}
		</tr>
	)
}



export const Calendar = ({ date, mode, onChange }: CalendarViewProps) => {
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

	const handleChange = useCallback((e:any)=>{
		onChange(e);
	},[onChange]);

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
					{monthRange.map(week => <Week key={week} weekNumber={week} month={month} date={date} mode={mode} dayOrWeek={0} onChange={handleChange} />)}
				</tbody>
			</table>


		</div>
	)
}
