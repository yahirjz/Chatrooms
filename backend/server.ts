// Importamos la instancia de Firestore que configuramos en db.ts.
import { firestore, rtdb } from "./db";

// Importamos express
import express from "express";
import path from "path";

// Importamos uuid
import { nanoid } from "nanoid";

// Importamos cors
import cors from "cors";

// Creamos una instancia de express
const app = express();
// Creamos un puerto
const port = process.env.PORT || 3000; // asignamos el puerto


// Usamos cors
app.use(cors());
// Usamos express.json
app.use(express.json());

//collections 
const userCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

// Servir archivos estáticos del frontend
// Servir archivos estáticos del frontend
const distPath = path.resolve(__dirname, "../../frontend/chatrooms/dist");
app.use(express.static(distPath));

// ----- endpoint singup(crear un usuario) -----
app.post("/signup", (req, res) => { // Ruta que escucha las peticiones POST
    const { email, name } = req.body; // Extraemos el email y el nombre del cuerpo de la peticion(body)

    //Atesamos de crear un usuario consulta a la base de datos para ver si existe alguien con el email
    userCollection.where("email", "==", email) //filtra los usuarios buscando conxidencia con el email
        .get() //Ejecuta la consulta o consulta a la base de datos
        .then((searchResponse) => {
            if (searchResponse.empty) { //Si no existe alguien con el email, empty es para ver si esta vacio es un booleano
                userCollection.add({ //Agrega un nuevo usuario
                    email,
                    name,
                })
                    .then(newUser => { //Envia el la referencia id del nuevo usuario
                        res.json({
                            id: newUser.id,

                        });
                    })
            } else {
                res.json({
                    id: searchResponse.docs[0].id,
                });
            }
        })

})


// ----- endpoint para crear un chatroom----- 
app.post("/rooms", (req, res) => {
    const { userId } = req.body;

    userCollection.doc(userId.toString())
        .get()
        .then(doc => {
            if (doc.exists) {
                const roomRef = rtdb.ref("rooms/" + nanoid());
                roomRef.set({
                    messages: [],
                    owner: userId,
                })
                    .then(() => {
                        const roomLongId = roomRef.key;
                        const roomShortId = 1000 + Math.floor(Math.random() * 999);
                        // Usamos firestore.collection("rooms") directamente
                        firestore.collection("rooms").doc(roomShortId.toString()).set({
                            rtdbRoomId: roomLongId,
                        }).then(() => {
                            res.json({
                                id: roomShortId.toString(),
                            });
                        });
                    });
            } else {
                res.status(401).json({
                    error: "User not found"
                });
            }
        });
});

// -----endpoint de optener chatroom ----
app.get("/rooms/:roomId", (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "Missing userId query param" });
    }

    userCollection.doc(userId.toString()).get().then(doc => {
        if (doc.exists) {
            roomsCollection.doc(roomId.toString())
                .get()
                .then(snap => {
                    if (!snap.exists) {
                        return res.status(404).json({ error: "Room not found" });
                    }
                    const data = snap.data();
                    res.json(data);
                });
        } else {
            res.status(401).json({
                error: "Room not found"
            });
        }
    })

})

// ----- endpoint messages  RTDB----- 
app.post("/messages", (req, res) => {
    const { roomId, from, message } = req.body;

    // Buscamos el roomLongId en Firestore usando el roomId corto
    console.log("Recibido mensaje para room:", roomId, "de:", from, "mensaje:", message);

    if (!roomId) {
        return res.status(400).json({ error: "Missing roomId" });
    }

    firestore.collection("rooms").doc(roomId.toString()).get()
        .then(doc => {
            console.log("Firestore doc encontrado:", doc.exists);
            if (doc.exists) {
                const roomData = doc.data();
                const rtdbRoomId = roomData.rtdbRoomId;
                console.log("Escribiendo en RTDB ID:", rtdbRoomId);

                const chatroomRef = rtdb.ref("/rooms/" + rtdbRoomId + "/messages");

                chatroomRef.push({
                    from,
                    message,
                }, function () {
                    res.json("todo bien");
                });
            } else {
                console.log("Room no encontrado en Firestore");
                res.status(404).json({ error: "Room not found" });
            }
        });
});


// ----- endpoint chatrooms RTDB----- 
app.get("/chatrooms/", (req, res) => {
    const chatroomsRef = rtdb.ref("/chatrooms"); // Referencia a la chatroom
    chatroomsRef.once("value", (snapshot) => {
        const chatrooms = snapshot.val(); // Obtenemos los chatrooms
        res.json(chatrooms); // Enviamos los chatrooms
    });
});

// Fallback para SPA (Single Page Application)
app.get(/^(.*)$/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});


app.listen(port, () => { // Iniciamos el servidor
    console.log(`Example app listening at http://localhost:${port}`)
});
