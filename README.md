# Vibe Commerce

Full-stack e-commerce platform built with React, TypeScript, Express, and SQLite.
<img width="1920" height="1080" alt="Screenshot (13)" src="https://github.com/user-attachments/assets/af8d84db-6593-4d56-8850-312cee093741" />

## Overview

A complete e-commerce solution featuring product catalog management, shopping cart, wishlist, order processing, and advanced filtering capabilities. Successfully migrated from PostgreSQL to SQLite with Drizzle ORM while implementing extensive feature enhancements.

## Technology Stack

**Frontend**
- React 18 with TypeScript
- TanStack Query (React Query) for state management
- Tailwind CSS + Shadcn UI components
- Wouter for routing

**Backend**
- Express.js
- Node.js with TypeScript
- Zod for validation

**Database**
- SQLite
- Drizzle ORM
- better-sqlite3 driver

**Development**
- Vite for build tooling
- TypeScript for type safety
- ESLint for code quality

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Frontend Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │    Pages     │  │  Components  │  │   State Management       │  │
│  │              │  │              │  │   (TanStack Query)       │  │
│  │ - Home       │  │ - Header     │  │                          │  │
│  │ - Product    │  │ - ProductCard│  │ - Optimistic updates     │  │
│  │ - Checkout   │  │ - CartPanel  │  │ - Cache invalidation     │  │
│  │ - Orders     │  │ - QuickView  │  │ - Mutations & Queries    │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                          HTTP Requests (REST API)
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                            Backend Layer                             │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      Express.js Server                        │  │
│  │                                                                │  │
│  │  Routes (server/routes.ts)          Storage (server/storage.ts│  │
│  │  ├─ GET    /api/products            ├─ getAllProducts()      │  │
│  │  ├─ GET    /api/products/:id        ├─ getProduct()          │  │
│  │  ├─ GET    /api/cart                ├─ getCartItems()        │  │
│  │  ├─ POST   /api/cart                ├─ addToCart()           │  │
│  │  ├─ PATCH  /api/cart/:id            ├─ updateQuantity()      │  │
│  │  ├─ DELETE /api/cart/:id            ├─ removeFromCart()      │  │
│  │  ├─ GET    /api/wishlist            ├─ getWishlistItems()    │  │
│  │  ├─ POST   /api/wishlist            ├─ addToWishlist()       │  │
│  │  ├─ DELETE /api/wishlist/:id        ├─ removeFromWishlist()  │  │
│  │  ├─ GET    /api/orders              ├─ getAllOrders()        │  │
│  │  └─ POST   /api/orders              └─ createOrder()         │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                            Drizzle ORM Queries
                                  │
┌─────────────────────────────────────────────────────────────────────┐
│                          Database Layer (SQLite)                     │
│  ┌─────────────┬─────────────┬─────────────┬─────────────────────┐ │
│  │  products   │  cartItems  │  wishlist   │       orders        │ │
│  ├─────────────┼─────────────┼─────────────┼─────────────────────┤ │
│  │ - id        │ - id        │ - id        │ - id                │ │
│  │ - name      │ - productId │ - productId │ - customerName      │ │
│  │ - desc      │ - quantity  │ - addedAt   │ - email             │ │
│  │ - price     │             │             │ - items (JSON)      │ │
│  │ - image     │             │             │ - total             │ │
│  │ - category  │             │             │ - createdAt         │ │
│  └─────────────┴─────────────┴─────────────┴─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action → React Component → TanStack Query Mutation → Express Route
                                                               │
                                                               ▼
                                                       Validation (Zod)
                                                               │
                                                               ▼
                                                       Storage Layer
                                                               │
                                                               ▼
                                                       Drizzle ORM Query
                                                               │
                                                               ▼
                                                       SQLite Database
                                                               │
                                                               ▼
                                                       Response + Cache Update
```

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation Steps

1. Clone the repository
```bash
git clone <repository-url>
cd Nexora_Hiring_Assignment_KumarRishap
```

2. Install dependencies
```bash
npm install
```

3. Initialize database
```bash
npm run db:push
```

4. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run db:push` | Push database schema changes |
| `npm run db:studio` | Open Drizzle Studio for database management |

## Features

### Core Functionality
- Product catalog with detailed information
- Real-time search across products
- Advanced filtering (category, price range, sorting)
- Shopping cart with quantity management
- Wishlist/favorites system
- Secure checkout process
- Order history tracking

### User Experience
- Dark/Light theme toggle with persistence
- Product quick view modal
- Cart preview on hover
- Responsive design (mobile, tablet, desktop)
- Optimistic UI updates
- Loading states and skeletons
- Toast notifications

### Technical Features
- Type-safe database operations with Drizzle ORM
- Optimistic updates via TanStack Query
- Automatic cache invalidation
- RESTful API architecture
- Input validation with Zod
- SQLite for lightweight data persistence

## Project Structure

```
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # Shadcn UI components
│   │   │   ├── Header.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CartPanel.tsx
│   │   │   └── ...
│   │   ├── pages/          # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProductDetailsPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   └── OrderHistoryPage.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and query client
│   │   └── main.tsx        # Entry point
│   └── index.html          # HTML template
├── server/                 # Backend application
│   ├── db.ts               # Database connection
│   ├── index.ts            # Express server
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Business logic layer
│   └── vite.ts             # Vite dev server config
├── shared/                 # Shared types and schema
│   └── schema.ts           # Drizzle schema definitions
├── drizzle.config.ts       # Drizzle configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json            # Dependencies and scripts
```

## Database Schema

### Products Table
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key |
| name | TEXT | Product name |
| description | TEXT | Product description |
| price | TEXT | Product price |
| image | TEXT | Image URL |
| category | TEXT | Product category |

### Cart Items Table
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key |
| productId | TEXT | Reference to product |
| quantity | INTEGER | Item quantity |

### Wishlist Table
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key |
| productId | TEXT | Reference to product |
| addedAt | TIMESTAMP | Date added |

### Orders Table
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key |
| customerName | TEXT | Customer name |
| email | TEXT | Customer email |
| address | TEXT | Shipping address |
| city | TEXT | City |
| zipCode | TEXT | ZIP code |
| items | TEXT | Order items (JSON) |
| total | TEXT | Order total |
| createdAt | TIMESTAMP | Order date |

## API Endpoints

### Products
- `GET /api/products` - Retrieve all products
- `GET /api/products/:id` - Retrieve single product

### Shopping Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart/:id` - Update item quantity
- `DELETE /api/cart/:id` - Remove item from cart

### Wishlist
- `GET /api/wishlist` - Get wishlist items
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist/:id` - Remove item from wishlist

### Orders
- `GET /api/orders` - Get order history
- `POST /api/orders` - Create new order

## Development Notes

### Database Migration
This project was successfully migrated from PostgreSQL to SQLite:
- Converted Drizzle schema from `pgTable` to `sqliteTable`
- Changed decimal types to text for price fields
- Updated database driver from `@neondatabase/serverless` to `better-sqlite3`
- Maintained all CRUD functionality during migration

### Performance Optimizations
- Implemented optimistic UI updates for instant feedback
- Smart caching strategy with TanStack Query
- Automatic cache invalidation on mutations
- Debounced search input for reduced API calls

### Type Safety
- End-to-end TypeScript implementation
- Shared types between frontend and backend
- Type-safe database queries with Drizzle ORM
- Runtime validation with Zod schemas

## Author

Kumar Rishap

**Contact**
- Email: rishapsharma62476@gmail.com
- GitHub: Rishap007

## Acknowledgments

Built for Nexora Hiring Assignment demonstrating full-stack development capabilities with modern web technologies.
