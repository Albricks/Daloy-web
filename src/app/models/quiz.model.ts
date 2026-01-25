export interface ModuleQuizDto {
  quizId: string;
  moduleId: string;
  title: string;
  questions: QuizQuestionDto[];
}

export interface QuizQuestionDto {
  questionId: string;
  questionText: string;
  order: number;
  choices: QuizChoiceDto[];
}

export interface QuizChoiceDto {
  choiceId: string;
  label: string;   // A, B, C, D
  text: string;
}

export interface SubmitQuizDto {
  quizId: string;
  answers: SubmitQuizAnswerDto[];
}

export interface SubmitQuizAnswerDto {
  questionId: string;
  selectedChoiceId: string;
}

export interface QuizResultDto {
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
}