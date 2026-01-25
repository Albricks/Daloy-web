import {
  Component,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiaryApiService, DiarySummary } from '../../../services/diary-api.service';

type ViewMode = 'daily' | 'weekly' | 'monthly';

export interface DiaryEntry {
  id: string;
  date: string;
  budget: number;
  spent: number;
  saved: number;
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
export class DiaryComponent implements OnInit {

  isLoading = false;
  loadError: string | null = null;

  viewMode: ViewMode = 'daily';

  entries: DiaryEntry[] = [];

  // 🔥 Server-side summaries
  weeklySummary: DiarySummary | null = null;
  monthlySummary: DiarySummary | null = null;

  isPanelOpen = false;
  selectedEntry: DiaryEntry | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private diaryApi: DiaryApiService
  ) {}

  // ============================
  // INIT
  // ============================
  ngOnInit() {
    this.loadEntries();
    this.loadSummaries();
  }

  loadEntries() {
    this.isLoading = true;
    this.loadError = null;

    this.diaryApi.getAll().subscribe({
      next: (res) => {
        this.entries = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadError = 'Failed to load diary entries';
        this.isLoading = false;
      }
    });
  }

  loadSummaries() {
    this.diaryApi.getWeeklySummary().subscribe(res => {
      this.weeklySummary = res;
      this.cdr.detectChanges();
    });

    this.diaryApi.getMonthlySummary().subscribe(res => {
      this.monthlySummary = res;
      this.cdr.detectChanges();
    });
  }

  /* ============================
     Totals (daily = from entries)
  ============================ */
  get totalBudget() {
    return this.entries.reduce((sum, e) => sum + e.budget, 0);
  }

  get totalSpent() {
    return this.entries.reduce((sum, e) => sum + e.spent, 0);
  }

  get totalSaved() {
    return this.entries.reduce((sum, e) => sum + e.saved, 0);
  }

  /* ============================
     View toggle
  ============================ */
  setView(mode: ViewMode) {
    this.viewMode = mode;
    this.cdr.detectChanges();
  }

  /* ============================
     Export CSV
  ============================ */
  exportCsv() {
    this.diaryApi.exportCsv().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'budget-diary.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
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
          saved: 0,
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

    this.diaryApi.upsert({
      entryDate: this.selectedEntry.date,
      budget: this.selectedEntry.budget,
      spent: this.selectedEntry.spent,
      notes: this.selectedEntry.notes
    }).subscribe({
      next: () => {
        this.loadEntries();
        this.loadSummaries();
        this.closePanel();
      },
      error: (err) => {
        this.isLoading = false;
        alert(err?.error || 'Failed to save entry');
      }
    });
  }

  deleteEntry() {
    if (!this.selectedEntry?.id) return;

    this.isLoading = true;

    this.diaryApi.delete(this.selectedEntry.id).subscribe({
      next: () => {
        this.loadEntries();
        this.loadSummaries();
        this.closePanel();
      },
      error: () => {
        this.isLoading = false;
        alert('Failed to delete entry');
      }
    });
  }
}