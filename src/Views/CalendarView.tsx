/* eslint-disable @typescript-eslint/ban-types */
import moment from "moment";
import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { ITimeIndex, MockTimeIndex, TimeIndex } from "src/TimeIndex";
import { CalendarItemType } from "./Calendar";
import { CalendarContainer } from "./CalendarContainer";
export const CALENDAR_VIEW = "chronology-calendar-view";


export const TimeIndexContext = React.createContext<ITimeIndex>(new MockTimeIndex());

export class CalendarView extends ItemView {

	root: Root;
	state= {
		date: {
			date: moment(),
			type: CalendarItemType.Day
		}
	};



	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.state = {
			date: {
				date: moment(),
				type: CalendarItemType.Day
			}
		};

	}

	getViewType() {
		return CALENDAR_VIEW;
	}

	getDisplayText() {
		return "Example view";
	}

	

	render() {
		this.root.render(
			<React.StrictMode>
				<TimeIndexContext.Provider value={new TimeIndex(this.app)}>
					<CalendarContainer {...this.state} />
				</TimeIndexContext.Provider>
			</React.StrictMode>
		);
	}

	async onOpen() {
		const { contentEl } = this;
		// contentEl.setText('Woah!');
		// this.titleEl.setText("Obsidian Janitor")	
		this.root = createRoot(contentEl/*.children[1]*/);
		this.render();
	}

	async onClose() {
		this.root.unmount();
	}
}
