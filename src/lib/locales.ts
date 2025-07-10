export const getSupportedLocales = () => {
    const raw = process.env.NEXT_PUBLIC_LANGUAGE || 'th';
    return raw.split('|').map((lang) => lang.trim().toLowerCase());
};