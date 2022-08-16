import moment from "moment";


export interface ITimeIndex {
	getHeatForDate(date: string): number;
}


export class MockTimeIndex implements ITimeIndex {


	getHeatForDate(date: string|moment.Moment): number {
		const mom = moment(date);

		return mom.date()/31;

	}

}
