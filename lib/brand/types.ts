// Type definitions
export interface BusinessInfo {
  title: string;
  subtitle: string;
  image: string;
  phone: string;
  address: string;
  email?: string;
}

export interface MenuItem {
  name: string;
  price: string;
  description: string;
  image: string;
}

export interface MenuCategory {
  name: string;
  description: string;
  image: string;
  items: MenuItem[];
}

export interface LoyaltyReward {
  name: string;
  points: number;
  description: string;
  image: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}
