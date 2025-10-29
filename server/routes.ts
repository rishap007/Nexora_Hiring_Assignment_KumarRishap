import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, checkoutFormSchema, insertWishlistSchema, type Receipt } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize products in database
  await storage.initializeProducts();

  // GET /api/products - Fetch all products
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // GET /api/cart - Get cart items with total
  app.get("/api/cart", async (_req, res) => {
    try {
      const items = await storage.getCartItemsWithProducts();
      
      const total = items.reduce((sum, item) => {
        return sum + parseFloat(item.product.price) * item.quantity;
      }, 0);

      res.json({
        items,
        total: total.toFixed(2),
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  // POST /api/cart - Add item to cart
  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      
      // Verify product exists
      const product = await storage.getProduct(validatedData.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      console.error("Error adding to cart:", error);
      res.status(500).json({ error: "Failed to add item to cart" });
    }
  });

  // PATCH /api/cart/:id - Update cart item quantity
  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ error: "Invalid quantity" });
      }

      const updatedItem = await storage.updateCartItemQuantity(id, quantity);
      
      if (!updatedItem) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  // DELETE /api/cart/:id - Remove item from cart
  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.removeFromCart(id);

      if (!deleted) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ error: "Failed to remove cart item" });
    }
  });

  // POST /api/checkout - Process checkout and create order
  app.post("/api/checkout", async (req, res) => {
    try {
      const validatedData = checkoutFormSchema.parse({
        name: req.body.customerName,
        email: req.body.customerEmail,
      });

      // Get current cart items
      const cartItems = await storage.getCartItemsWithProducts();

      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      // Calculate total
      const total = cartItems.reduce((sum, item) => {
        return sum + parseFloat(item.product.price) * item.quantity;
      }, 0);

      // Create order
      const order = await storage.createOrder({
        customerName: validatedData.name,
        customerEmail: validatedData.email,
        total: total.toFixed(2),
        items: JSON.stringify(
          cartItems.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          }))
        ),
      });

      // Clear cart after successful order
      await storage.clearCart();

      // Format receipt
      const receipt: Receipt = {
        id: order.id,
        orderNumber: order.id.split('-')[0].toUpperCase(),
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: order.total,
        items: cartItems.map((item) => ({
          productName: item.product.name,
          quantity: item.quantity,
          price: (parseFloat(item.product.price) * item.quantity).toFixed(2),
        })),
        timestamp: order.createdAt.toISOString(),
      };

      res.status(201).json(receipt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid customer data", details: error.errors });
      }
      console.error("Error processing checkout:", error);
      res.status(500).json({ error: "Failed to process checkout" });
    }
  });

  // GET /api/orders - Get all orders
  app.get("/api/orders", async (_req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // GET /api/wishlist - Get wishlist items
  app.get("/api/wishlist", async (_req, res) => {
    try {
      const items = await storage.getWishlistItemsWithProducts();
      res.json(items);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      res.status(500).json({ error: "Failed to fetch wishlist" });
    }
  });

  // POST /api/wishlist - Add item to wishlist
  app.post("/api/wishlist", async (req, res) => {
    try {
      const validatedData = insertWishlistSchema.parse(req.body);

      // Verify product exists
      const product = await storage.getProduct(validatedData.productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      const wishlistItem = await storage.addToWishlist(validatedData);
      res.status(201).json(wishlistItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid request data", details: error.errors });
      }
      console.error("Error adding to wishlist:", error);
      res.status(500).json({ error: "Failed to add item to wishlist" });
    }
  });

  // DELETE /api/wishlist/:id - Remove item from wishlist
  app.delete("/api/wishlist/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.removeFromWishlist(id);

      if (!deleted) {
        return res.status(404).json({ error: "Wishlist item not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error removing wishlist item:", error);
      res.status(500).json({ error: "Failed to remove wishlist item" });
    }
  });

  // GET /api/products/:id - Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
