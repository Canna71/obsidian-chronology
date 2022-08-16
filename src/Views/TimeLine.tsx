import * as  React from "react";

import { CalendarItem } from "../CalendarType";
import {  TimeResult } from "../TimeIndex";

export const TimeLine = ({calItem, notes}:
    {
        calItem:CalendarItem,
        notes: TimeResult[]
    }) => {


    return (
        <ul>
            {notes.map(note=><li key={note.note.path}>{note.note.basename}</li>)}
        </ul>
    );
}
