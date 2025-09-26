/** @format */
import { Home, BarChart3, Settings, Users, Layers } from "lucide-react";

export const ValidPath = ["", "users", "reports", "settings", "pages", "schedule"];
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
];

export const LocalToken = "exc_auth_token";
export const LocalRefreshToken = "exc_refresh_token";
