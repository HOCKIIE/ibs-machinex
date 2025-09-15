import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn = clsx + tailwind-merge (ป้องกัน class ซ้ำกัน เช่น px-2 px-4)
export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}
