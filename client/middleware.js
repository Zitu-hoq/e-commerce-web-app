// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  // Generate a random nonce using Web Crypto API (Edge-safe)
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const nonce = Buffer.from(array).toString("base64");

  // Build CSP header
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'nonce-${nonce}' 'unsafe-inline';
    img-src 'self' https://res.cloudinary.com data: blob:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  // Pass nonce to request headers so RootLayout can read it
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  const res = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Attach CSP header
  res.headers.set("Content-Security-Policy", cspHeader);

  return res;
}
