import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { MeDto } from '../../core/auth/models/me.dto';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent implements OnInit {
  isDropdownOpen = false;

  // declare only (no initialization here)
  user$!: Observable<MeDto | null>;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // ✅ safe: constructor has already run
    this.user$ = this.authService.currentUser$;

    // ✅ SSR-safe window access
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('close-profile-menu', () => {
        this.isDropdownOpen = false;
      });
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onAvatarError(event: Event): void {
  const img = event.target as HTMLImageElement;
  img.src = 'assets/default-avatar.png';
  }

  // goProfile() {
  //   this.closeDropdown();
  //   this.router.navigate(['/profile']);
  // }

  goProfileSettings() {
    this.closeDropdown();
    this.router.navigate(['/profile-settings']);
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  logout() {
    this.closeDropdown();
    this.authService.logout();
  }
}
