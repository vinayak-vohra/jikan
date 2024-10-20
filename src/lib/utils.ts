import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes while
 * removing any duplicates. This function utilizes `clsx` for class name manipulation and
 * `twMerge` to ensure that Tailwind's utility classes are applied correctly without conflicts.
 *
 * @param inputs - A list of class names (strings, objects, or arrays) to be combined.
 * @returns A single string of class names, merged and optimized for use with Tailwind CSS.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function logError(error: any) {
  toast.error(error.message || "An unknown error occurred");
  if (process.env.NODE_ENV === "development") console.log(error);
}
