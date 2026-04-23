import { auth } from "@clerk/nextjs/server";

export default async function Page() {
  const { userId } = await auth();

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Clerk + Next.js App Router</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {userId ? "You are signed in." : "You are signed out."}
        </p>
      </div>
    </main>
  );
}