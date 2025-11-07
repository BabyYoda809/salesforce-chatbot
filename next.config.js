// next.config.js (at project root)
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // allow framing from any origin — OR replace '*' with your site domain for security
          { key: 'X-Frame-Options', value: 'ALLOWALL' },
          // or use CSP frame-ancestors
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://salesforce-chatbot-z2uv.vercel.app;" }
        ],
      },
    ]
  },
}
