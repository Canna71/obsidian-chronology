import {  moment } from "obsidian";
import { getChronologySettings } from "./main";

export function myMoment() {
    // Save the original locale
    const originalLocale = moment.locale();

    const firstDayOfWeek = getChronologySettings().firstDayOfWeek;
    const obj = firstDayOfWeek>=0?
    {
        week: {
            dow: firstDayOfWeek, // Monday is the first day of the week
        }
    }
    :{};

    // Create a custom locale where Monday is the first day of the week
    moment.updateLocale('chronology-locale', obj);

    // Use the custom locale for your instance
    const myMoment = obj.week ? moment().locale('chronology-locale') : moment();

    // Switch back to the original locale
    moment.locale(originalLocale);
    return myMoment;
}