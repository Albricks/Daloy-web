import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-nav-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent {
  isDropdownOpen = false;

    constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  goProfile() {
    console.log('Navigating to /profile');
    this.closeDropdown();
    this.router.navigate(['/profile']);
  }

  goProfileSettings() {
    this.closeDropdown();
    this.router.navigate(['/profile-settings']);
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  closeProfileMenu() {
  this.isDropdownOpen = false;
}

  ngOnInit() {
    window.addEventListener('close-profile-menu', () => {
      this.isDropdownOpen = false;
    });
  }
}
