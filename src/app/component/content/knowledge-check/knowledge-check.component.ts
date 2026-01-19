import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-knowledge-check',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './knowledge-check.component.html',
  styleUrls: ['./knowledge-check.component.css']
})
export class KnowledgeCheckComponent {
  id!: string;
  currentQuestionIndex = 0;
  selectedOptionId: string | null = null;
  score = 0;
  finished = false;

  quiz = {
    title: 'Knowledge Check',
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        question: 'What is Angular mainly used for?',
        correctOptionId: 'a2',
        options: [
          { id: 'a1', text: 'Database management' },
          { id: 'a2', text: 'Building web applications' },
          { id: 'a3', text: 'Operating systems' },
          { id: 'a4', text: 'Game development' }
        ]
      },
      {
        id: 'q2',
        question: 'Angular is written primarily in?',
        correctOptionId: 'b1',
        options: [
          { id: 'b1', text: 'TypeScript' },
          { id: 'b2', text: 'Python' },
          { id: 'b3', text: 'Java' },
          { id: 'b4', text: 'C++' }
        ]
      }
    ]
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  selectOption(optionId: string) {
    this.selectedOptionId = optionId;
  }

  next() {
    const question = this.quiz.questions[this.currentQuestionIndex];

    if (this.selectedOptionId === question.correctOptionId) {
      this.score++;
    }

    this.selectedOptionId = null;

    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.finished = true;
    }
  }

  get scorePercent() {
    return Math.round(
      (this.score / this.quiz.questions.length) * 100
    );
  }
}
