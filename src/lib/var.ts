/** @format */
import {
  Home,
  BarChart3,
  Settings,
  Users,
  Layers,
  Image,
  Megaphone,
  Package,
} from "lucide-react";

export const ValidPath = [
  "",
  "users",
  "reports",
  "settings",
  "pages",
  "schedule",
  "content",
  "product",
  "promotion",
];
export const DefaultMenu = [
  { id: 1, text: "Home", icon: Home, href: "/" },
  { id: 2, text: "Services", icon: Settings, href: "/services" },
  { id: 3, text: "Product", icon: Package, href: "/product" },
  { id: 4, text: "Schedule", icon: BarChart3, href: "/schedule" },
  { id: 5, text: "Promotion", icon: Megaphone, href: "/promotion" },
  { id: 6, text: "Content", icon: Image, href: "/content" },
  { id: 7, text: "Pages", icon: Layers, href: "/pages" },
];
export const SuperMenu = [
  { id: 1, text: "Home", icon: Home, href: "/" },
  { id: 2, text: "Users", icon: Users, href: "/users" },
  { id: 3, text: "Services", icon: Settings, href: "/services" },
  { id: 4, text: "Product", icon: Package, href: "/product" },
  { id: 5, text: "Schedule", icon: BarChart3, href: "/schedule" },
  { id: 6, text: "Promotion", icon: Megaphone, href: "/promotion" },
  { id: 7, text: "Content", icon: Image, href: "/content" },
  { id: 8, text: "Pages", icon: Layers, href: "/pages" },
];

export const LocalToken = "exc_auth_token";
export const LocalRefreshToken = "exc_refresh_token";

export const colors = [
  "#00AEEF", // Cyan
  "#D0229F", // Magenta
  "#7C3AED", // Purple
  "#F59E0B", // Orange
  "#EF4444", // Red
  "#10B981", // Green
  "#3B82F6", // Blue
  "#EC4899", // Pink
  "#8B5CF6", // Violet
  "#14B8A6", // Teal
  "#F97316", // Deep Orange
  "#06B6D4", // Sky Blue
];
