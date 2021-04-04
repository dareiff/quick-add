const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
module.exports = withPWA({
  future: {
    webpack5: true,
  },
  // other next config
});
