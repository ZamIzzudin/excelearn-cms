/** @format */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function lastPathname(path: string) {
  if (!path) return "";

  return path.split("/")[path.split("/").length - 1];
}
