import { chat } from "./pages/chat/chat";
import { welcome } from "./pages/welcome/welcome";

const routes = [
    {
        path: /\/welcome/,
        component: welcome,
    },
    {
        path: /\/chat/,
        component: chat,
    }
];

export function initRouter(container: HTMLElement) { //inicializa el router
    function goTo(path: string) { //funcion que redirige
        history.pushState(null, '', path);
        handleRoute(path);
    }
    function handleRoute(route: string) { //maneja la ruta
        for (const r of routes) {
            if (r.path.test(route)) { //si la ruta coincide
                const el = r.component({ goTo: goTo }); //crea el elemento
                if (container.firstElementChild) { //si hay un elemento
                    container.firstElementChild.remove(); //lo remueve
                }
                container.appendChild(el); //agrega el elemento
            }
        }
    }
    if (location.pathname === '/') { //si la ruta es '/'        
        goTo('/welcome'); //redirige a welcome
    } else {
        handleRoute(location.pathname); //maneja la ruta
    }
    window.addEventListener('popstate', () => handleRoute(window.location.pathname)); //escucha los cambios
}
