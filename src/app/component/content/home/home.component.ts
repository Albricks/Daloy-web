import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MeDto } from '../../../core/auth/models/me.dto';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
    user$: Observable<MeDto | null>;

  constructor(
    private router: Router, 
    private authService: AuthService) {
    this.user$ = this.authService.currentUser$;
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
