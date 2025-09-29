/** @format */
import { Home, BarChart3, Settings, Users, Layers, Image, FileText, Megaphone } from "lucide-react";

export const ValidPath = ["", "users", "reports", "settings", "pages", "schedule", "content", "blog", "promotion"];
export const DefaultMenu = [
  { id: 1, text: "Dashboard", icon: Home, href: "/" },
  { id: 2, text: "Reports", icon: BarChart3, href: "/reports" },
  { id: 3, text: "Settings", icon: Settings, href: "/settings" },
];
export const SuperMenu = [
  { id: 1, text: "Dashboard", icon: Home, href: "/" },
  { id: 2, text: "Users", icon: Users, href: "/users" },
  { id: 3, text: "Reports", icon: BarChart3, href: "/reports" },
  { id: 4, text: "Settings", icon: Settings, href: "/settings" },
  { id: 5, text: "Pages", icon: Layers, href: "/pages" },
  { id: 6, text: "Schedule", icon: BarChart3, href: "/schedule" },
  { id: 7, text: "Content", icon: Image, href: "/content" },
  { id: 8, text: "Blog", icon: FileText, href: "/blog" },
  { id: 9, text: "Promotion", icon: Megaphone, href: "/promotion" },
];

export const LocalToken = "exc_auth_token";
export const LocalRefreshToken = "exc_refresh_token";
