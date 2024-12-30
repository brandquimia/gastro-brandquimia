module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          fs: false,
          path: false,
          os: false,
          crypto: false,
          stream: false,
          http: false,
          https: false,
          zlib: false,
          util: false,
          url: false,
          querystring: false,
          buffer: false,
          assert: false,
          process: false
        }
      }
    }
  }
}; 