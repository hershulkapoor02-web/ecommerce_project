# 🛍️ Elara — Django + React Ecommerce

A full-stack ecommerce website built with **Django REST Framework** (backend) and **React** (frontend).

---

## 📁 Project Structure

```
├── ecommerce_backend/     ← Django project
│   ├── store/             ← Main app (models, views, serializers)
│   ├── ecommerce_backend/ ← Settings, URLs
│   ├── db.sqlite3         ← SQLite database (auto-created)
│   └── seed_data.py       ← Script to populate sample products
│
└── ecommerce-frontend/    ← React app
    └── src/
        ├── context/       ← CartContext (global state)
        ├── components/    ← Navbar, ProductCard
        └── pages/         ← Home, Products, Detail, Cart, Checkout, Success
```

---

## 🚀 Setup & Run

### 1. Backend (Django)

```bash
cd ecommerce_backend

# Install dependencies
pip install django djangorestframework django-cors-headers Pillow

# Run migrations
python manage.py migrate

# Seed sample data (14 products across 5 categories)
python seed_data.py

# Create admin user (optional)
python manage.py createsuperuser

# Start server on port 8000
python manage.py runserver
```

Backend API available at: `http://localhost:8000/api/`
Admin panel: `http://localhost:8000/admin/`

### 2. Frontend (React)

```bash
cd ecommerce-frontend

# Install dependencies
npm install

# Start development server on port 3000
npm start
```

Frontend available at: `http://localhost:3000`

> ⚠️ Make sure Django is running on port 8000 before starting React.

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories/` | List all categories |
| GET | `/api/products/` | List products (filter by `category`, `search`, `featured`, `min_price`, `max_price`) |
| GET | `/api/products/<slug>/` | Product detail |
| GET | `/api/cart/` | View cart (uses `X-Cart-Session` header) |
| POST | `/api/cart/add/` | Add item to cart |
| PUT | `/api/cart/item/<id>/` | Update quantity |
| DELETE | `/api/cart/item/<id>/remove/` | Remove item |
| POST | `/api/orders/` | Place order |
| GET | `/api/orders/<id>/` | Order detail |

---

## ✨ Features

- **Home page** with hero section, category grid, featured products
- **Product listing** with category filter, search, price range, sort
- **Product detail** with quantity selector, related products
- **Cart** — session-based (no login required), persists in localStorage
- **Checkout** with form validation and order placement
- **Order confirmation** page with order summary
- **Django Admin** for managing products, categories, orders
- Responsive design (mobile-friendly)
- Warm editorial aesthetic with Fraunces + DM Sans fonts

---

## 🛠️ Tech Stack

- **Backend:** Django 4.x, Django REST Framework, SQLite
- **Frontend:** React 18, React Router v6, Axios, react-hot-toast
- **Styling:** Pure CSS with CSS variables (no UI library)
- **Fonts:** Google Fonts (Fraunces, DM Sans)
