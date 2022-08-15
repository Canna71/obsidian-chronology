import { ItemView, WorkspaceLeaf } from "obsidian";

export const CALENDAR_VIEW = "chronology-calendar-view";

export class CalendarView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return CALENDAR_VIEW;
  }

  getDisplayText() {
    return "Example view";
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.createEl("h4", { text: "Calendar view" });
  }

  async onClose() {
    // Nothing to clean up.
  }
}
