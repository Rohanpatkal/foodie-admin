# Foodie - Admin Operations Portal

Executive back-office and operations management portal for **Foodie**, built with modern standalone **Angular 22**, **TypeScript**, and a custom dark glassmorphic design system.

---

## Features

- **Executive Operations Dashboard**: All-time gross revenue, total orders, active/pending fulfillment pipeline, total foods, and customer accounts.
- **Live Orders Fulfillment**:
  - Filter by order status: `Pending`, `Confirmed`, `Preparing`, `Out for Delivery`, `Delivered`, `Cancelled`.
  - Full order item inspection (images/emojis, quantities, line totals, grand total).
  - Customer contact records and delivery address.
  - Real-time inline status dispatch updates.
- **Menu & Food Catalog**:
  - Filter by category (`Pizza`, `Burger`, `Pasta`, `Sushi`, etc.) and search items.
  - Add new menu items with custom emoji/icon selector, pricing, and category.
  - Edit existing food details & prices.
  - Delete items with confirmation dialog.
- **Customers & Users Directory**:
  - Review all registered customers and administrators.
  - Role-based filtering and search by name/email.
- **Website Content & Announcement Bar**:
  - Toggle and customize promotional top announcement bar (flash sales, discount codes).
  - Configure marketing hero headline & value proposition copy.
  - Set store delivery fees, free delivery threshold, phone, and operating hours.
  - Real-time simulated customer website preview.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Server
Run the dev server:
```bash
npm start
```
Navigate to `http://localhost:4200/`. The app will automatically reload when source files change.

### 3. Production Build
```bash
npm run build
```
Build artifacts will be stored in the `dist/admin` directory.

---

## Authentication

Default administrator credentials configured in the Foodie backend:
- **Email**: `admin@foodie.com`
- **Password**: `admin123`
*(A "Quick Fill" button is available directly on the login screen for rapid access).*
