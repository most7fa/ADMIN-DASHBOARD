import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../..//toast.service';

import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from '@angular/fire/firestore';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class CategoriesComponent implements OnInit {

  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  categories: any[] = [];
  allCategories: any[] = [];
  searchText = '';
  editingId: string | null = null;
  isLoading = false;

  newCategory = {
    name: ''
  };

  ngOnInit() {
    this.loadCategories();
  }

  get totalCategories(): number {
    return this.categories.length;
  }

  async loadCategories() {
    this.isLoading = true;
    this.cdr.detectChanges();

    try {

      const ref = collection(this.firestore, 'categories');

      const snap = await getDocs(ref);

      this.allCategories = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      this.categories = [...this.allCategories];

    } catch (error) {

      console.error(error);
      this.toast.show('Failed to load categories', 'error');
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();

    }

  }

  searchCategories() {

    if (!this.searchText.trim()) {

      this.categories = [...this.allCategories];
      return;

    }

    this.categories = this.allCategories.filter((category: any) =>
      category.name.toLowerCase().includes(
        this.searchText.toLowerCase()
      )
    );

  }

  async addCategory() {

    if (!this.newCategory.name.trim()) return;

    this.isLoading = true;
    this.cdr.detectChanges();

    try {

      const ref = collection(this.firestore, 'categories');

      await addDoc(ref, this.newCategory);

      this.toast.show('Category added successfully!', 'success');

      this.newCategory = {
        name: ''
      };

      await this.loadCategories();

    } catch (error) {

      console.error(error);
      this.toast.show('Error adding category', 'error');
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();

    }

  }

  editCategory(category: any) {

    this.editingId = category.id;

    this.newCategory = {
      name: category.name
    };
    this.cdr.detectChanges();
  }

  async updateCategory() {

    if (!this.editingId) return;
    
    this.isLoading = true;
    this.cdr.detectChanges();

    try {

      const ref = doc(
        this.firestore,
        `categories/${this.editingId}`
      );

      await updateDoc(ref, {
        name: this.newCategory.name
      });

      this.toast.show('Category updated successfully!', 'success');

      this.editingId = null;

      this.newCategory = {
        name: ''
      };

      await this.loadCategories();

    } catch (error) {

      console.error(error);
      this.toast.show('Error updating category', 'error');
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();

    }

  }

  async deleteCategory(id: string) {

    this.isLoading = true;
    this.cdr.detectChanges();

    try {

      const ref = doc(
        this.firestore,
        `categories/${id}`
      );

      await deleteDoc(ref);

      this.toast.show('Category deleted successfully!', 'info');

      await this.loadCategories();

    } catch (error) {

      console.error(error);
      this.toast.show('Failed to delete category', 'error');
      this.isLoading = false;
      this.cdr.detectChanges();

    }

  }

  resetForm() {
    this.editingId = null;
    this.newCategory = { name: ''};
    this.cdr.detectChanges();
  }

}
