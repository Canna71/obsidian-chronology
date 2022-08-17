/* eslint-disable @typescript-eslint/ban-types */
import { moment, TFile } from "obsidian";
import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { CalendarItemType } from "src/CalendarType";
import { ITimeIndex, MockTimeIndex, TimeIndex } from "src/TimeIndex";
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

	async openNote(note:TFile, newLeaf=false){
        const leaf = app.workspace.getLeaf(newLeaf);
        await leaf.openFile(note);
    }

	render() {
		this.root.render(
			<React.StrictMode>
				<TimeIndexContext.Provider value={new TimeIndex(this.app)}>
					<CalendarContainer onOpen={this.openNote.bind(this)} {...this.state} />
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
