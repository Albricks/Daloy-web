import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../utility/modal/modal.component';

@Component({
  selector: 'app-main-footer',
  standalone: true,
  imports: [CommonModule, ModalComponent], // 👈 SAME FIX
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.css']
})
export class MainFooterComponent {
  activeModal: 'about' | 'contact' | 'privacy' | null = null;

  openModal(type: 'about' | 'contact' | 'privacy'): void {
    this.activeModal = type;
  }

  closeModal(): void {
    this.activeModal = null;
  }
}
