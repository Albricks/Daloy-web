import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Video, VideoStatus } from '../../../models/video.model';
import { VideoService } from '../../../services/video.service';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {

  selectedStatus: 'All' | VideoStatus = 'All';

  videos: Video[] = [];
  loading = true;
  error?: string;

  constructor(
    private videoService: VideoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadVideos();
  }

  // --------------------
  // Load videos (STABLE)
  // --------------------
  loadVideos() {
    this.loading = true;
    this.videos = [];

    this.videoService.getVideos().subscribe({
      next: videos => {
        // Always reassign array (change detection friendly)
        this.videos = [...videos].sort((a, b) => a.order - b.order);
        this.loading = false;

        // 🔥 Force UI update
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        this.error = 'Failed to load videos';
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  // --------------------
  // Filtered videos (getter is OK)
  // --------------------
  get filteredVideos(): Video[] {
    if (this.selectedStatus === 'All') {
      return this.videos;
    }
    return this.videos.filter(v => v.status === this.selectedStatus);
  }

  // --------------------
  // UI label mapping
  // --------------------
  getStatusLabel(status: VideoStatus): string {
    switch (status) {
      case 'not-started': return 'New';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'New';
    }
  }

  // --------------------
  // Open video
  // --------------------
  openVideo(id: string) {
    this.router.navigate(['/videos', id]);
  }
}