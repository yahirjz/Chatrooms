import * as admin from "firebase-admin";
import "dotenv/config"; 

//inicializamos la app
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
  databaseURL: "https://chatrooms-be85c-default-rtdb.firebaseio.com/"
});
const firestore = admin.firestore();
const rtdb = admin.database(); //leer , escribir, actulizar y borrar datos en tiempo real

export { firestore, rtdb }; //exportamos para usar en otros archivos
