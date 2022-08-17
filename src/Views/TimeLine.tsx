import { TFile } from "obsidian";
import * as  React from "react";
import { useCallback } from "react";

import { CalendarItem } from "../CalendarType";
import { DateAttribute, NoteAttributes } from "../TimeIndex";

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
        <div
            onClick={onClick}
            key={item.note.path}>
            {item.note.basename}({item.attribute===DateAttribute.Created?'c':'m'})
        </div>
    ) 
}


export const TimeLine = ({ calItem, items, onOpen }:
    {
        calItem: CalendarItem,
        items: NoteAttributes[],
        onOpen: (note: TFile, newLeaf: boolean) => void
    }) => {



    return (
        <div className="chronology-timeline-container">
            {items.map(item =>
                // <div className="chrono-temp-slot1">
                    <>
                   
                    <div className="chrono-temp-slot1-info">
                    &nbsp;
                    </div>
                    <div className="chrono-temp-slot1-content">
                        <NoteView key={item.note.path + item.attribute} item={item} onOpen={onOpen} />
                    </div>
                    </>

                // </div>
            )}
        </div>
    );
}


