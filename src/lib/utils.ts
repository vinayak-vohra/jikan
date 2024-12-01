import { STATUS, StatusColors } from "@/features/tasks/tasks.types";
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

export function toTitleCase(str: string) {
  return (
    str
      // convert to lower case
      .toLowerCase()

      // replace underscores with spaces
      .replace(/_/g, " ")

      // capitalize the first letter of each word
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export function parseAsDate(date: string | Date): Date {
  if (typeof date === "string") {
    return new Date(date);
  }
  return date;
}

type TwClasses = { [K in "bg" | "text" | "border"]?: number };

export function createTWClasses(cls: TwClasses, status: STATUS) {
  return Object.entries(cls)
    .map(([key, value]) => `${key}-${StatusColors[status]}-${value}`)
    .join(" ");
}

export function convertNullToUndefined(value: object) {
  return {
    ...Object.entries(value).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value ?? undefined }),
      {}
    ),
  };
}
