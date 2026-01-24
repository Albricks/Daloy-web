export interface ModuleQuiz {
  moduleId: string;
  title: string;
  description: string;
  passingScore: number; // percentage
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface QuizOption {
  id: string;
  text: string;
}
