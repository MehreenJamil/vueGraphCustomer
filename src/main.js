// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";

import vueResource from "vue-resource";
import Customers from "./components/Customers";
import App from "./App.vue";
import Add from "./components/add";
import CustomerDetail from "./components/CustomerDetail";
import activeUserChart from "./components/activeUserChart";
import PortalVue from "portal-vue";
import WorkerServiceLog from "./components/WorkerServiceLog";

import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import Chartkick from "vue-chartkick";
import Chart from "chart.js";

import VueDropdown from "vue-dynamic-dropdown";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import * as VueGoogleMaps from "vue2-google-maps";

import "reflect-metadata"; // Import only once

import serviceContainer from "./service-container";
import appContainer from "./app_container.ts";

Vue.use(BootstrapVue);

Vue.use(IconsPlugin);

Vue.use(Chartkick.use(Chart));
Vue.use(VueMaterial);
Vue.use(Vuex);
Vue.use(vueResource);
Vue.use(VueRouter);
Vue.use(PortalVue);
Vue.component("vue-dropdown", VueDropdown);

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyCF_a2pylJXSLYP9eYyMRlPSByYzd61V7M",
    libraries: "places" // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
  }
});

//Vue.config.productionTip = false;

const router = new VueRouter({
  mode: "history",
  base: __dirname,
  routes: [
    { path: "/", component: Customers },
    { path: "/workerService", component: WorkerServiceLog },
    { path: "/add", component: Add },
    { path: "/activeUserChart", component: activeUserChart },
    { path: "/customers", component: Customers },
    {
      path: "/detail/:id",
      component: CustomerDetail,
      name: "detail"
    }
  ]
});
/* eslint-disable no-new */

new Vue({
  router,
  provide: appContainer,

  template: `<div id="app">
  
  
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark ">
  <a class="navbar-brand" href="/">GVInsight</a>
  <button class="navbar-toggler" data-toggle="collapse" data-target="#navbarsMenu">
  <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarsMenu">
  <ul class="navbar-nav">
  <li class="nav-item">
 
  <router-link to="/add" class="nav-link"> <i class="fa fa-address-book-o" aria-hidden="true"></i> Add</router-link>
  </li>
 
    <li class="nav-item">
    <router-link to="/workerService" class="nav-link"><i class="fa fa-cog" aria-hidden="true"></i>WorkerService Log</router-link>
     
      </li>
      <li class="nav-item">
      <router-link to="/activeUserChart" class="nav-link"><i class="fa fa-users" aria-hidden="true"></i>Active User(s)</router-link>
       
        </li>
  </ul>
   
 
   
  </div>
</nav>
  <router-view></router-view>
  </div>
  `
}).$mount("#app");
