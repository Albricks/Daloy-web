import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-module-read',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './module-read.component.html',
  styleUrls: ['./module-read.component.css']
})
export class ModuleReadComponent {
  id!: string;
  moduleTitle = 'Angular Fundamentals';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  backToPreview() {
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/modules/preview', id]);
  }

  backToModules() {
    this.router.navigate(['/modules']);
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

goToQuiz() {
  this.router.navigate([
    '/modules',
    'knowledge-check',
    this.id
  ]);
}

}
