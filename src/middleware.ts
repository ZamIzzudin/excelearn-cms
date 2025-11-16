/** @format */

"use server";

import { NextResponse, NextRequest } from "next/server";

import { LocalToken, ValidPath } from "./lib/var";

import { lastPathname } from "./lib/utils";

export default async function middleware(req: NextRequest) {
  try {
    const path = lastPathname(req.url);
    const token = req.cookies.get(LocalToken);

    if (!token && ValidPath.includes(path)) throw new Error();
  } catch (error) {
    return RedirectLogin(req);
  }
}

function RedirectLogin(req: NextRequest) {
  const loginURL = new URL("/login", req.url);

  return NextResponse.redirect(loginURL);
}
