/* eslint-disable @typescript-eslint/no-unused-vars */
import { CalendarView, CALENDAR_VIEW } from './Views/CalendarView';
import { App, Modal, Plugin } from 'obsidian';
import { ChronologySettingTab } from 'src/ChronologySettingTab';


interface ChronologyPluginSettings {
    addRibbonIcon: boolean;
    launchOnStartup: boolean;
    use24Hours: boolean;
    avgDailyNotes: number;
    useSimpleList: boolean;
}

const DEFAULT_SETTINGS: ChronologyPluginSettings = {
    addRibbonIcon: true,
    launchOnStartup: true,
    use24Hours: true,
    avgDailyNotes: 3,
    useSimpleList: false
}

let expSettings: ChronologyPluginSettings;

export function getChronologySettings(){return expSettings;}

export default class ChronologyPlugin extends Plugin {
    settings: ChronologyPluginSettings;
    ribbonIconEl: HTMLElement | null;

    async onload() {
        await this.loadSettings();

        this.registerView(
            CALENDAR_VIEW,
            (leaf) => new CalendarView(leaf)
        );

        if(this.settings.addRibbonIcon){
            this.addIcon();
        }

        
        this.app.workspace.onLayoutReady(()=>{
            if(this.settings.launchOnStartup){
                this.activateView();
            }
        })

        this.addCommand({
            id: "show-chronology-view",
            name: "Show Sidebar",
            callback: () => this.activateView(),
          });

        
        this.addSettingTab(new ChronologySettingTab(this.app, this));


    }

    public addIcon() {
        this.removeIcon();
        this.ribbonIconEl = this.addRibbonIcon('clock', 'Open Chronology', (evt: MouseEvent) => {
            this.activateView();
        });
        this.ribbonIconEl.addClass('chronology-ribbon-class');
    }

    public removeIcon(){
        if(this.ribbonIconEl){
            this.ribbonIconEl.remove();
            this.ribbonIconEl = null;
        }
    }

    onunload() {
        // this.app.workspace.detachLeavesOfType(CALENDAR_VIEW);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        expSettings = this.settings;
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async activateView() {
        // this.app.workspace.detachLeavesOfType(CALENDAR_VIEW);

        let leaf = this.app.workspace.getLeavesOfType(CALENDAR_VIEW)[0];
        if (!leaf) {
            await this.app.workspace.getRightLeaf(false).setViewState({
                type: CALENDAR_VIEW,
                active: true
            });
            leaf = this.app.workspace.getLeavesOfType(CALENDAR_VIEW)[0];
        }


        leaf && this.app.workspace.revealLeaf(leaf);
    }
}




