import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function action<T>(promise: Promise<T>) {
  const res = await promise
  if (res && typeof res === "object" && "error" in res) {
    const error = (res as { error?: unknown }).error
    if (error) throw new Error(String(error))
  }
  return res
}
