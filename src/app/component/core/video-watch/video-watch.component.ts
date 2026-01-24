import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VideoService } from '../../../services/video.service';
import { VideoWatch } from '../../../models/video-watch.model';
import { Video } from '../../../models/video.model';

@Component({
  selector: 'app-video-watch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-watch.component.html',
  styleUrls: ['./video-watch.component.css']
})
export class VideoWatchComponent implements OnInit {

  relatedVideos: Video[] = [];

  videoId!: string;
  video?: VideoWatch;

  loading = true;
  error: string | null = null;
  theaterMode = false;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private router: Router
  ) {}

  ngOnInit() {
    // React to route param changes (YouTube pattern)
    this.route.paramMap.subscribe(params => {
      this.videoId = params.get('id')!;
      this.loadVideo();
      this.loadRelatedVideos();
    });
  }

  // --------------------
  // Load main video
  // --------------------
  loadVideo() {
    this.loading = true;
    this.error = null;

    this.videoService.getVideoForWatch(this.videoId).subscribe({
      next: v => {
        this.video = v;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Failed to load video.';
        this.loading = false;
      }
    });
  }

  // --------------------
  // Sidebar videos
  // --------------------
  loadRelatedVideos() {
    this.videoService.getVideos().subscribe(videos => {
      this.relatedVideos = videos.filter(v => v.id !== this.videoId);
    });
  }

  // --------------------
  // Sidebar click
  // --------------------
  openVideo(id: string) {
    this.router.navigate(['/videos', id]);
  }

  // --------------------
  // Theater mode
  // --------------------
  toggleTheater() {
    this.theaterMode = !this.theaterMode;
  }
}