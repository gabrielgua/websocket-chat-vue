import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import "./assets/style.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.component("fa-icon", FontAwesomeIcon);

app.mount("#app");
