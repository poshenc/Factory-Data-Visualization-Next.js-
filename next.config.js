/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'standalone',
    experimental: {
        instrumentationHook: true,
    },
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/u-chart',
                permanent: true
            }
        ]
    }
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
