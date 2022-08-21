
import { TFile, moment } from "obsidian";
import * as  React from "react";
import { useCallback } from "react";
import { groupBy, range } from "src/utils";

import { CalendarItem, CalendarItemType } from "../CalendarType";
import { DateAttribute, NoteAttributes } from "../TimeIndex";

function isMacOS() {
    return navigator.userAgent.indexOf("Mac") !== -1;
}

function isMetaPressed(e: MouseEvent): boolean {
    return isMacOS() ? e.metaKey : e.ctrlKey;
}

const Badge = ({ attribute, time }: { attribute: DateAttribute, time: moment.Moment }) => {


    if (attribute === DateAttribute.Created) {

        return <div className="chrono-badge chrono-created" title="Created"  ></div>
    } else {
        return <div className="chrono-badge chrono-modified" title="Modified" ></div>

    }
}

const NoteView = ({ item, onOpen }: { item: NoteAttributes, onOpen: (note: TFile, newLeaf: boolean) => void }) => {


    const onClick = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {

            onOpen(item.note, isMetaPressed(event.nativeEvent));
        }
        , [item, onOpen]);

    const time = moment(item.time);

    const desc = `${item.attribute === DateAttribute.Created ? "Created" : "Modified"} ${time.format("LLL")}`;

    return (
        <div
            data-text={desc}
            className="chrono-temp-note"
            onClick={onClick}
            key={item.note.path}>
            <span className="chrono-note-time">{time.format("LT")}</span>
            <Badge attribute={item.attribute} time={time} />
            {item.note.basename}
        </div>
    )
}

export const ExpandableNoteList = ({ items, onOpen }: {
    items: NoteAttributes[],
    onOpen: (note: TFile, newLeaf: boolean) => void
}) => {

    const [expanded, setExpanded] = React.useState(false)

    const onExpand = useCallback(() => {
        setExpanded(true);
    }, [setExpanded])

    if (items && items.length > 1 && !expanded) {
        return (
            <div className="chrono-cluster-container">
                <div className="chrono-temp-note" title="Click To Expand" onClick={onExpand}>
                    <span className="chrono-note-time">{moment(items.first()!.time).format("LT")}</span>-
                    <span className="chrono-note-time">{moment(items.last()!.time).format("LT")}</span>
                    <span className="chrono-notes-count">
                        {items.length}
                    </span>
                    <span className="chrono-notes-notes">
                        Notes
                    </span>
                    <span className="chrono-notes-ellipsis">...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="chrono-cluster-container">
            {items && items.map(item =>
                <NoteView key={item.note.path + item.attribute} item={item} onOpen={onOpen} />
            )}
        </div>
    );
}

const clusteringStrategies = {
    [CalendarItemType.Day]: {
        slots: range(0, 23).reverse().map(n => n.toString()),
        clusters: range(0, 5).reverse().map(s => (s * 10).toString()),
        slotFn: (item: NoteAttributes) => moment(item.time).hour().toString(),
        clusterFn: (item: NoteAttributes) => (Math.floor(moment(item.time).minutes() / 10) * 10).toString()
    },
    [CalendarItemType.Week]: undefined,
    [CalendarItemType.Month]: undefined,
    [CalendarItemType.Year]: undefined,

}


export const TimeLine = ({ calItem, items, onOpen }:
    {
        calItem: CalendarItem,
        items: NoteAttributes[],
        onOpen: (note: TFile, newLeaf: boolean) => void
    }) => {

    const clusterStrat = clusteringStrategies[calItem.type];
    if(!clusterStrat){
        return (
            <div></div>
        );
    }

    const slotsWithData = clusterize(items,
        clusterStrat.slots,
        clusterStrat.slotFn,
        clusterStrat.clusters,
        clusterStrat.clusterFn
    );
    console.log(slotsWithData);

    return (
        <div className="chronology-timeline-container">
            {slotsWithData.map(({ slot, clusters }, slotNmber) =>
                <div key={slot} className="chrono-temp-slot1">


                    <div className="chrono-temp-slot1-info">
                        <div className="chrono-temp-slot1-name">{slot}</div>
                    </div>
                    <div className="chrono-temp-slot1-content">
                        {clusters.map(
                            ({ cluster, items }) =>
                                <ExpandableNoteList key={cluster} items={items} onOpen={onOpen} />
                        )}
                    </div>


                </div>
            )}
        </div>
    );
}


function clusterize(items: NoteAttributes[],
    slots: string[],
    slotByFn: (item: NoteAttributes) => string,
    clusters: string[],
    clusterByFn: (item: NoteAttributes) => string
) {

    // const slotSize = "hour";
    // const numberOfClusters = 5;

    // groups items in slot of slotSize
    //TODO: generalize the slots creation, available will be:
    // hours: 0-23
    // 
    //const slots = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

    const groupedBy = groupBy(items, slotByFn);

    let slotsWithData = slots.map(slot => ({
        slot,
        items: groupedBy[slot]
    }));
    const first = slotsWithData.findIndex(item => item.items);
    const last = slotsWithData.length - slotsWithData.reverse().findIndex(item => item.items) - 1;
    slotsWithData.reverse();

    slotsWithData = slotsWithData.slice(first, last + 1);


    const slotAndClusters = slotsWithData.map(slot => {
        const items = slot.items || [];
        const clusterBy = groupBy(items, clusterByFn);

        const clusterList = clusters.map(clName => (
            {
                cluster: clName,
                items: clusterBy[clName]
            })
        );

        // let clustersWithData = clusters.map(cluster=>({
        //     cluster,
        //     items:  clusterBy[cluster]       
        // })) 
        return ({
            slot: slot.slot,
            clusters: clusterList
        })
    })

    return slotAndClusters;
}

