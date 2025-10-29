import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { type Product, type CartItem, type Order, type InsertCartItem, type CartItemWithProduct, type Wishlist, type WishlistWithProduct, type InsertWishlist, products, cartItems, orders, wishlist } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;

  // Cart operations
  getCartItems(): Promise<CartItem[]>;
  getCartItemsWithProducts(): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(): Promise<void>;

  // Order operations
  createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order>;
  getAllOrders(): Promise<Order[]>;

  // Wishlist operations
  getWishlistItems(): Promise<Wishlist[]>;
  getWishlistItemsWithProducts(): Promise<WishlistWithProduct[]>;
  addToWishlist(item: InsertWishlist): Promise<Wishlist>;
  removeFromWishlist(id: string): Promise<boolean>;
  isInWishlist(productId: string): Promise<boolean>;

  // Initialization
  initializeProducts(): Promise<void>;
}

export class DBStorage implements IStorage {
  async initializeProducts() {
    try {
      console.log("Initializing products...");
      const existingProducts = await db.select().from(products);
      if (existingProducts.length > 0) {
        console.log(`${existingProducts.length} products already exist`);
        return;
      }
      const mockProducts: Product[] = [
      {
        id: "prod-1",
        name: "Quantum Processor XR-9",
        description: "Next-generation neural processing unit with quantum computing capabilities",
        price: "1299.99",
        image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80",
        category: "Computing",
      },
      {
        id: "prod-2",
        name: "HoloLens Pro Vision",
        description: "Augmented reality glasses with holographic display technology",
        price: "899.99",
        image: "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&q=80",
        category: "Wearables",
      },
      {
        id: "prod-3",
        name: "NanoBot Health Monitor",
        description: "Advanced biometric tracking device with AI health analysis",
        price: "499.99",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
        category: "Health",
      },
      {
        id: "prod-4",
        name: "Plasma Energy Core",
        description: "Wireless charging station with plasma energy conversion",
        price: "349.99",
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80",
        category: "Accessories",
      },
      {
        id: "prod-5",
        name: "Neural Interface Band",
        description: "Mind-controlled device interface with EEG sensors",
        price: "799.99",
        image: "https://images.unsplash.com/photo-1605170439002-90845e8c0137?w=800&q=80",
        category: "Wearables",
      },
      {
        id: "prod-6",
        name: "Gravity Levitation Speaker",
        description: "Floating wireless speaker with magnetic levitation technology",
        price: "599.99",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
        category: "Audio",
      },
      {
        id: "prod-7",
        name: "CyberKey Security Module",
        description: "Quantum encryption key with biometric authentication",
        price: "249.99",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        category: "Security",
      },
      {
        id: "prod-8",
        name: "Photon Keyboard Elite",
        description: "Mechanical keyboard with holographic key projections",
        price: "399.99",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
        category: "Computing",
      },
      {
        id: "prod-9",
        name: "AI Companion Drone",
        description: "Personal assistant drone with advanced AI capabilities",
        price: "1499.99",
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
        category: "Robotics",
      },
      {
        id: "prod-10",
        name: "Smart Glass Display",
        description: "Transparent OLED display with touch interface",
        price: "2199.99",
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80",
        category: "Display",
      },
    ];

      // Insert all products into the database
      await db.insert(products).values(mockProducts);
      console.log(`Successfully inserted ${mockProducts.length} products`);
    } catch (error) {
      console.error("Error initializing products:", error);
      throw error;
    }
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  // Cart operations
  async getCartItems(): Promise<CartItem[]> {
    return await db.select().from(cartItems);
  }

  async getCartItemsWithProducts(): Promise<CartItemWithProduct[]> {
    const items = await db.select().from(cartItems);
    const itemsWithProducts: CartItemWithProduct[] = [];

    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        itemsWithProducts.push({
          ...item,
          product,
        });
      }
    }

    return itemsWithProducts;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if product already exists in cart
    const existingItems = await db.select().from(cartItems).where(eq(cartItems.productId, insertItem.productId));

    if (existingItems.length > 0) {
      // Update quantity if item already exists
      const existingItem = existingItems[0];
      const newQuantity = existingItem.quantity + insertItem.quantity;
      await db.update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existingItem.id));
      return { ...existingItem, quantity: newQuantity };
    }

    // Create new cart item
    const id = randomUUID();
    const cartItem: CartItem = {
      id,
      productId: insertItem.productId,
      quantity: insertItem.quantity,
    };

    await db.insert(cartItems).values(cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = await db.select().from(cartItems).where(eq(cartItems.id, id));
    if (item.length === 0) return undefined;

    await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id));

    return { ...item[0], quantity };
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return result.changes > 0;
  }

  async clearCart(): Promise<void> {
    await db.delete(cartItems);
  }

  // Order operations
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      id,
      ...orderData,
      createdAt: new Date(),
    };

    await db.insert(orders).values(order);
    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  // Wishlist operations
  async getWishlistItems(): Promise<Wishlist[]> {
    return await db.select().from(wishlist).orderBy(desc(wishlist.addedAt));
  }

  async getWishlistItemsWithProducts(): Promise<WishlistWithProduct[]> {
    const items = await db.select().from(wishlist).orderBy(desc(wishlist.addedAt));
    const itemsWithProducts: WishlistWithProduct[] = [];

    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        itemsWithProducts.push({
          ...item,
          product,
        });
      }
    }

    return itemsWithProducts;
  }

  async addToWishlist(insertItem: InsertWishlist): Promise<Wishlist> {
    // Check if product already exists in wishlist
    const existingItems = await db.select().from(wishlist).where(eq(wishlist.productId, insertItem.productId));

    if (existingItems.length > 0) {
      return existingItems[0];
    }

    const id = randomUUID();
    const wishlistItem: Wishlist = {
      id,
      productId: insertItem.productId,
      addedAt: new Date(),
    };

    await db.insert(wishlist).values(wishlistItem);
    return wishlistItem;
  }

  async removeFromWishlist(id: string): Promise<boolean> {
    const result = await db.delete(wishlist).where(eq(wishlist.id, id));
    return result.changes > 0;
  }

  async isInWishlist(productId: string): Promise<boolean> {
    const items = await db.select().from(wishlist).where(eq(wishlist.productId, productId));
    return items.length > 0;
  }
}

export const storage = new DBStorage();
