import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import Home from "../components/Home";
import Welcome from "../components/Welcome";
import Users from "../components/user/Users";
import Rights from "../components/rightsManage/rights/Rights";
import Roles from "../components/rightsManage/roles/Roles";
import Cate from "../components/goods/Cate";
import Params from "../components/goods/Params";
import List from "../components/goods/List";
import Add from "../components/goods/Add";
import Order from "../components/order/Order";
import Report from "../components/report/Report";
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Cate},
      {path:'/params',component:Params},
      {path:'/goods',component:List},
      {path:'/goods/add',component:Add},
      {path:'/orders',component:Order},
      {path:'/reports',component:Report},
    ]
  },
];

const router = new VueRouter({
  routes
});

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to表示从哪个路径来
  //from表示准备跳转到哪个路径
  //next表示放行函数   next() 直接放行  next('/login')强制跳转路径
  if(to.path==='/login'){
    next()
  }
  //获取之前储存好的token
  const tokenStr = window.sessionStorage.getItem('token')
  //不存在token强制去登录界面
  if(!tokenStr){
    next('/login')
  }
  //不是不存在token的情况(有点绕)   直接放行
  // next()
  if(tokenStr){
    next()
  }
});

export default router
