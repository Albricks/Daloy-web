import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Video } from '../models/video.model';
import { map, Observable } from 'rxjs';
import { VideoWatch } from '../models/video-watch.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly baseUrl = `${environment.apiUrl}/videos`;
  constructor(private http: HttpClient) {}

  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.baseUrl);
  }

getLatest(take: number): Observable<Video[]> {
  return this.getVideos().pipe(
    map((videos: Video[]) =>
      videos.slice(0, take)
    )
  );
}

  getVideoById(id: string): Observable<Video> {
    return this.http.get<Video>(`${this.baseUrl}/${id}`);
  }

  getVideoForWatch(id: string) {
  return this.http.get<VideoWatch>(`${this.baseUrl}/${id}`);
  }
}