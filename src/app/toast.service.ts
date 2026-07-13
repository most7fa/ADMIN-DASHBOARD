import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  // استخدام Signals علشان الأداء والتحديث التلقائي الفوري
  toast = signal<ToastMessage | null>(null);

  show(text: string, type: 'success' | 'error' | 'info' = 'success') {
    this.toast.set({ text, type });
    
    // تختفي تلقائياً بعد 3 ثواني
    setTimeout(() => {
      this.toast.set(null);
    }, 3000);
  }
}