# 🌟 UniqueCollection - Luxury E-Commerce Website

Welcome to **UniqueCollection** — a fully-functional luxury e-commerce web platform for clothes, watches, sunglasses, footwear, and accessories.

Built with real-time **Drag-and-Drop Image Upload**, a live **Product & Feature Studio**, **Client Registration & Account Portal**, **Protected Admin Management Dashboard**, **Order Tracking System**, **Customer Reviews & Ratings**, instant **WhatsApp Direct Ordering** (`+977 9708425276`), and **Email Support** (`mdfaisal2202@gmail.com`).

---

## 📞 Official Contacts

- **WhatsApp Support & Orders**: `+977 9708425276` (Link: `https://wa.me/9779708425276`)
- **Email Inquiries**: `mdfaisal2202@gmail.com`
- **Store Currency**: `Rs.` (NPR)

---

## 🔑 Login & Access Credentials

### 1. Store Administrator (Owner: Md Faisal)
- **Role**: Store Administrator
- **Username / Email**: `admin` or `mdfaisal2202@gmail.com`
- **Password**: `admin123`
- **Capabilities**:
  - View all customer orders (Customer Names, Phone Numbers, Emails, Delivery Addresses, Pincodes, Order Items, Totals, and Payment Types).
  - Update Order Status (Pending, Confirmed, Shipped, Delivered, Cancelled).
  - 1-Click **"WhatsApp Customer"** button next to each order to instantly chat with the client about their dispatch.
  - Add new products, drag-and-drop merchandise photos, and edit titles, categories, prices, and feature checklists.
  - Delete or duplicate products.
  - View registered client directory.
  - Export and import catalog JSON backups.

### 2. Demo Client / Customer Account
- **Email**: `sunil@gmail.com`
- **Password**: `client123`
- *(Or click **"Create Account"** to register any new client account with Name, Email, Phone, and Password)*.

---

## 🚀 How to Run the Website

### Option 1: Direct Browser Launch (Zero Setup Required)
Simply double-click **`index.html`** or right-click and open with Chrome, Edge, Safari, or Firefox.

### Option 2: Live Local Server
```bash
npm install
npm run dev
# or
npx serve .
```

---

## 🌟 Key Features Overview

### 1. 👥 Client Account & Registration System
- **Sign In & Register**: Customers can register with their Full Name, Email, WhatsApp Phone, and Password.
- **Client Portal**: View profile information, order history with live status badges (*Placed*, *Confirmed*, *Shipped*, *Delivered*), and direct tracking links.
- **Guest Checkout**: Customers can also order as a guest without prior registration.

### 2. 🔒 Protected Admin Management Studio
- **Overview & Analytics**: Live revenue counter, total order count, active inventory count, and registered client count.
- **Customer Orders Table**: Complete details of every customer who places an order:
  - Full Name, Phone, Email, Shipping Address, Pincode
  - Ordered Items, Quantities, and Total Price
  - Payment method (Cash on Delivery or UPI/Online QR)
  - Change status dropdown (Pending ➔ Confirmed ➔ Shipped ➔ Delivered)
  - Direct **WhatsApp** button to message the customer directly.
- **Products Inventory**: Add, Edit, or Delete any item.
- **Client Directory**: List of all registered users with their phone numbers, registration dates, and total orders.

### 3. 📸 Drag-and-Drop Image Upload & Product Editor
- **Direct On-Card Drag & Drop**: When logged in as Admin, drag any photo file from your computer over any product card to replace its photo immediately!
- **Product Studio**:
  - Drag & drop dropzone or paste image URL.
  - Title & Category selection (*Clothes*, *Watches*, *Sunglasses*, *Footwear*, *Perfumes*, *Accessories*).
  - Selling price & original price with automatic discount percentage.
  - **Dynamic Feature Checklist**: Add or delete bullet points like *"UV400 Polarized Lens"*, *"Waterproof 50M"*, *"100% European Flax Linen"*.

### 4. ⭐ Customer Product Reviews & Ratings
- On any product's Quick View modal:
  - View verified buyer star ratings and comments.
  - Interactive **Write a Review** form: select 1 to 5 stars, enter name, and write feedback.
  - Submitting immediately recalculates the product's average rating and review count.

### 5. 📦 Live Order Tracking System
- Customers or guests can click **"Track Order"** in the top navigation or footer.
- Enter Order ID (e.g., `UC-849201`) or phone number to see a 4-stage tracking progress bar (*Placed* ➔ *Confirmed* ➔ *Shipped* ➔ *Delivered*) with dispatch notes and delivery details.

### 6. 📱 WhatsApp Ordering (+977 9708425276)
- **Single Product Order**: Click "WhatsApp" on any card or detail modal to pre-format an order message.
- **Full Bag Checkout**: Formats entire cart with subtotal, discount, shipping, and delivery address.
- **Floating WhatsApp Button**: Pinned at the bottom-right corner with a pulse indicator.

### 7. ✉️ Help & Query Desk (mdfaisal2202@gmail.com)
- Help form categorizes inquiries (*Order Tracking*, *Sizing Help*, *Returns/Exchanges*, *Wholesale*).
- Interactive FAQ accordion for instant shipping, return, and authenticity answers.

---

## 📂 Project Structure

```
UniqueCollection/
├── index.html        # Main HTML structure with all sections, client & admin modals
├── css/
│   └── styles.css    # Luxury styling, animations, drag-drop hover states, review stars
├── js/
│   ├── data.js       # Seed catalog, users, orders, reviews, and FAQs (+977 9708425276)
│   └── app.js        # Core reactive app: Client auth, Admin dashboard, reviews, drag & drop
├── package.json      # Optional dev server scripts
└── README.md         # Comprehensive documentation
```
