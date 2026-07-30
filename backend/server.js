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
