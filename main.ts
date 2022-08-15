import { CalendarView, CALENDAR_VIEW } from './src/Views/CalendarView';
import { App, Editor, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
import { ChronologySettingTab } from 'src/ChronologySettingTab';

// Remember to rename these classes and interfaces!

interface ChronologyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ChronologyPluginSettings = {
	mySetting: 'default'
}

export default class ChronologyPlugin extends Plugin {
	settings: ChronologyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(
			CALENDAR_VIEW,
			(leaf) => new CalendarView(leaf)
		);

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Calendar View', (evt: MouseEvent) => {
			this.activateView();
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');


	}

	onunload() {
		this.app.workspace.detachLeavesOfType(CALENDAR_VIEW);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(CALENDAR_VIEW);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: CALENDAR_VIEW,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(CALENDAR_VIEW)[0]
		);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}


