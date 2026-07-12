import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private auth = inject(Auth);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  isLoading = false;
  errorMessage = ''; // متغير لعرض الأخطاء بديل الـ alert

  async onLogin() {
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = ''; // تصفير الأخطاء القديمة

    try {
      // تسجيل الدخول بالفايربيز
      await signInWithEmailAndPassword(this.auth, this.email.trim(), this.password);
      
      // التوجيه للـ Dashboard مباشرة بدون أي alert نجاح
      this.router.navigate(['/dashboard']); 
      
    } catch (error: any) {
      console.error(error);
      // التعامل مع الأخطاء وعرضها للمستخدم بشكل احترافي
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        this.errorMessage = 'Invalid email or password. Please try again.';
      } else {
        this.errorMessage = 'An error occurred. Please check your connection.';
      }
      this.isLoading = false;
      this.cdr.detectChanges(); // تحديث الواجهة لإظهار الخطأ فوراً
    }
  }
}