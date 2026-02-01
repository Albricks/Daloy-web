import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ModulesService } from '../../../services/modules.service';
import { ProgressService } from '../../../services/progress.service';
import { LessonDto } from '../../../models/lesson.model';

@Component({
  selector: 'app-module-read',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './module-read.component.html',
  styleUrls: ['./module-read.component.css']
})
export class ModuleReadComponent implements OnInit, OnDestroy {

  moduleId!: string;

  lessons: LessonDto[] = [];
  currentLesson?: LessonDto;
  lessonHtml = '';

  isLoading = true;

  // --------------------
  // Progress tracking
  // --------------------
  private lessonStartTime?: number; // timestamp
  private timeSpentSeconds = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modulesService: ModulesService,
    private progressService: ProgressService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        console.error('NO MODULE ID IN ROUTE');
        return;
      }

      this.moduleId = id;
      this.resetState();
      this.loadLessons();
    });
  }

  ngOnDestroy() {
    // Final save if user leaves mid-lesson
    this.saveLessonProgress(false);
  }

  // --------------------
  // Reset state on nav
  // --------------------
  resetState() {
    this.lessons = [];
    this.currentLesson = undefined;
    this.lessonHtml = '';
    this.isLoading = true;

    this.lessonStartTime = undefined;
    this.timeSpentSeconds = 0;

    this.cdr.detectChanges();
  }

  // --------------------
  // Load lessons list
  // --------------------
  loadLessons() {
    this.isLoading = true;

    this.modulesService.getLessons(this.moduleId).subscribe({
      next: lessons => {
        this.lessons = [...lessons];
        this.currentLesson = this.lessons[0]; // default to first

        this.cdr.detectChanges();
        this.loadLessonContent();
      },
      error: err => {
        console.error('Failed to load lessons', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --------------------
  // Load lesson HTML
  // --------------------
  loadLessonContent() {
    if (!this.currentLesson) return;

    // ⏱ start timing
    this.lessonStartTime = Date.now();
    this.timeSpentSeconds = 0;

    this.isLoading = true;
    this.lessonHtml = '';

    this.modulesService
      .getLessonHtml(this.currentLesson.contentUrl)
      .subscribe({
        next: html => {
          const contentUrl = this.currentLesson!.contentUrl;
          const containerSas = this.currentLesson!.containerSas;

          const basePath = contentUrl
            .split('?')[0]
            .split('/')
            .slice(0, -1)
            .join('/');

          this.lessonHtml = html.replace(
            /<img\s+[^>]*src="([^":]+)"/g,
            (_match, src) => {
              const normalizedSrc = src.replace(/^images\//, 'Images/');
              const absoluteWithSas = `${basePath}/${normalizedSrc}${containerSas}`;
              return _match.replace(src, absoluteWithSas);
            }
          );

          this.isLoading = false;
          this.cdr.detectChanges();

          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 0);

          // 🔥 mark lesson started
          this.saveLessonProgress(false);
        },
        error: err => {
          console.error('Failed to load lesson HTML', err);
          this.lessonHtml = '<p>Error loading lesson content.</p>';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  // --------------------
  // Save lesson progress
  // --------------------
  private saveLessonProgress(isCompleted: boolean) {
    if (!this.currentLesson || !this.lessonStartTime) return;

    const elapsed =
      Math.floor((Date.now() - this.lessonStartTime) / 1000);

    this.timeSpentSeconds += elapsed;
    this.lessonStartTime = Date.now(); // reset timer

    this.progressService
      .updateLessonProgress(
        this.moduleId,
        this.currentLesson.id,
        isCompleted,
        this.timeSpentSeconds
      )
      .subscribe();
  }

  // --------------------
  // Lesson selection
  // --------------------
  selectLesson(lesson: LessonDto) {
    // save previous lesson before switching
    this.saveLessonProgress(false);

    this.currentLesson = lesson;
    this.cdr.detectChanges();
    this.loadLessonContent();
  }

  // --------------------
  // Navigation
  // --------------------
  goBackToPreview() {
    this.saveLessonProgress(false);
    this.router.navigate(['/modules/preview', this.moduleId]);
  }

  exitToModules() {
    this.saveLessonProgress(false);
    this.router.navigate(['/modules']);
  }

  get currentIndex(): number {
    return this.lessons.findIndex(l => l.id === this.currentLesson?.id);
  }

  get hasPrevious(): boolean {
    return this.currentIndex > 0;
  }

  get hasNext(): boolean {
    return this.currentIndex < this.lessons.length - 1;
  }

  goToPrevious() {
    if (!this.hasPrevious) return;
    this.saveLessonProgress(false);
    this.selectLesson(this.lessons[this.currentIndex - 1]);
  }

  goToNext() {
    if (!this.hasNext) return;

    // ✅ mark current lesson completed
    this.saveLessonProgress(true);

    const next = this.lessons[this.currentIndex + 1];
    this.selectLesson(next);
  }

  get isLastLesson(): boolean {
    if (!this.currentLesson) return false;
    return this.currentLesson.order === this.lessons.length;
  }

  goToQuiz() {
    // ✅ final lesson completion
    this.saveLessonProgress(true);
    this.router.navigate(['/modules', 'knowledge-check', this.moduleId]);
  }
}
