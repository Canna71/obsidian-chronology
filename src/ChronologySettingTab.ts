
import { App, PluginSettingTab, Setting } from "obsidian";
import ChronologyPlugin from "./main";

class UtilsChronologySettingTab {
    createToggle(tab: ChronologySettingTab, containerEl: HTMLElement, name: string, desc: string, prop: string){
        
		new Setting(containerEl)
			.setName(name)
			.setDesc(desc)
			.addToggle(bool => bool
				.setValue((tab.plugin.settings as any)[prop] as boolean)
				.onChange(async (value) => {
					(tab.plugin.settings as any)[prop] = value;
					await tab.plugin.saveSettings();
					tab.display();
				})
			);
    }
}

export class ChronologySettingTab extends PluginSettingTab {
	plugin: ChronologyPlugin;

    utils = new UtilsChronologySettingTab();

	constructor(app: App, plugin: ChronologyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Chronology Settings'});

		

        new Setting(containerEl)
			.setName("Add Ribbon Icon")
			.setDesc("Adds an icon to the ribbon to open sidebar")
			.addToggle(bool => bool
				.setValue(this.plugin.settings.addRibbonIcon)
				.onChange(async (value) => {
					this.plugin.settings.addRibbonIcon = value;
					await this.plugin.saveSettings();
                    if(value){
                        this.plugin.addIcon();
                    } else {
                        this.plugin.removeIcon();
                    }
					this.display();
				})
			);

        this.utils.createToggle(this, containerEl, "Open on start up",
            "Opens the chronology sidebar when Obsidian starts.",
            "launchOnStartup"
        );

        this.utils.createToggle(this, containerEl, "24 hours display",
            "Uses 24 hours display mode in timeline",
            "use24Hours"
        );

        new Setting(this.containerEl)
            .setName("Average Daily Notes")
            .setDesc("Used to display the daily indicator in the calendar")
            .addText(cb=>{
                cb
                .setValue(this.plugin.settings.avgDailyNotes ? this.plugin.settings.avgDailyNotes.toString() : "")
                .onChange(async (value)=>{
                    this.plugin.settings.avgDailyNotes = Number(value);
                    await this.plugin.saveSettings();
					// this.display();
                })
                
            })

        this.utils.createToggle(this, containerEl, "Display Simple List",
            "Prefers a List of notes, for day and week view",
            "useSimpleList"
        );

        this.utils.createToggle(this, containerEl, "Group Notes in same time slot",
            "Group notes in same time slot in the timeline view",
            "groupItemsInSameSlot"
        );
	}


    
}


export { UtilsChronologySettingTab };