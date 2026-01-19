import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type VideoStatus = 'New' | 'In Progress' | 'Completed';

interface Video {
  id: number;
  title: string;
  duration: string;
  status: VideoStatus;
  thumbnail: string;
}

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent {

  selectedStatus: 'All' | VideoStatus = 'All';

  videos: Video[] = [
    {
      id: 1,
      title: 'Introduction to Daloy',
      duration: '5:32',
      status: 'Completed',
      thumbnail: 'assets/thumbs/video-1.jpg'
    },
    {
      id: 2,
      title: 'Understanding Modules',
      duration: '12:10',
      status: 'In Progress',
      thumbnail: 'assets/thumbs/video-2.jpg'
    },
    {
      id: 3,
      title: 'Tracking Your Progress',
      duration: '8:45',
      status: 'New',
      thumbnail: 'assets/thumbs/video-3.jpg'
    }
  ];

  get filteredVideos(): Video[] {
    if (this.selectedStatus === 'All') {
      return this.videos;
    }
    return this.videos.filter(v => v.status === this.selectedStatus);
  }

  openVideo(id: number) {
    console.log('Open video', id);
  }
}
