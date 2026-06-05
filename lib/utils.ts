import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function action(
  promise: Promise<{ error?: string; success?: boolean } | any>
) {
  const res = await promise
  if (res?.error) throw new Error(res.error)
  return res
}
