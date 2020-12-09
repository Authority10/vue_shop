import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login";
import Home from "../components/Home";
import Welcome from "../components/Welcome";
import Users from "../components/user/Users";
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
