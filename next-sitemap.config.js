/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://kcos-review-jp.vercel.app',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    additionalSitemaps: ['https://kcos-review-jp.vercel.app/sitemap.xml'],
  },
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
}
