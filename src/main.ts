/* eslint-disable @typescript-eslint/no-unused-vars */
import { CalendarView, CALENDAR_VIEW } from './Views/CalendarView';
import { App, Modal, Plugin } from 'obsidian';
import { ChronologySettingTab } from 'src/ChronologySettingTab';

// Remember to rename these classes and interfaces!

interface ChronologyPluginSettings {
    addRibbonIcon: boolean;
    launchOnStartup: boolean;
    use24Hours: boolean;
    avgDailyNotes: number;
}

const DEFAULT_SETTINGS: ChronologyPluginSettings = {
    addRibbonIcon: true,
    launchOnStartup: true,
    use24Hours: true,
    avgDailyNotes: 3
}

let expSettings: ChronologyPluginSettings;

export function getChronologySettings(){return expSettings;}

export default class ChronologyPlugin extends Plugin {
    settings: ChronologyPluginSettings;

    async onload() {
        await this.loadSettings();

        this.registerView(
            CALENDAR_VIEW,
            (leaf) => new CalendarView(leaf)
        );

        if(this.settings.addRibbonIcon){
            const ribbonIconEl = this.addRibbonIcon('clock', 'Open Chronology', (evt: MouseEvent) => {
                this.activateView();
            });
            ribbonIconEl.addClass('my-plugin-ribbon-class');
        }
        // Perform additional things with the ribbon

        
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


        // if (this.app.workspace.layoutReady) {
        //     this.activateView();
        // } else {
        //     this.registerEvent(
        //         this.app.workspace.on('something',
        //             () => {
        //                 console.log('something');
        //                 this.activateView();
        //             }
        //         )
        //     );
        // }


    }

    onunload() {
        this.app.workspace.detachLeavesOfType(CALENDAR_VIEW);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
        expSettings = this.settings;
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async activateView() {
        this.app.workspace.detachLeavesOfType(CALENDAR_VIEW);

        await this.app.workspace.getRightLeaf(false).setViewState({
            type: CALENDAR_VIEW,
            active: true
        }, {
            settings: this.settings
        });

        this.app.workspace.revealLeaf(
            this.app.workspace.getLeavesOfType(CALENDAR_VIEW)[0]
        );
    }
}




