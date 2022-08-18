
import { TFile, moment, MomentFormatComponent } from "obsidian";
import * as  React from "react";
import { useCallback } from "react";
import { groupBy, groupByOrdered, range } from "src/utils";

import { CalendarItem } from "../CalendarType";
import { DateAttribute, NoteAttributes } from "../TimeIndex";

function isMacOS() {
    return navigator.userAgent.indexOf("Mac") !== -1;
}

function isMetaPressed(e: MouseEvent): boolean {
    return isMacOS() ? e.metaKey : e.ctrlKey;
}

const Badge = ({attribute,time}:{attribute: DateAttribute, time: moment.Moment}) => {
    if (attribute === DateAttribute.Created) {

        return <div className="chrono-badge chrono-created" title={"Created"} ></div>
    } else {
        return <div className="chrono-badge chrono-modified" title={"Modified"}></div>

    }
}

const NoteView = ({ item, onOpen }: { item: NoteAttributes, onOpen: (note: TFile, newLeaf: boolean) => void }) => {


    const onClick = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {

            onOpen(item.note, isMetaPressed(event.nativeEvent));
        }
        , [item, onOpen]);

    const time = moment(item.time);

    return (
        <div
            className="chrono-temp-note"
            onClick={onClick}
            key={item.note.path}>
            <Badge attribute={item.attribute} time={time} />{item.note.basename}
        </div>
    )
}


export const TimeLine = ({ calItem, items, onOpen }:
    {
        calItem: CalendarItem,
        items: NoteAttributes[],
        onOpen: (note: TFile, newLeaf: boolean) => void
    }) => {


    const slotsWithData = clusterize(items);
    console.log(slotsWithData);

    return (
        <div className="chronology-timeline-container">
            {slotsWithData.map(({ slot, items }, slotNmber) =>
                <div key={slot} className="chrono-temp-slot1">


                    <div className="chrono-temp-slot1-info">
                        <div className="chrono-temp-slot1-name">{slot}</div>
                    </div>
                    <div className="chrono-temp-slot1-content">
                        {items && items.map(item => (
                            <NoteView key={item.note.path + item.attribute} item={item} onOpen={onOpen} />
                        ))}
                    </div>


                </div>
            )}
        </div>
    );
}


function clusterize(items: NoteAttributes[]) {
    const slotSize = "hour";
    const numberOfClusters = 5;

    // groups items in slot of slotSize
    //TODO: generalize the slots creation, available will be:
    // hours: 0-23
    // 
    //const slots = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
    const slots = range(0, 23).reverse().map(n => n.toString());
    const groupedBy = groupBy(items, (item: NoteAttributes) => moment(item.time).hour());
    let slotsWithData = slots.map(slot => ({
        slot,
        items: groupedBy[slot]
    }));
    const first = slotsWithData.findIndex(item => item.items);
    const last = slotsWithData.length - slotsWithData.reverse().findIndex(item => item.items) - 1;
    slotsWithData.reverse();

    console.log(first);
    console.log(last);
    slotsWithData = slotsWithData.slice(first, last + 1);
    return slotsWithData;
}

