const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  typescript: {
    enableTypeChecking: true,
  },
  eslint: {
    enable: true,
  },
};