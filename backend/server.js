// Polyfill missing browser globals for pdf-parse compatibility in Node/Vercel serverless environments
if (typeof global.DOMMatrix === 'undefined') {
  global.DOMMatrix = class DOMMatrix {};
}
if (typeof global.ImageData === 'undefined') {
  global.ImageData = class ImageData {};
}
if (typeof global.Path2D === 'undefined') {
  global.Path2D = class Path2D {};
}

require('dotenv').config();
const app = require('./src/app');
const connectToDb = require('./src/config/database');

connectToDb();

// Export app for Vercel serverless environment compatibility
module.exports = app;

// Only start the listening server if not running in a Vercel serverless context
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
