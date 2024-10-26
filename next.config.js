const withPWA = require('next-pwa')({
    dest: 'public', // Output directory for service worker
    register: true, // Automatically register service worker
    skipWaiting: true, // Activate new service worker immediately
  });

module.exports = withPWA({
    compiler: {
        styledComponents: true,
    },
});