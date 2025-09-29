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
} from "lucide-react";

export const ValidPath = [
  "",
  "users",
  "reports",
  "settings",
  "pages",
  "schedule",
  "content",
  "blog",
  "promotion",
];
export const DefaultMenu = [
  { id: 1, text: "Dashboard", icon: Home, href: "/" },
  { id: 2, text: "Blog", icon: FileText, href: "/blog" },
  { id: 3, text: "Promotion", icon: Megaphone, href: "/promotion" },
  { id: 4, text: "Content", icon: Image, href: "/content" },
  { id: 5, text: "Pages", icon: BarChart3, href: "/pages" },
  { id: 6, text: "Schedule", icon: Settings, href: "/schedule" },
];
export const SuperMenu = [
  { id: 1, text: "Dashboard", icon: Home, href: "/" },
  { id: 2, text: "Users", icon: Users, href: "/users" },
  { id: 3, text: "Blog", icon: FileText, href: "/blog" },
  { id: 4, text: "Promotion", icon: Megaphone, href: "/promotion" },
  { id: 5, text: "Content", icon: Image, href: "/content" },
  { id: 6, text: "Pages", icon: Layers, href: "/pages" },
  { id: 7, text: "Schedule", icon: BarChart3, href: "/schedule" },
];

export const LocalToken = "exc_auth_token";
export const LocalRefreshToken = "exc_refresh_token";
