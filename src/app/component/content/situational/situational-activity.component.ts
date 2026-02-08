import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { SituationalService } from '../../../services/situational.service';

@Component({
  selector: 'app-situational-activity',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './situational-activity.component.html',
  styleUrls: ['./situational-activity.component.css']
})
export class SituationalActivityComponent implements OnInit {

  activity: any;
  instructionText = '';
  scenarioText = '';
  minWordCount = 25;
  isRedirecting = false;
  countdown = 5;
  countdownInterval: any;

  // 🔑 MUST exist and be set
  moduleId!: string;

  form!: FormGroup;
  loading = true;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private situationalService: SituationalService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // ============================
  // INIT
  // ============================
  ngOnInit(): void {
    // 🔥 FIX: store moduleId ONCE
    this.moduleId = this.route.snapshot.paramMap.get('id')!;

    if (!this.moduleId) {
      console.error('❌ ModuleId is missing from route');
      return;
    }

    this.loadActivity(this.moduleId);
  }

  // ============================
  // LOAD ACTIVITY BY MODULE
  // ============================
  loadActivity(moduleId: string): void {
    this.situationalService.getActivityByModule(moduleId).subscribe({
      next: (res) => {
        this.activity = res;

        this.instructionText = res.instructionText;
        this.scenarioText = res.scenarioText;
        this.minWordCount = res.minWordCount;

        this.buildForm(res.questions);

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ============================
  // FORM
  // ============================
  buildForm(questions: any[]): void {
    this.form = this.fb.group({
      answers: this.fb.array(
        questions.map(q =>
          this.fb.group({
            questionId: [q.id],
            answerText: ['', Validators.required]
          })
        )
      )
    });
  }

  get answers(): FormArray {
    return this.form.get('answers') as FormArray;
  }

  asFormGroup(control: any): FormGroup {
    return control as FormGroup;
  }

  // ============================
  // VALIDATION
  // ============================
  wordCount(text: string): number {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  isValidAnswer(text: string): boolean {
    return this.wordCount(text) >= this.minWordCount;
  }

  canSubmit(): boolean {
    return this.answers.controls.every(ctrl =>
      this.isValidAnswer(ctrl.value.answerText)
    );
  }

  // ============================
  // SUBMIT
  // ============================
submit(): void {
  if (!this.canSubmit() || this.submitting) return;

  this.submitting = true;
  this.isRedirecting = true;
  this.countdown = 5;

  const payload = {
    activityId: this.activity.id,
    answers: this.answers.value
  };

  this.situationalService.submit(payload).subscribe({
    next: () => {
      this.startCountdownRedirect();
    },
    error: (err) => {
      // 🔁 Even if backend allows re-submit or update
      if (err.status === 400 || err.status === 200) {
        this.startCountdownRedirect();
        return;
      }

      // ❌ Real error
      console.error(err);
      this.submitting = false;
      this.isRedirecting = false;
    }
  });
}

startCountdownRedirect(): void {
  this.countdownInterval = setInterval(() => {
    this.countdown--;

    // 🔥 FORCE UI UPDATE
    this.cdr.detectChanges();

    if (this.countdown <= 0) {
      clearInterval(this.countdownInterval);

      this.router.navigate(
        ['/modules', 'knowledge-check', this.moduleId]
      );
    }
  }, 1000);
}
        


}
