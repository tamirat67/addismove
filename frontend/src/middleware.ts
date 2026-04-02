import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, test.localhost:3000)
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // Special case for local development
  if (hostname.includes(".localhost:3000")) {
    hostname = hostname.replace(".localhost:3000", "");
  }

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // If a tenant is specified in the subdomain (e.g., anbessa.addismove.com)
  const subdomain = hostname.split(".")[0];
  
  // You can implement custom logic here to handle subdomains if needed.
  // For now, we'll just ensure the request proceeds normally
  // but this is where you would rewrite to `/[tenant]/path` if using dynamic routes.

  return NextResponse.next();
}
