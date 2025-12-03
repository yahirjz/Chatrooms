import { state } from '../../state'
type Message = {
    from: string;
    message: string;
}
export function chat(_params: any) {
    const messages: Message[] = [];
    const currentState = state.getState();
    // Iniciamos la conexión a la sala (SOLO UNA VEZ)
    if (currentState.roomId && !currentState.rtdbRoomId) {
        state.getRoom();
    }
    const div = document.createElement('div');
    div.innerHTML = `
    <style>
    .title{
        color: #fff;
    }
        .messages{
            height: 300px;
            overflow-y: scroll;
            background-color: #F5F5F5;  
            border-radius: 8px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .message-container {
            max-width: 70%;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 5px;
        }
        .my-message {
            background-color: #B9F6CA;
            align-self: flex-end;
            text-align: right;
        }
        .other-message {
            background-color: #E0E0E0;
            align-self: flex-start;
            text-align: left;
        }
        .label {
            font-size: 12px;
            color: #555;
            margin-bottom: 2px;
        }
        .submit-form{
            display: flex;
            flex-direction: row;
            gap: 10px;
            padding: 16px;
        }
    </style>    
    <header>
        <h1 class="title">Chat</h1>
        <p>Room id: ${currentState.roomId}</p>
    </header>

    <div class="messages">
        ${messages.map(message => {
        const isMyMessage = message.from === currentState.name;
        const messageClass = isMyMessage ? 'my-message' : 'other-message';
        return `
                <div class="message-container ${messageClass}">
                    <div class="label">${message.from}</div>
                    <div>${message.message}</div>
                </div>
            `;
    }).join('')}
    </div>

    <form class="submit-form">
        <input type="text" id="message" name="new-message">
        <button type="submit">Enviar</button>
    </form>
    `;

    // Nos suscribimos al estado para escuchar cambios
    state.subscribe(() => {
        const currentState = state.getState();
        console.log(currentState);
        const messages = currentState.message;
        console.log(messages);
        const messagesContainer = div.querySelector('.messages');
        // Si el contenedor de mensajes existe, actualizamos su contenido
        if (messagesContainer && Array.isArray(messages)) {
            console.log("Renderizando mensajes:", messages);
            // Mapeamos los mensajes del estado a elementos HTML y actualizamos el innerHTML
            messagesContainer.innerHTML = messages.map((message: Message) => {
                const isMyMessage = message.from === currentState.name;
                const messageClass = isMyMessage ? 'my-message' : 'other-message';
                return `
                    <div class="message-container ${messageClass}">
                        <div class="label">${message.from}</div>
                        <div>${message.message}</div>
                    </div>
                `;
            }).join('')
        } else {
            console.log("No hay mensajes para renderizar o el contenedor no existe");
        }
    })
    const form = div.querySelector('.submit-form') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        state.pushMessage(target["new-message"].value); //
        // Limpiamos el input después de enviar el mensaje
        const input = div.querySelector('#message') as HTMLInputElement;
        input.value = '';
    });

    return div;
}
