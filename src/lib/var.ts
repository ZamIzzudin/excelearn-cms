/** @format */
import {
  Home,
  BarChart3,
  Settings,
  Users,
  Layers,
  Image,
  FileText,
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
  { id: 1, text: "Dashboard", icon: Home, href: "/" },
  { id: 2, text: "Product", icon: Package, href: "/product" },
  { id: 3, text: "Schedule", icon: BarChart3, href: "/schedule" },
  { id: 4, text: "Promotion", icon: Megaphone, href: "/promotion" },
  { id: 5, text: "Content", icon: Image, href: "/content" },
  { id: 6, text: "Pages", icon: Layers, href: "/pages" },
];
export const SuperMenu = [
  { id: 1, text: "Dashboard", icon: Home, href: "/" },
  { id: 2, text: "Users", icon: Users, href: "/users" },
  { id: 3, text: "Product", icon: Package, href: "/product" },
  { id: 4, text: "Schedule", icon: BarChart3, href: "/schedule" },
  { id: 5, text: "Promotion", icon: Megaphone, href: "/promotion" },
  { id: 6, text: "Content", icon: Image, href: "/content" },
  { id: 7, text: "Pages", icon: Layers, href: "/pages" },
];

export const LocalToken = "exc_auth_token";
export const LocalRefreshToken = "exc_refresh_token";
