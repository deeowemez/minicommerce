/**
 * scripts/setAdminRole.js
 *
 * This script initializes Firebase Admin using a service account and assigns
 * the custom claim { role: "admin" } to a Firebase Auth user. The target user's
 * UID must be provided as a command-line argument. It logs success or error
 * messages accordingly.
 *
 * Example usage:
 *   node scripts/setAdminRole.js <UID>
 *
 * Example:
 *   node scripts/setAdminRole.js aBcDeFgHiJkLmNoP12345
 */

import admin from 'firebase-admin';
import serviceAccount from '../secrets/serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = process.argv[2];

if (!uid) {
  console.error('Please provide a UID');
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { role: 'admin' })
  .then(() => {
    console.log(`Role 'admin' set for UID: ${uid}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error setting role:', error);
    process.exit(1);
  });
