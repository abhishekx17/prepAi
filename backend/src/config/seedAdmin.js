const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('[SEED] ADMIN_EMAIL or ADMIN_PASSWORD not set in environment. Skipping auto-seeding.');
    return;
  }

  try {
    const email = adminEmail.trim().toLowerCase();
    
    let admin = await userModel.findOne({ email });

    if (admin) {
      // Sync admin role and tier, but DO NOT overwrite the password (so your password changes are kept!)
      admin.role = 'admin';
      admin.isVerified = true;
      admin.tier = 'Enterprise';
      await admin.save();
      console.log(`[SEED] Admin account verified and role synced: ${email}`);
    } else {
      // Hash password only for new creation
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      // Create new admin account
      await userModel.create({
        username: 'admin',
        email,
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        tier: 'Enterprise',
      });
      console.log(`[SEED] New admin account seeded: ${email}`);
    }
  } catch (error) {
    console.error('[SEED] Failed to seed admin account:', error);
  }
}

module.exports = seedAdmin;
