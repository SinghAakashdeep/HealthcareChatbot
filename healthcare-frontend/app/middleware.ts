import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")

  const path = req.nextUrl.pathname

  if (path.startsWith("/doctor") && !token) {
    return NextResponse.redirect(new URL("/landing", req.url))
  }

  if (path.startsWith("/patient") && !token) {
    return NextResponse.redirect(new URL("/landing", req.url))
  }

  return NextResponse.next()
}
