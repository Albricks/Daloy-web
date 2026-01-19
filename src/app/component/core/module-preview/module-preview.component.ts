import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

type ModuleStatus = 'New' | 'In Progress' | 'Completed';

interface Module {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  lessons: number;
  status: ModuleStatus;
  objectives: string[];
}

@Component({
  selector: 'app-module-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './module-preview.component.html',
  styleUrls: ['./module-preview.component.css']
})
export class ModulePreviewComponent {

  module!: Module;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const id = this.route.snapshot.paramMap.get('id');

    // TEMP: mock (backend later)
    this.module = {
      id: id || '1',
      title: 'Angular Fundamentals',
      description: 'Understand components, routing, and best practices.',
      level: 'Beginner',
      duration: '20 mins',
      lessons: 6,
      status: 'In Progress',
      objectives: [
        'Understand Angular architecture',
        'Create components and templates',
        'Use routing and navigation',
        'Apply best practices'
      ]
    };
  }

  startModule() {
    this.router.navigate(['/modules/read', this.module.id]);
  }

  goBack() {
    this.router.navigate(['/modules']);
  }
}
