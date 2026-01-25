import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Video } from '../models/video.model';
import { Observable } from 'rxjs';
import { VideoWatch } from '../models/video-watch.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private readonly baseUrl = `${environment.apiUrl}/videos`;
  constructor(private http: HttpClient) {}

  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(this.baseUrl);
  }

  getVideoById(id: string): Observable<Video> {
    return this.http.get<Video>(`${this.baseUrl}/${id}`);
  }

  getVideoForWatch(id: string) {
  return this.http.get<VideoWatch>(`${this.baseUrl}/${id}`);
  }
}