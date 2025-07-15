import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: false, // Disable Strict Mode
    images: {
        remotePatterns: [
          {
            protocol: "http",
            hostname: "127.0.0.1",
            port: "3000",
          }
        ]
    },
    sassOptions: {
        additionalData: `$var: red;`,
    }
};

export default withNextIntl(nextConfig);
