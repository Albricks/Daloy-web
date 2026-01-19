import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-whatsnew',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsnew.component.html',
  styleUrls: ['./whatsnew.component.css']
})
export class WhatsNewComponent {
  constructor(private router: Router) {}

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
