/**
 * scripts/setAdminRole.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('../secrets/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = process.argv[2];

if (!uid) {
  console.error('❌ Please provide a UID');
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { role: 'admin' })
  .then(() => {
    console.log(`✅ Role 'admin' set for UID: ${uid}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error setting role:', error);
    process.exit(1);
  });
