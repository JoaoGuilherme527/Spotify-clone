import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  const redirectUri = process.env.REDIRECT_URI;
  const currentPath = request.nextUrl.pathname;

  if (currentPath === "/") {
    if (!token) {
      return NextResponse.redirect(new URL(redirectUri + "/login"), {
        status: 303, // evita problemas de cache/loop :contentReference[oaicite:1]{index=1}
      });
    }
    return NextResponse.rewrite(new URL(redirectUri + "/home"));
  }
  return NextResponse.rewrite(new URL(redirectUri + "/home"))
}

export const config = {
  matcher: [
    "/", // protege a rota raiz
    // Adicione outras rotas se necessário: '/dashboard/:path*'
  ],
};
