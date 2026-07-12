import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { ProductsComponent } from './pages/products/products';
import { CategoriesComponent } from './pages/categories/categories';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: ProductsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'statistics',
    component: ProductsComponent,
    canActivate: [authGuard]
  }
];
