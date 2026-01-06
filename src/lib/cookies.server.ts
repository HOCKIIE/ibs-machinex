import { cookies } from "next/headers";

export const getCookie = (name: string): string | undefined => {
    return cookies().get(name)?.value;
};

interface SetCookieOptions {
    maxAge?: number; // seconds
    path?: string;
    sameSite?: "lax" | "strict" | "none";
    secure?: boolean;
}

export const setCookie = (
    name: string,
    value: string,
    options: SetCookieOptions = {}
) => {
    const {
        maxAge = 3600,
        path = "/",
        sameSite = "lax",
        secure = false,
    } = options;

    cookies().set({
        name,
        value,
        maxAge,
        path,
        sameSite,
        secure,
    });
};
