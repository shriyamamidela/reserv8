const admin = require('firebase-admin');
const serviceAccount = require('./firebaseServiceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "reserv8-c3d6b"
});

async function listUsers() {
    try {
        const listUsersResult = await admin.auth().listUsers();
        console.log("Users:", listUsersResult.users);
    } catch (error) {
        console.log("Error fetching users:", error.message);
    }
}

listUsers();
