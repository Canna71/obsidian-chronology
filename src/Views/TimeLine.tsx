import { TFile } from "obsidian";
import * as  React from "react";
import { useCallback } from "react";

import { CalendarItem } from "../CalendarType";
import { TimeResult } from "../TimeIndex";



export const TimeLine = ({ calItem, items, onOpen }:
    {
        calItem: CalendarItem,
        items: TimeResult[],
        onOpen: (note: TFile, newLeaf:boolean) => void
    }) => {

    console.log(items);

    // const onClick = useCallback(
    //     (note: TFile) => {
    //         console.log("lambda: ", note);
    //         return useCallback(() => {
    //             console.log("onclick")
    //             onOpen(note);
    //         }, [note, onOpen]);
    //     }
    //     ,[onOpen]);

    const onClick = (note:TFile)=>{
        return (
            (event:React.MouseEvent<HTMLElement>)=>{
                console.log(event)
                onOpen(note, event.metaKey||event.ctrlKey);
            }
        )
    
    }

    return (
        <ul>
            {items.map(item => 
                <li 
                    onClick={onClick(item.note)} 
                    key={item.note.path}>
                        {item.note.basename}
                </li>)}
        </ul>
    );
}


