import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number;
}

export interface ProductType {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  featured: boolean;
  createdAt: string;
}

export interface OrderType {
  id: string;
  totalAmount: number;
  status: string;
  address: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      title: string;
      imageUrl: string;
    };
  }[];
  user?: {
    name: string;
    email: string;
  };
}

export interface DesignRequestType {
  id: string;
  address: string;
  roomType: string;
  roomDimensions: string;
  description: string;
  inspirationLink: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}
