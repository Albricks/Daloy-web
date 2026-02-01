import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ModulesService } from '../../../services/modules.service';
import { ModuleListDto } from '../../../models/module-list.model';

@Component({
  selector: 'app-modules-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './module-list.component.html',
  styleUrls: ['./module-list.component.css']
})
export class ModulesListComponent implements OnInit {

  isLoading = true;

  searchTerm = '';
  selectedStatus = 'All';

  modules: ModuleListDto[] = [];

  constructor(
    private router: Router,
    private modulesService: ModulesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadModules();
  }

  // --------------------
  // Load modules (STABLE)
  // --------------------
  loadModules() {
    this.isLoading = true;
    this.modules = [];

    this.modulesService.getModules().subscribe({
      next: modules => {
        // Always reassign array (change detection friendly)
        this.modules = [...modules];
        this.isLoading = false;

        // 🔥 Force UI update (fixes "only updates after click")
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Failed to load modules', err);
        this.isLoading = false;

        this.cdr.detectChanges();
      }
    });
  }

  // --------------------
  // Filtered modules
  // --------------------
  get filteredModules(): ModuleListDto[] {
    const search = this.searchTerm.toLowerCase();

    return this.modules.filter(m => {
      const matchesSearch =
        m.title.toLowerCase().includes(search) ||
        m.description.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'All' || m.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  // --------------------
  // Navigation
  // --------------------
  openModule(id: string): void {
    this.router.navigate(['/modules/preview', id]);
  }

  continueModule(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/modules/read', id]);
  }
}