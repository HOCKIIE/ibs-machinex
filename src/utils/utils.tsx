import { BlogFormProps } from "@/types/BlogType";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn = clsx + tailwind-merge (ป้องกัน class ซ้ำกัน เช่น px-2 px-4)
export function cn(...inputs: string[]) {
    return twMerge(clsx(inputs));
}

export function mergeClassNames(...classes: (string | undefined)[]) {
    const set = new Set(
        classes
        .filter(Boolean)
        .flatMap(cls => cls!.split(" ").filter(c => c.trim()))
    );
    return Array.from(set).join(" ");
}

export function removeDuplicateClasses(classString?: string) {
    if (!classString) return "";
    return Array.from(
        new Set(
        classString
            .trim()
            .split(/\s+/) // แยกด้วย space
            .filter(Boolean) // กันค่าว่าง
        )
    ).join(" ");
}

export function filterClasses(classString: string) {
    return classString
            .split(/\s+/)
            .map((c:string) => c.trim())
            .filter((c:string) => c && c !== 'undefined' && c !== 'null')

}

export function setBlogChanged<K extends keyof BlogFormProps>(
    target: Partial<BlogFormProps>,
    key: K,
    value: BlogFormProps[K]
) {
    target[key] = value;
}

export function isEqual(a: any, b: any) {
    if (a === b) return true;

    // array of primitive
    if (Array.isArray(a) && Array.isArray(b)) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    // object
    if (typeof a === "object" && typeof b === "object") {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    return false;
}