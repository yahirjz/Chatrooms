export function initInput() {
    class MyInput extends HTMLElement {
        shadow = this.attachShadow({ mode: 'open' });
        constructor() {
            super();
        }
        connectedCallback() {
            //Buscamos el atributo type si no existe le damos valor text
            const type = this.getAttribute('type') || 'text';
            this.render(type);
        }
        get value() {
            //obtenemos el valor del input real 
            const input = this.shadow.querySelector('input');
            //retornamos el valor del input real si no existe retornamos un string vacio
            return input?.value || '';
        }
        set value(val) {
            //asignamos el valor del input real
            const input = this.shadow.querySelector('input');
            //asignamos el valor del input real si no existe retornamos un string vacio
            if (input) input.value = val;
        }
        render(type: string) {
            this.shadow.innerHTML = `
            <style>
                .container-input{
                    display: flex;
                    flex-direction: column;
                    width:312px;
                    height:56px;
                    padding: 16px;
                }
                .label-input{
                    margin-bottom: 5px;
                    font-size: 18px;
                    font-weight: 500;
                }  
                .input{
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                    border: 1px solid #D9D9D9;
                    padding: 16px;
                    font-size: 16px;
                    color: #333;
                }
            </style>

            <div class="container-input">
                <label class="label-input"><slot></slot></label>
                <input class="input" type="${type}" name="${this.getAttribute('name')}" />
            </div>
            `;
        }
    }
    customElements.define('my-input', MyInput);

}