import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../toast.service';

import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from '@angular/fire/firestore';

interface Product {
  id?: string;
  title?: string;
  name?: string;
  price: number;
  category: string;
  image?: string;
  imageUrl?: string;
  description?: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductsComponent implements OnInit {

  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  products: Product[] = [];
  isEditMode = false;
  editingId: string | null = null;
  isLoading = false;

  currentProduct: Product = { 
    title: '', 
    name: '', 
    price: 0, 
    category: '', 
    image: '', 
    imageUrl: '', 
    description: '' 
  };

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    this.isLoading = true;
    this.cdr.detectChanges();
    try {
      const ref = collection(this.firestore, 'products');
      const snap = await getDocs(ref);

      this.products = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

    } catch (error) {
      console.error('Error loading products:', error);
      this.toast.show('Failed to load products', 'error');
    }
    finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // دالة التقاط الصورة المختارة من الجهاز
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // إذا كنت ترفع الصورة مباشرة كـ Base64 أو لو عندك سيرفس تانية للرفع، 
      // الكود ده بيعمل Preview مؤقت ويجهز اللينك للحفظ
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.currentProduct.image = result;
        this.currentProduct.imageUrl = result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  async saveProduct() {
    const productName = this.currentProduct.title?.trim() || this.currentProduct.name?.trim();
    if (!productName || !this.currentProduct.price) {
      console.warn('Missing product name or price');
      return;
      }
      this.isLoading = true;
      this.cdr.detectChanges();

    const dataToSend = {
      title: productName,
      name: productName,
      price: Number(this.currentProduct.price),
      category: this.currentProduct.category || 'MEN',
      image: this.currentProduct.image || this.currentProduct.imageUrl || '',
      imageUrl: this.currentProduct.image || this.currentProduct.imageUrl || '',
      description: this.currentProduct.description || ''
    };

    try {
      if (this.isEditMode && this.editingId) {
        const ref = doc(this.firestore, `products/${this.editingId}`);
        await updateDoc(ref, dataToSend);
        this.toast.show('Product updated successfully!', 'success');

      } else {
        const ref = collection(this.firestore, 'products');
        await addDoc(ref, dataToSend);
        this.toast.show('Product added successfully!', 'success');
      }

      this.resetForm();
      await this.loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      this.toast.show('Error saving product', 'error');
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  editProduct(product: Product) {
    this.isEditMode = true;
    this.editingId = product.id || null;
    this.isEditMode = true;
    
    this.currentProduct = { 
      ...product,
      title: product.title || product.name || '',
      name: product.title || product.name || '',
      price: product.price,
      category: product.category || 'MEN',
      image: product.image || product.imageUrl || '',
      imageUrl: product.image || product.imageUrl || '',
      description: product.description || ''
    };
    this.cdr.detectChanges();
  }

  async deleteProduct(id: string) {
    this.isLoading = true;
    this.cdr.detectChanges();
    try {
      const ref = doc(this.firestore, `products/${id}`);
      await deleteDoc(ref);

      this.toast.show('Product deleted successfully!', 'info');
      
      if (this.editingId === id) {
        this.resetForm();
      }
      
      await this.loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      this.toast.show('Failed to delete product', 'error');
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.editingId = null;
    this.currentProduct = { 
      title: '', 
      name: '', 
      price: 0, 
      category: '', 
      image: '', 
      imageUrl: '', 
      description: '' 
    };
  }
}
