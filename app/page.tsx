import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import LandingPage from "./landing/page";

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard")
  }

  return <LandingPage />
}