export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: AdminUser;
    token: string;
  };
}

export interface OrderItem {
  foodId: string;
  foodName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  _id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  address: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Food {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFoodDTO {
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalFoods: number;
  totalUsers: number;
  statusBreakdown: {
    Pending: number;
    Preparing: number;
    'Out for Delivery': number;
    Delivered: number;
    Cancelled: number;
  };
}

export interface WebsiteContent {
  bannerText: string;
  bannerEnabled: boolean;
  heroHeadline: string;
  heroSubheadline: string;
  supportPhone: string;
  supportEmail: string;
  operatingHours: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
