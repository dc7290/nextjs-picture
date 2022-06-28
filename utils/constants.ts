export const IMAGECONFIG_DEFAULT = {
  contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
  dangerouslyAllowSVG: false,
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  disableStaticImages: false,
  domains: [],
  formats: ['image/webp'],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  loader: 'default',
  minimumCacheTTL: 60,
  path: '/_next/image',
}
