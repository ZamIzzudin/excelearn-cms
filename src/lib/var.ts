/** @format */
import { Home, BarChart3, Settings, Users } from "lucide-react";

export const ValidPath = ["", "users", "reports", "settings"];
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
];

export const LocalToken = "exc_auth_token";
export const LocalRefreshToken = "exc_refresh_token";
