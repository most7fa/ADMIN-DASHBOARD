import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  categories: any[] = [];
  allCategories: any[] = [];

  searchText = '';

  editingId: string | null = null;

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

    try {

      const ref = collection(this.firestore, 'categories');

      const snap = await getDocs(ref);

      this.allCategories = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      this.categories = [...this.allCategories];
      this.cdr.detectChanges();

    } catch (error) {

      console.error(error);

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

    try {

      const ref = collection(this.firestore, 'categories');

      await addDoc(ref, this.newCategory);


      this.newCategory = {
        name: ''
      };

      await this.loadCategories();

    } catch (error) {

      console.error(error);

    }

  }

  editCategory(category: any) {

    this.editingId = category.id;

    this.newCategory = {
      name: category.name
    };

  }

  async updateCategory() {

    if (!this.editingId) return;

    try {

      const ref = doc(
        this.firestore,
        `categories/${this.editingId}`
      );

      await updateDoc(ref, {
        name: this.newCategory.name
      });


      this.editingId = null;

      this.newCategory = {
        name: ''
      };

      await this.loadCategories();

    } catch (error) {

      console.error(error);

    }

  }

  async deleteCategory(id: string) {


    try {

      const ref = doc(
        this.firestore,
        `categories/${id}`
      );

      await deleteDoc(ref);


      await this.loadCategories();

    } catch (error) {

      console.error(error);

    }

  }

  resetForm() {
    this.editingId = null;
    this.newCategory = { name: ''};
    this.cdr.detectChanges();
  }

}
