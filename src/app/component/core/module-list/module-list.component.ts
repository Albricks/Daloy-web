import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modules-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.css']
})
export class ModulesListComponent {

  isLoading = true;

  searchTerm = '';
  selectedLevel = 'All';
  selectedStatus = 'All';

  modules = [
    {
      id: 1,
      title: 'Introduction to Web Security',
      description: 'Learn the fundamentals of securing modern web applications.',
      level: 'Beginner',
      duration: '15 mins',
      status: 'New',
      progress: 0
    },
    {
      id: 2,
      title: 'Angular Fundamentals',
      description: 'Understand components, routing, and best practices.',
      level: 'Beginner',
      duration: '20 mins',
      status: 'In Progress',
      progress: 45
    },
    {
      id: 3,
      title: 'API Design Basics',
      description: 'Design clean, scalable REST APIs.',
      level: 'Intermediate',
      duration: '25 mins',
      status: 'Completed',
      progress: 100
    }
  ];

  constructor(private router: Router) {
    // simulate API loading
    setTimeout(() => this.isLoading = false, 1200);
  }

  get filteredModules() {
    return this.modules.filter(m => {
      const matchesSearch =
        m.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesLevel =
        this.selectedLevel === 'All' || m.level === this.selectedLevel;

      const matchesStatus =
        this.selectedStatus === 'All' || m.status === this.selectedStatus;

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }

  openModule(id: number): void {
    this.router.navigate(['/modules/preview', id]);
  }

  continueModule(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/modules/read', id]);
  }
}
