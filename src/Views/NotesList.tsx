import { PaneType, TFile } from "obsidian";
import * as  React from "react";
import { CalendarItem } from "../CalendarType";
import { NoteAttributes } from "../TimeIndex";
import { NoteView } from "./NoteView";


export const NotesList = ({ calItem, items, onOpen }:{
    calItem: CalendarItem,
    items: NoteAttributes[],
    onOpen: (note: TFile, paneType: PaneType | boolean) => void
}) => {

    return (
        <div className="chronology-noteslist-container">
            <div className="chronology-noteslist-wrapper">
            {items.map(item=>
                <NoteView key={item.note.path + item.attribute} item={item} onOpen={onOpen} extraInfo={false} />
            )}
            </div>
        </div>
    );
}

export default NotesList;
