export function initButton() {
    class Button extends HTMLElement {
        shadow = this.attachShadow({ mode: 'open' });
        constructor() {
            super();
            this.render();
        }
        connectedCallback() {
            this.addListeners();
        }
        addListeners() {
            const btn = this.shadow.querySelector('.btn');
            if (btn) {
                btn.addEventListener('click', (e) => {

                    // this.closest busca hacia arriba en el light DOM porque 'this' es el custom element
                    const form = this.closest('form');
                    if (form) {
                        e.preventDefault(); // Evitar doble submit si por alguna razón pasara
                        form.requestSubmit();
                    }
                });
            }
        }
        render() {
            this.shadow.innerHTML = `
            <style>
                .btn-container{
                    padding: 16px;
                    width: 345px;
                }
                .btn{
                   width: 100%;
                   height: 55px;
                   border: 1px solid #9CBBE9;
                   border-radius: 8px;
                   font-size: 22px;
                   font-weight: 500;
                   background-color:#9CBBE9;
                   cursor: pointer;
                   transition: background-color 0.3s ease;
                   box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                }
                .btn:hover{
                    background-color:#6C9CE9;
                }
               
            </style>
            <div class="btn-container">
                <button class="btn"><slot></slot></button>
            </div>
           
            `;
        }
    }
    customElements.define('my-button', Button);
}   