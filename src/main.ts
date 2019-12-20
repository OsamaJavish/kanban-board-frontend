import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import moment from 'moment';
import 'vue-awesome/icons'


import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.filter('formatDate', function (value: any) {
    if (value) {
        return moment(String(value)).format('MM/DD/YYYY')
    }
});

Vue.use(BootstrapVue);


Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');
