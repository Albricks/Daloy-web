import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../../services/quiz.service';
import {
  ModuleQuizDto,
  SubmitQuizDto,
  QuizResultDto
} from '../../../models/quiz.model';

@Component({
  selector: 'app-knowledge-check',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './knowledge-check.component.html',
  styleUrls: ['./knowledge-check.component.scss']
})
export class KnowledgeCheckComponent implements OnInit {
  id!: string;

  quiz!: ModuleQuizDto;

  // 🔥 Stable loading pattern (like ModulesListComponent)
  isLoading = true;
  loadError: string | null = null;

  currentQuestionIndex = 0;
  selectedOptionId: string | null = null;

  // Track answers per question
  userAnswers: Record<string, string> = {};

  finished = false;
  submitting = false;

  // Result from API
  result: QuizResultDto | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private quizService: QuizService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadQuiz();
  }

  // --------------------
  // Load quiz (STABLE)
  // --------------------
  loadQuiz() {
    this.isLoading = true;
    this.loadError = null;
    this.quiz = undefined as any;

    this.quizService.getQuizByModule(this.id).subscribe({
      next: quiz => {
        // Always reassign (change detection friendly)
        this.quiz = { ...quiz };

        // Restore selection
        const firstQ = this.quiz.questions[0];
        this.selectedOptionId =
          this.userAnswers[firstQ.questionId] || null;

        this.isLoading = false;

        // 🔥 Force UI update (prevents blank screen)
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Failed to load quiz', err);
        this.loadError = 'Failed to load quiz. Please refresh.';
        this.isLoading = false;

        this.cdr.detectChanges();
      }
    });
  }

  selectOption(optionId: string) {
    const q = this.quiz.questions[this.currentQuestionIndex];
    this.userAnswers[q.questionId] = optionId;
    this.selectedOptionId = optionId;
  }

  next() {
    if (!this.selectedOptionId) return;

    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;

      const q = this.quiz.questions[this.currentQuestionIndex];
      this.selectedOptionId =
        this.userAnswers[q.questionId] || null;

    } else {
      this.submitQuiz();
    }
  }

  submitQuiz() {
    const unanswered = this.quiz.questions
      .filter(q => !this.userAnswers[q.questionId]);

    if (unanswered.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    const payload: SubmitQuizDto = {
      quizId: this.quiz.quizId,
      answers: this.quiz.questions.map(q => ({
        questionId: q.questionId,
        selectedChoiceId: this.userAnswers[q.questionId]
      }))
    };

    this.submitting = true;

    this.quizService.submitQuiz(payload).subscribe({
      next: result => {
        this.result = { ...result };
        this.finished = true;
        this.submitting = false;

        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Failed to submit quiz', err);
        this.submitting = false;

        this.cdr.detectChanges();
      }
    });
  }

  restartQuiz() {
    this.currentQuestionIndex = 0;
    this.selectedOptionId = null;
    this.userAnswers = {};
    this.finished = false;
    this.result = null;

    const firstQ = this.quiz.questions[0];
    this.selectedOptionId = null;

    this.cdr.detectChanges();
  }

  goToNextModule() {
    this.router.navigate(['/modules']);
  }
}