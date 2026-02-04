import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ModulesService } from '../../../services/modules.service';
import { ModulePreviewDto } from '../../../models/module-preview.model';

@Component({
  selector: 'app-module-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './module-preview.component.html',
  styleUrls: ['./module-preview.component.css']
})
export class ModulePreviewComponent implements OnInit {

  module?: ModulePreviewDto;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modulesService: ModulesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // React to route param changes (fixes reuse + stale UI)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('ROUTE ID (sub):', id);

      if (id) {
        this.loadModule(id);
      } else {
        console.error('NO MODULE ID IN ROUTE');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --------------------
  // Load module (STABLE)
  // --------------------
  loadModule(id: string) {
    this.isLoading = true;
    this.module = undefined;

    this.modulesService.getModule(id).subscribe({
      next: module => {
        this.module = module;
        this.isLoading = false;
        
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('MODULE API ERROR FULL:', {
          status: err.status,
          message: err.message,
          error: err.error
        });

        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --------------------
  // Navigation
  // --------------------
  startModule() {
    if (!this.module) return;
    this.router.navigate(['/modules/read', this.module.id]);
  }

  goBack() {
    this.router.navigate(['/modules']);
  }

  // --------------------
  // Status CSS class
  // --------------------
  get statusClass(): string {
    return (this.module?.status || '')
      .toLowerCase()
      .replace(' ', '-');
  }
}