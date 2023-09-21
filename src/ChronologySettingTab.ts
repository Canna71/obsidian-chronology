
import { App, PluginSettingTab, Setting } from "obsidian";
import ChronologyPlugin from "./main";
import {moment} from "obsidian";

export class ChronologySettingTab extends PluginSettingTab {
	plugin: ChronologyPlugin;

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

        this.createToggle(containerEl, "Open on start up",
            "Opens the chronology sidebar when Obsidian starts.",
            "launchOnStartup"
        );

        this.createToggle(containerEl, "24 hours display",
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
        this.createToggle(containerEl, "Display Simple List",
            "Prefers a List of notes, for day and week view",
            "useSimpleList"
        );

        // const currentLocale = moment().locale()
        const localeFDOW = moment().localeData().firstDayOfWeek()
        const weekDays = moment().localeData().weekdays()

        this.createToggle(containerEl, "Group Notes in same time slot",
        "Group notes in same time slot in the timeline view",
        "groupItemsInSameSlot"
        );
        new Setting(this.containerEl)
            .setName("First Day of the Week")
            .setDesc(`Default will use the one from your locale (${weekDays[localeFDOW]}). A plugin restart is required.`)
            
            .addDropdown(dd=>{
                
                dd.addOption('-1', 'Default');
                dd.addOption('6', weekDays[6]); // Saturday
                dd.addOption('0', weekDays[0]); // Sunday
                dd.addOption('1', weekDays[1]); // Monday

                dd.setValue(this.plugin.settings.firstDayOfWeek.toString())
                dd.onChange(async (value) =>	{
                    this.plugin.settings.firstDayOfWeek = parseInt(value);
                    await this.plugin.saveSettings();
                })
                
                
            })

        // add setting for creation date attribute
        new Setting(this.containerEl)
            .setName("Creation Date Attribute")
            .setDesc("The name of the metadata attribute to use for creation date")
            .addText(cb=>{
                cb
                .setValue(this.plugin.settings.creationDateAttribute || "")
                .onChange(async (value)=>{
                    this.plugin.settings.creationDateAttribute = value;
                    await this.plugin.saveSettings();
                    // this.display();
                })
            })

        // add setting for modified date attribute
        new Setting(this.containerEl)
            .setName("Modified Date Attribute")
            .setDesc("The name of the metadata attribute to use for modified date")
            .addText(cb=>{
                cb
                .setValue(this.plugin.settings.modifiedDateAttribute || "")
                .onChange(async (value)=>{
                    this.plugin.settings.modifiedDateAttribute = value;
                    await this.plugin.saveSettings();
                    // this.display();
                })
            })

    
	}


    private createToggle(containerEl: HTMLElement, name: string, desc: string, prop: string) {
		new Setting(containerEl)
			.setName(name)
			.setDesc(desc)
			.addToggle(bool => bool
				.setValue((this.plugin.settings as any)[prop] as boolean)
				.onChange(async (value) => {
					(this.plugin.settings as any)[prop] = value;
					await this.plugin.saveSettings();
					this.display();
				})
			);
	}
}
