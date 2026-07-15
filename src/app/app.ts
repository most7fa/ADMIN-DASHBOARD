import { Component, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  isLoginPage = false;

  public toastService = inject(ToastService);

  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private router: Router) {
    // مراقبة مسار الصفحة الحالية
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // إذا كان المسار فارغاً '' (وهو مسار صفحة الـ Login عندك) أو يحتوي على كلمة login
        this.isLoginPage = event.url === '/' || event.url.includes('/login');
      }
    });
  }
}
