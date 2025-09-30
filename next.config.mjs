import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.ibsmachinex.com",
            },
        ],
    },
};

export default withNextIntl(nextConfig);
