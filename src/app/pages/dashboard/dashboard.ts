import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Firestore, collection, getDocs, query, limit } from '@angular/fire/firestore';

interface RecentProduct {
  id?: string;
  title?: string;
  name?: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);

  totalProducts = 0;
  totalCategories = 0;
  recentProducts: RecentProduct[] = []; // مصفوفة لآخر الإضافات
  isLoading = false;

  // نسب مئوية وهمية للرسم البياني تعبر عن حجم المخزون
  menPercentage = 65;
  womenPercentage = 35;

  ngOnInit() {
    this.loadDashboardData();
  }

  async loadDashboardData() {
    this.isLoading = true;
    this.cdr.detectChanges();
    try {
      // 1. جلب الإحصائيات العامة
      const productsRef = collection(this.firestore, 'products');
      const productsSnap = await getDocs(productsRef);
      this.totalProducts = productsSnap.size;

      const categoriesRef = collection(this.firestore, 'categories');
      const categoriesSnap = await getDocs(categoriesRef);
      this.totalCategories = categoriesSnap.size;

      // 2. جلب آخر 5 منتجات مضافة للجدول
      // ملحوظة: لو عندك حقل تريتب مثل createdAt يفضل استخدامه، هنا جلبنا أول 5 كعينة لآخر الإضافات
      this.recentProducts = productsSnap.docs.slice(0, 5).map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RecentProduct[];

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
