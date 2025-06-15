import { AxiosRequestConfig } from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RefreshToken } from "./lib/actions";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  const redirectUri = process.env.REDIRECT_URI;
  const currentPath = request.nextUrl.pathname;

  const paths = [
    "/",
    "/album",
    "/playlist",
    "/collection"
  ]

  if (paths.filter((item)=>currentPath.includes(item))) {
    const refresh_token = request.cookies.get("refresh_token")?.value;
    if (!token && !refresh_token) {
      return NextResponse.redirect(new URL(redirectUri + "/login"), {
        status: 303,
      });
    } else if (!token && refresh_token) {
      // return NextResponse.rewrite(new URL(redirectUri + "/home"));
    }
    return NextResponse.rewrite(new URL(redirectUri + "/home"));
  }
  return NextResponse.rewrite(new URL(redirectUri + "/home"))
}

export const config = {
  matcher: [
    "/", // protege a rota raiz
  ],
};
