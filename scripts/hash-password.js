const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
    console.error('Usage: node scripts/hash-password.js "YourPassword"');
    process.exit(1);
}

bcrypt
    .hash(password, 10)
    .then((hash) => {
        console.log(hash);
    })
    .catch((error) => {
        console.error('Hashing failed:', error.message);
        process.exit(1);
    });
