
import { TFile, moment, PaneType } from "obsidian";
import * as  React from "react";
import { useCallback } from "react";
import { getChronologySettings } from "src/main";
import { groupBy, range } from "src/utils";

import { CalendarItem, CalendarItemType } from "../CalendarType";
import { DateAttribute, NoteAttributes } from "../TimeIndex";
import { NoteView } from "./NoteView";


export const Badge = ({ attribute, time }: { attribute: DateAttribute, time: moment.Moment }) => {


    if (attribute === DateAttribute.Created) {

        return <div className="chrono-badge chrono-created" title="Created"  ></div>
    } else {
        return <div className="chrono-badge chrono-modified" title="Modified" ></div>

    }
}

export const ExpandableNoteList = ({ items, onOpen }: {
    items: NoteAttributes[],
    onOpen: (note: TFile, paneType: PaneType | boolean) => void
}) => {

    // TODO: configure
    const startExpanded = !getChronologySettings().groupItemsInSameSlot;

    const [expanded, setExpanded] = React.useState(startExpanded)

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
                        Elements
                    </span>
                    <span className="chrono-notes-ellipsis">...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="chrono-cluster-container">
            {items && items.map(item =>
                <NoteView key={item.note.path + item.attribute} item={item} onOpen={onOpen} extraInfo={true} />
            )}
        </div>
    );
}


function groupByHour(items: NoteAttributes[], newestFirst: boolean): { hour: string; items: NoteAttributes[] }[] {
    const use24Hours = getChronologySettings().use24Hours;
    const hourFmt = use24Hours ? "HH" : "hh A";
    const slots = range(0, 23).map(n => moment().hour(n).startOf("hour").format(hourFmt));
    const grouped = groupBy(items, item => moment(item.time).format(hourFmt));

    let result = slots.map(hour => ({ hour, items: (grouped[hour] || []) as NoteAttributes[] }));

    const first = result.findIndex(s => s.items.length > 0);
    const last = result.length - [...result].reverse().findIndex(s => s.items.length > 0) - 1;

    if (first < 0) return [];
    const sliced = result.slice(first, last + 1);
    return newestFirst ? sliced.reverse() : sliced;
}

function getWeekClusteringStrategy() {
    return {
        slots: moment.weekdaysShort(true),
        clusters: range(0, 5).reverse().map(s => (s * 4).toString()),
        slotFn: (item: NoteAttributes) => moment.weekdaysShort()[moment(item.time).day()],
        clusterFn: (item: NoteAttributes) => (Math.floor(moment(item.time).hours() / 4) * 4).toString()
    };
}


export const TimeLine = ({ calItem, items, onOpen, newestFirst }:
    {
        calItem: CalendarItem,
        items: NoteAttributes[],
        onOpen: (note: TFile, paneType: PaneType | boolean) => void,
        newestFirst: boolean
    }) => {

    if (calItem.type === CalendarItemType.Day) {
        const hourSlots = groupByHour(items, newestFirst);
        return (
            <div className="chronology-timeline-container">
                {hourSlots.map(({ hour, items: slotItems }) => {
                    const hasItems = slotItems.length > 0;
                    return (
                        <div key={hour} className={`chrono-temp-slot1${hasItems ? "" : " chrono-temp-slot1-empty"}`}>
                            <div className="chrono-temp-slot1-info">
                                <div className="chrono-temp-slot1-name">{hour}</div>
                            </div>
                            {hasItems && (
                                <div className="chrono-temp-slot1-content">
                                    {slotItems.map(item =>
                                        <NoteView key={item.note.path + item.attribute} item={item} onOpen={onOpen} extraInfo={true} />
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    if (calItem.type === CalendarItemType.Week) {
        const strat = getWeekClusteringStrategy();
        const slotsWithData = clusterize(items, strat.slots, strat.slotFn, strat.clusters, strat.clusterFn);
        return (
            <div className="chronology-timeline-container">
                {slotsWithData.map(({ slot, clusters }) => {
                    const hasItems = clusters.some(({ items }) => items && items.length > 0);
                    return (
                        <div key={slot} className={`chrono-temp-slot1${hasItems ? "" : " chrono-temp-slot1-empty"}`}>
                            <div className="chrono-temp-slot1-info">
                                <div className="chrono-temp-slot1-name">{slot}</div>
                            </div>
                            {hasItems && (
                                <div className="chrono-temp-slot1-content">
                                    {clusters.map(({ cluster, items }) =>
                                        <ExpandableNoteList key={cluster} items={items} onOpen={onOpen} />
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    return <div></div>;
}


function clusterize(items: NoteAttributes[],
    slots: string[],
    slotByFn: (item: NoteAttributes) => string,
    clusters: string[],
    clusterByFn: (item: NoteAttributes) => string
) {


    // groups items in slot of slotSize

    const groupedBy = groupBy(items, slotByFn);

    let slotsWithData = slots.map(slot => ({
        slot,
        items: groupedBy[slot]
    }));
    const first = slotsWithData.findIndex(item => item.items);
    const last = slotsWithData.length - slotsWithData.reverse().findIndex(item => item.items) - 1;
    slotsWithData.reverse();

    if(first>=0){
        slotsWithData = slotsWithData.slice(first, last + 1);
    } else {
        slotsWithData = [];
    }


    const slotAndClusters = slotsWithData.map(slot => {
        const items = slot.items || [];
        const clusterBy = groupBy(items, clusterByFn);

        const clusterList = clusters.map(clName => (
            {
                cluster: clName,
                items: clusterBy[clName]
            })
        );

        return ({
            slot: slot.slot,
            clusters: clusterList
        })
    })

    return slotAndClusters;
}

