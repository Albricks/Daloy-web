export interface DiaryEntry {
  id: string;          
  userId: string;
  date: string;        
  budget: number;
  spent: number;
  saved: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}