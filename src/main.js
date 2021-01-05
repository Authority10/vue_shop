import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入第三方树形结构插件
import TreeTable from 'vue-table-with-tree-grid'

//导入网络请求模块axios
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
axios.interceptors.request.use(config =>{
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
});
Vue.prototype.$http = axios;


Vue.config.productionTip = false;
Vue.component('tree-table',TreeTable)

//全局过滤器
Vue.filter('dataFormat',function (originValue) {
  const dt = new Date(originValue);

  const year = dt.getFullYear();
  const month = (dt.getMonth() +1+"").padStart(2,'0');
  const day = (dt.getDate() +1+"").padStart(2,'0');

  const hour = (dt.getHours() +1+"").padStart(2,'0');
  const minute = (dt.getMinutes() +1+"").padStart(2,'0');
  const second = (dt.getSeconds() +1+"").padStart(2,'0');

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
