import createNextIntlPlugin from "next-intl/plugin";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const withNextIntl = createNextIntlPlugin();

const remotePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "api-ibs.test",
    port: "", // จำเป็น
    pathname: "/storage/uploads/**",
  },
];

const nextConfig = {
  images: {
    remotePatterns,
    minimumCacheTTL: 60,
  },
  sassOptions: {
    additionalData: `$var: red;`,
  },
};

export default withNextIntl(nextConfig);
