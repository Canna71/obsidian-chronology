import { PaneType, TFile } from "obsidian";
import * as  React from "react";
import { CalendarItem } from "../CalendarType";
import { NoteAttributes } from "../TimeIndex";
import { NoteView } from "./NoteView";


export const NotesList = ({ calItem, items, onOpen, extraInfo = false }:{
    calItem: CalendarItem,
    items: NoteAttributes[],
    onOpen: (note: TFile, paneType: PaneType | boolean) => void,
    extraInfo?: boolean
}) => {

    return (
        <div className="chronology-noteslist-container">
            <div className="chronology-noteslist-wrapper">
            {items.map(item=>
                <NoteView key={item.note.path + item.attribute} item={item} onOpen={onOpen} extraInfo={extraInfo} />
            )}
            </div>
        </div>
    );
}

export default NotesList;
