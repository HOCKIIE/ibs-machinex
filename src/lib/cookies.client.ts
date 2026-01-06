export const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;

    const match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
    );

    return match ? decodeURIComponent(match[2]) : null;
};

interface SetCookieOptions {
    maxAge?: number;     // seconds
    path?: string;
    sameSite?: "Lax" | "Strict" | "None";
    secure?: boolean;
}

export const setCookie = (
    name: string,
    value: string,
    options: SetCookieOptions = {}
) => {
    if (typeof document === "undefined") return;

    const {
        maxAge = 3600,
        path = "/",
        sameSite = "Lax",
        secure = false,
    } = options;

    let cookie = `${name}=${encodeURIComponent(value)}; path=${path}; max-age=${maxAge}; SameSite=${sameSite}`;

    if (secure) cookie += "; Secure";

    document.cookie = cookie;
};
