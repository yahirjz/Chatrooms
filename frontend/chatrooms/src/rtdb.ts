// Firebase
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {                                                    //configuracion de firebase
  apiKey: "AIzaSyAHMm8nBTyoyXKzCRsmkcc9hJOhYfHPi8U",                        //clave de firebase
  authDomain: "chatrooms-be85c.firebaseapp.com",                            //dominio de firebase
  databaseURL: "https://chatrooms-be85c-default-rtdb.firebaseio.com/",       //url de firebase
  projectId: "chatrooms-be85c",                                             //id de firebase
  storageBucket: "chatrooms-be85c.firebasestorage.app",                     //bucket de firebase
  messagingSenderId: "887431417780",                                        //id de firebase
  appId: "1:887431417780:web:6ec4343212b41ca3bface1",                      //id de firebase
  measurementId: "G-JVLQQLSNR1"                                              //id de firebase
};
firebase.initializeApp(firebaseConfig); //inicializa firebase

//tenemos que crear una base de datos despues de inicializar firebase
const rtdb = firebase.database(); //crea una base de datos

export { rtdb };
