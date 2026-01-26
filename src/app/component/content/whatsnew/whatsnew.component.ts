import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ModulesService } from '../../../services/modules.service';
import { VideoService } from '../../../services/video.service';
import { ModuleListDto } from '../../../models/module-list.model';
import { Video } from '../../../models/video.model';

@Component({
  selector: 'app-whatsnew',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsnew.component.html',
  styleUrls: ['./whatsnew.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatsNewComponent {
  latestModules$!: Observable<ModuleListDto[]>;
  latestVideos$!: Observable<Video[]>;

  constructor(
    private router: Router,
    private modulesService: ModulesService,
    private videoService: VideoService
  ) {}
 
  ngOnInit() {
    this.latestModules$ = this.modulesService.getLatest(3);
    this.latestVideos$ = this.videoService.getLatest(3);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}