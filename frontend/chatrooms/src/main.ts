import { initButton } from './components/button/button';
import { initInput } from './components/input/my-input';
import { initOption } from './components/option/my-option';
import {state} from './state';
import { initRouter } from './router';
import './style.css';


(function () {
  initButton();
  initInput();
  initOption();
  state.init();
  const app = document.getElementById('app');
  if (app) {
    initRouter(app);
  }
})();
