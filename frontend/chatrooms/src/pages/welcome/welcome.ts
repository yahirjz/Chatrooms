
import "./welcome.css"; //importa el css
import { state } from "../../state";

export function welcome(_params: { goTo: (path: string) => void }) { //funcion que retorna un main
    const div = document.createElement('div'); //crea un main
    div.className = "welcome"; //le da una clase
    div.innerHTML = `
        <header class="header">
            <h1 class="title"> Bienvenido a ChatRooms</h1>
        </header>

        <form class="form">
            <my-input type="email" name="email">Email</my-input>
            <my-input type="text" name="nombre" >Nombre</my-input>
            <my-option value="nuevo">RoomExistente</my-option>
            <my-button>Comenzar</my-button>
        </form>
`;



    //obtiene el valor del input
    const form = div.querySelector('form') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement; //obtiene el valor del input, nos permite acceder a los valores de los inputs como .value, .name, .type queryselector nos permite seleccionar el valor del input
        const inputNombre = target.querySelector('my-input[name="nombre"]') as any; //obtiene el valor del input que tenga el nombre nombre
        const inputEmail = target.querySelector('my-input[type="email"]') as any;

        console.log(inputNombre?.value); //imprime el valor del input

        state.setEmail(inputEmail?.value); // capturamos el dato email
        state.setNombre(inputNombre?.value); //Guardamos el nombre en el state.setNombre

        // Obtenemos el componente my-option
        const myOption = target.querySelector('my-option') as any;
        const select = myOption.shadowRoot.querySelector('select');
        const selectValue = select.value;

        
        //llamamos a signUp
        state.signUp(() => {
            if (selectValue === "existente") {
                const roomIdInput = myOption.shadowRoot.querySelector('#room-id');
                const roomId = roomIdInput.value;
                state.setRoomId(roomId);
                _params.goTo('/chat');
            } else {
                //una vez registrado, pedimos la sala   
                state.askNewRoom(() => {
                    _params.goTo('/chat'); //cambia de pagina
                });
            }
        });

    });

    return div;
}