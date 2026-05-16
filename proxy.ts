import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Define which routes are public (don't require login)
// If you want a landing page, add '/' to this list
const isPublicRoute = createRouteMatcher([
  "/",
  "/landing(.*)",
  "/select-apartment(.*)",
])

export default clerkMiddleware(async (auth, request) => {
  const { userId, orgId } = await auth()

  if (userId && !orgId && !isPublicRoute(request)) {
    // If the user is logged in but has no org, redirect to apartment selection
    return Response.redirect(new URL("/select-apartment", request.url))
  }

  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
