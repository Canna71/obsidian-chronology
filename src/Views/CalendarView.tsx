/* eslint-disable @typescript-eslint/ban-types */
import { debounce, PaneType, TFile } from "obsidian";
import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { CalendarItem } from "src/CalendarType";
import { ITimeIndex, MockTimeIndex, TimeIndex } from "src/TimeIndex";
import { CalendarContainer } from "./CalendarContainer";
import { myMoment } from "src/myMoment";
export const CALENDAR_VIEW = "chronology-calendar-view";


export const TimeIndexContext = React.createContext<ITimeIndex>(new MockTimeIndex());

export class CalendarView extends ItemView {

    root: Root;
    state = {
        date: new CalendarItem(myMoment())
    };


    constructor(leaf: WorkspaceLeaf) {
        super(leaf);

        

        this.state = {
            date: new CalendarItem(myMoment())
        };
        this.icon = "clock";
    }



    getViewType() {
        return CALENDAR_VIEW;
    }

    getDisplayText() {
        return "Chronology";
    }

    async openNote(note: TFile, paneType: PaneType | boolean = false) {
        const leaf = app.workspace.getLeaf(paneType);
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

    onVaultChanged = debounce((file: TFile) => {
        this.state = { ...this.state };
        this.render();
    }, 300);

    async onOpen() {
        const { contentEl } = this;
        this.root = createRoot(contentEl/*.children[1]*/);
        this.render();
        this.app.vault.on("modify", this.onVaultChanged);
        this.app.vault.on("create", this.onVaultChanged);
        this.app.vault.on("delete", this.onVaultChanged);
        this.app.vault.on("rename", this.onVaultChanged);

    }

    async onClose() {
        this.app.vault.off("modify", this.onVaultChanged);
        this.app.vault.off("create", this.onVaultChanged);
        this.app.vault.off("delete", this.onVaultChanged);
        this.app.vault.off("rename", this.onVaultChanged);
        this.root.unmount();
    }
}
