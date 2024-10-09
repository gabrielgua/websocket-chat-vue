import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

import "./assets/style.css";

import { library } from "@fortawesome/fontawesome-svg-core";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faAdd,
  faArrowRight,
  faCheck,
  faChevronDown,
  faComment,
  faComments,
  faEllipsisVertical,
  faInfo,
  faMagnifyingGlass,
  faPaperPlane,
  faPen,
  faRightFromBracket,
  faUser,
  faUserGroup,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faPen,
  faAdd,
  faUser,
  faInfo,
  faUsers,
  faXmark,
  faComment,
  faComments,
  faPaperPlane,
  faMagnifyingGlass,
  faEllipsisVertical,
  faChevronDown,
  faArrowRight,
  faRightFromBracket,
  faUserGroup,
  faCheck
);

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.component("fa-icon", FontAwesomeIcon);

app.mount("#app");
