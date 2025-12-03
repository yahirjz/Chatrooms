import { rtdb } from './rtdb';
import map from 'lodash/map';
const API_BASE_URL = 'http://localhost:3000';  //url de la api

const state = {
    data: {
        name: '',
        email: '',
        message: [],
        roomId: '',
        rtdbRoomId: '',
    },
    listeners: [] as ((any: any) => any)[],

    //Inicializacion
    init() {
        // Ya no escuchamos aquí por defecto
    },

    listenRoom() {
        const currentState = this.getState();
        console.log("Escuchando mensajes en RTDB path:", '/rooms/' + currentState.rtdbRoomId + '/messages');
        const chatroomRef = rtdb.ref('/rooms/' + currentState.rtdbRoomId + '/messages');

        chatroomRef.on('value', (snapshot) => {
            const messagesFromServer = snapshot.val();
            console.log("Mensajes recibidos del servidor:", messagesFromServer);
            const messagesList = map(messagesFromServer);
            currentState.message = messagesList;
            this.setState(currentState);
        }, (error) => {
            console.error("Error en RTDB listener:", error);
        });
    },

    getState(): any {
        return this.data;
    },


    // pedir sala
    getRoom() {
        const currentState = this.getState();
        const roomId = currentState.roomId;
        const userId = currentState.userId;

        if (roomId && userId) {
            fetch(API_BASE_URL + '/rooms/' + roomId + '?userId=' + userId)
                .then(res => res.json())
                .then(data => {
                    console.log("Room data:", data);
                    currentState.rtdbRoomId = data.rtdbRoomId;
                    this.setState(currentState);

                    // Escuchamos los mensajes de esta sala
                    this.listenRoom();
                });
        } else {
            console.error("Falta roomId o userId");
        }
    },
    //Seteo del email
    setEmail(email: string) {
        const currentState = this.getState(); // obtenemos la copia del state
        currentState.email = email; //Modificamos la propiedad con el nuevo email que le pasamos
        this.setState(currentState); //Guarda el estado modificado y avisa a los demas componentes que esten escuchando
    },
    //Seteo del nombre
    setNombre(name: string) {
        const currentState = this.getState(); // obtenemos la copia del state
        currentState.name = name; //Modificamos la propiedad con el nuevo nombre que le pasamos
        this.setState(currentState); //Guarda el estado modificado y avisa a los demas componentes que esten escuchando
    },

    //Seteo del roomId manualmente
    setRoomId(roomId: string) {
        const currentState = this.getState();
        currentState.roomId = roomId;
        this.setState(currentState);
    },

    //Envio del mensaje a la APIA
    pushMessage(message: string) {
        const nombreDelState = this.data.name; // obtenemos el nombre del state que guardamos en setNombre
        const roomId = this.data.roomId; // obtenemos el roomId del state que guardamos en setRoomId
        console.log("Enviando mensaje. RoomId:", roomId, "From:", nombreDelState, "Message:", message);

        fetch(API_BASE_URL + '/messages', { // enviamos el nombre y el mensaje a la api 
            method: 'POST', // indicamos que vamos a crear un nuevo mensaje
            headers: {
                'Content-Type': 'application/json', // indicamos que el contenido es json
            },
            body: JSON.stringify({ // convertimos el objeto a json
                from: nombreDelState,
                message: message,
                roomId: roomId, //enviamos el roomId al backend
            }),
        })
    },
    //función para registrarse 
    signUp(callback: any) {
        const currenState = this.getState();

        //verificamos que haya un email antes de enviarlo
        if (currenState.email) {
            fetch(API_BASE_URL + '/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: currenState.email,
                    name: currenState.name,
                }),
            })
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    console.log("Respuesta del servidor:", data);

                    //Guardamos el ID que nos devuelve el backend
                    currenState.userId = data.id;
                    this.setState(currenState);

                    //si nos pasaron una callback la ejecutamos
                    if (callback) {
                        callback();
                    }
                })
        }
    },
    //pedir una nueva sala
    askNewRoom(callback: any) {
        const currentState = this.getState();
        if (currentState.userId) {
            fetch(API_BASE_URL + '/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: currentState.userId,
                }),
            })
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    console.log("Room creado:", data);
                    currentState.roomId = data.id; //Guardamos el ID que nos devuelve el backend
                    this.setState(currentState); //Guardamos el estado modificado

                    if (callback) {
                        callback();
                    }
                });
        } else {
            console.log("No hay userId");
        }
    },

    setState(newState: any) {
        this.data = newState;
        for (const cb of this.listeners) {
            cb(this.data);
        }
        console.log("state actualizado", this.data);
    },
    subscribe(listener: (any: any) => any) {
        this.listeners.push(listener);
    }
}

export { state }