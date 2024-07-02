
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/style.css';

import { library } from '@fortawesome/fontawesome-svg-core'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faComments, faAdd, faMagnifyingGlass, faUser, faUsers, faComment } from '@fortawesome/free-solid-svg-icons'

library.add(faComments, faAdd, faMagnifyingGlass, faUser, faUsers, faComment);

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.component('fa-icon', FontAwesomeIcon);

app.mount('#app')
