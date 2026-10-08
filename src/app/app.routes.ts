import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { FoodsComponent } from './pages/foods/foods.component';
import { UsersComponent } from './pages/users/users.component';
import { ContentComponent } from './pages/content/content.component';
import { adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'foods',
        component: FoodsComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'content',
        component: ContentComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
