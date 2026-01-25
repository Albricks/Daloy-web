export interface DiaryEntry {
id: string;
date: string; // YYYY-MM-DD
budget: number;
spent: number;
saved: number; // ✅ ADD THIS
notes?: string;
createdAt: string;
updatedAt: string;
}