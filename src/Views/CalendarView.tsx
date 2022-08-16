/* eslint-disable @typescript-eslint/ban-types */
import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { ITimeIndex, MockTimeIndex } from "src/TimeIndex";
import { CalendarContainer } from "./CalendarContainer";
export const CALENDAR_VIEW = "chronology-calendar-view";


export const TimeIndexContext = React.createContext<ITimeIndex>(new MockTimeIndex());

export class CalendarView extends ItemView {

	root: Root;
	state: {};



	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.state = {};
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
				<TimeIndexContext.Provider value={new MockTimeIndex()}>
					<CalendarContainer date={""} {...this.state} />
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
