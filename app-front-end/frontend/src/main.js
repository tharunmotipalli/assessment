import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import SearchBar from './components/SearchBar.vue'
import router from './router'
Vue.config.productionTip = false
Vue.component('SearchBar',SearchBar)

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
