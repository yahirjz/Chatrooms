export function initOption() {
    class MyOption extends HTMLElement {
        shadow = this.attachShadow({ mode: 'open' });
        constructor() {
            super();
        }
        connectedCallback() {
            const value = this.getAttribute('value'); //obtiene el value
            if (value == 'existente' || value == 'nuevo') { //si es nuevo o existente
                this.render(value);     //renderiza el select
            }
        }
        render(value: string) { //renderiza el select
            this.shadow.innerHTML = `
            <style>
                .hidden { /* oculta el div */
                    display: none;
                }
                .container-select{
                    display: flex;
                    flex-direction: column;
                    
                   padding: 16px;
                }
                .label-select{
                    margin-bottom: 5px;
                    font-size: 18px;
                    font-weight: 500;
                }
                .select{
                    width: 345px;
              
                    border-radius: 8px;
                    border: 1px solid #D9D9D9;
                    padding: 16px;
                    font-size: 16px;
                    color: #333;
                }
                .container-input-select{
                    width: 312px;    
                    padding: 16px; 
                }                
                .input-select{
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                    border: 1px solid #D9D9D9;
                    padding: 16px;
                    font-size: 16px;
                    color: #333;
                }                
            </style>

            <div class="container-select">
                <label class="label-select"><slot></slot></label>
                <select id="room-select" class="select">
                    <option value="nuevo">Nuevo Room</option>
                    <option value="existente">Room Existente</option>
                </select>
            </div>
            
            <div id="room-id-container" class="hidden container-input-select">
                <label class="label-select">Room id </label>
                <input type="text" id="room-id" class="input-select">
            </div>
            `;

            const select = this.shadow.getElementById('room-select') as HTMLSelectElement; //obtiene el select
            const container = this.shadow.getElementById('room-id-container') as HTMLElement; //obtiene el div

            /* Set inicial value si se proporciona */
            if (value) {
                select.value = value;
            }

            /* Funcion para actualizar la visibilidad */
            const updateVisibility = () => {
                if (select.value === 'existente') {
                    container.classList.remove('hidden');
                } else {
                    container.classList.add('hidden');
                }
            };

            /* Check inicial */
            updateVisibility();

            /* Escucha los cambios */
            select.addEventListener('change', () => {
                updateVisibility();
            });
        }
    }
    customElements.define('my-option', MyOption);
}