import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';

admin.initializeApp();


export const getfeed = functions.https.onCall(async (req,res) => {
    const docs = await admin.firestore().collection('posts').limit(15).get();


    //res.send(docs.docs.map(doc => doc.data()));

    return docs.docs.map(doc => {
        return {
            postID: doc.id,
            ...doc.data(),
        }

    });

});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
