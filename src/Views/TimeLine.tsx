import { TFile } from "obsidian";
import * as  React from "react";
import { useCallback } from "react";

import { CalendarItem } from "../CalendarType";
import { NoteAttributes } from "../TimeIndex";

function isMacOS() {
    return navigator.userAgent.indexOf("Mac") !== -1;
}

function isMetaPressed(e: MouseEvent): boolean {
    return isMacOS() ? e.metaKey : e.ctrlKey;
}

const NoteView = ({ item, onOpen }: { item: NoteAttributes, onOpen: (note: TFile, newLeaf: boolean) => void }) => {


    const onClick = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {

            onOpen(item.note, isMetaPressed(event.nativeEvent));
        }
        , [item, onOpen]);



    return (
        <li
            onClick={onClick}
            key={item.note.path}>
            {item.note.basename}
        </li>
    )
}


export const TimeLine = ({ calItem, items, onOpen }:
    {
        calItem: CalendarItem,
        items: NoteAttributes[],
        onOpen: (note: TFile, newLeaf: boolean) => void
    }) => {



    return (
        <ul>
            {items.map(item =>
                <NoteView key={item.note.path} item={item} onOpen={onOpen} />
            )}
        </ul>
    );
}


