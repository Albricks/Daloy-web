import {
  Component,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ViewMode = 'daily' | 'weekly' | 'monthly';

export interface DiaryEntry {
  id: string;
  date: string; // ISO date
  budget: number;
  spent: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})
export class DiaryComponent {

  // 🔥 Stable loading pattern (future API-ready)
  isLoading = false;
  loadError: string | null = null;

  viewMode: ViewMode = 'daily';

  entries: DiaryEntry[] = [
    {
      id: '1',
      date: '2026-01-01',
      budget: 100,
      spent: 80,
      notes: 'Bought groceries',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      date: '2026-01-02',
      budget: 120,
      spent: 90,
      notes: 'Lunch with friends',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  /* Slide-in panel state */
  isPanelOpen = false;
  selectedEntry: DiaryEntry | null = null;

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  /* ============================
     Computed totals
  ============================ */
  get totalBudget() {
    return this.entries.reduce((sum, e) => sum + e.budget, 0);
  }

  get totalSpent() {
    return this.entries.reduce((sum, e) => sum + e.spent, 0);
  }

  get totalSaved() {
    return this.totalBudget - this.totalSpent;
  }

  /* ============================
     View toggle
  ============================ */
  setView(mode: ViewMode) {
    this.viewMode = mode;
    this.cdr.detectChanges();
  }

  /* ============================
     Add / Edit
  ============================ */
  openAddEntry() {
    const event = new CustomEvent('close-profile-menu');
    window.dispatchEvent(event);

    const today = new Date().toISOString().split('T')[0];
    const existing = this.entries.find(e => e.date === today);

    this.selectedEntry = existing
      ? { ...existing }
      : {
          id: '',
          date: today,
          budget: 0,
          spent: 0,
          notes: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

    this.isPanelOpen = true;
    this.cdr.detectChanges();
  }

  openEditEntry(entry: DiaryEntry) {
    this.selectedEntry = { ...entry };
    this.isPanelOpen = true;
    this.cdr.detectChanges();
  }

  closePanel() {
    this.isPanelOpen = false;
    this.selectedEntry = null;
    this.cdr.detectChanges();
  }

  saveEntry() {
    if (!this.selectedEntry) return;

    this.isLoading = true;

    const index = this.entries.findIndex(
      e => e.date === this.selectedEntry!.date
    );

    if (index > -1) {
      // Update (reassign array for change detection)
      const updated = {
        ...this.selectedEntry,
        updatedAt: new Date().toISOString()
      };

      this.entries = this.entries.map((e, i) =>
        i === index ? updated : e
      );

    } else {
      // Create (prepend new entry)
      const created: DiaryEntry = {
        ...this.selectedEntry,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.entries = [created, ...this.entries];
    }

    this.isLoading = false;
    this.closePanel();

    // 🔥 Force UI update
    this.cdr.detectChanges();
  }

  deleteEntry() {
    if (!this.selectedEntry) return;

    this.isLoading = true;

    // Reassign array (change detection friendly)
    this.entries = this.entries.filter(
      e => e.id !== this.selectedEntry!.id
    );

    this.isLoading = false;
    this.closePanel();

    this.cdr.detectChanges();
  }
}