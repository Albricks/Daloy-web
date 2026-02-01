import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../utility/modal/modal.component';

@Component({
  selector: 'app-nav-footer',
  standalone: true,
  imports: [CommonModule, ModalComponent], // 👈 REQUIRED
  templateUrl: './nav-footer.component.html',
  styleUrls: ['./nav-footer.component.css']
})
export class NavFooterComponent {
  activeModal: 'about-us' | 'contact-us' | 'user-manual' | null = null;

  openModal(type: 'about-us' | 'contact-us' | 'user-manual'): void {
    this.activeModal = type;
  }

  closeModal(): void {
    this.activeModal = null;
  }
}
