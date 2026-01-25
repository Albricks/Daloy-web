import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
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

  // Reference to <video> element in template
  @ViewChild('videoPlayer')
  videoPlayer?: ElementRef<HTMLVideoElement>;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // React to route param changes (YouTube-style behavior)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        console.error('NO VIDEO ID IN ROUTE');
        return;
      }

      this.videoId = id;
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
    this.video = undefined;

    this.videoService.getVideoForWatch(this.videoId).subscribe({
      next: v => {
        this.video = v;
        this.loading = false;

        // 🔥 Force UI update (fixes "only updates after click")
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        this.error = 'Failed to load video.';
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  // --------------------
  // Sidebar videos
  // --------------------
  loadRelatedVideos() {
    this.videoService.getVideos().subscribe({
      next: videos => {
        this.relatedVideos = videos.filter(v => v.id !== this.videoId);
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Failed to load related videos', err);
      }
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

    // Let Angular update layout first, then play
    setTimeout(() => {
      const player = this.videoPlayer?.nativeElement;
      if (player) {
        player.play().catch(err => {
          console.warn('Autoplay blocked by browser:', err);
        });
      }

      this.cdr.detectChanges();
    }, 0);
  }
}