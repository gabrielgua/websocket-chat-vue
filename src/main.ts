import vueDebounce from "vue-debounce";
import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import "./assets/style.css";
import vClickOutside from "click-outside-vue3";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

library.add(fas);
library.add(fab);
library.add(far);

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(vClickOutside);
app.directive(
  "debounce",
  vueDebounce({ lock: true, trim: true, cancelOnEmpty: true })
);
app.component("fa-icon", FontAwesomeIcon);

app.mount("#app");
