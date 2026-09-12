import crypto from 'crypto';

const password = process.argv[2];

if (!password) {
  console.log('Usage: node scripts/hash-password.mjs <your-password>');
  console.log('Generates a secure scrypt password hash for ADMIN_PASSWORD_HASH.');
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString('hex');
const derivedKey = crypto.scryptSync(password, salt, 64);
const hash = `scrypt$${salt}$${derivedKey.toString('hex')}`;

console.log('\nGenerated Scrypt Hash for Vercel Environment Variables:');
console.log('------------------------------------------------------');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log('------------------------------------------------------\n');
