require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Ensure DB connection
require('../config/db');

async function run() {
  try {
    const email = process.env.CREATE_ADMIN_EMAIL || 'bootstrap_admin@local';
    const pass = process.env.CREATE_ADMIN_PASS || 'AdminPass123';

    const exists = await User.findOne({ email });
    if (exists) {
      console.log('ℹ️ Admin already exists:', email);
      process.exit(0);
    }

    const hash = bcrypt.hashSync(pass, 10);
    const u = await User.create({ first_name: 'Bootstrap', last_name: 'Admin', email, phone: '0000000000', password: hash, role: 'admin' });
    console.log('✅ Created admin:', u.email, '\nUse credentials ->', email, pass);
    process.exit(0);
  } catch (err) {
    console.error('❌ createAdmin error:', err.message || err);
    process.exit(1);
  }
}

run();
