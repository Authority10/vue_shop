<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="quit">退出</el-button>
    </el-header>
    <!--页面主体区域-->

    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409EFF"
                unique-opened
                :collapse="isCollapse"
                :collapse-transition="false"
                router
                :default-active="activePath">
          <!--一级菜单-->
          <el-submenu :index="item.id.toString()" v-for="(item,index) in menuslist" :key="item.id">
            <!--一级菜单的模板区域-->
            <template slot="title">
              <i :class="icons[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item
                    :index="'/' + subItem.path"
                    v-for="subItem in item.children"
                    :key="subItem.id"
                    @click="saveNavState('/' + subItem.path)">
              <!--二级菜单的模板区域-->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data(){
      return{
        //左侧菜单栏数据
        menuslist:[],
        //二级菜单的图标
        icons:[
          'iconfont icon-icon-test11',
          'iconfont icon-icon-test5',
          'iconfont icon-icon-test9',
          'iconfont icon-icon-test8',
          'iconfont icon-icon-test7',
        ],
        //左侧导航栏是否为折叠，默认是不折叠
        isCollapse:false,
        //被激活的二级菜单路径
        activePath:''
      }
    },
    created() {
      //获取左侧菜单栏数据
      this.getMenuList();
      //获取被激活的二级菜单路径
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods:{
      //退出功能
      quit(){
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      //获取左侧菜单栏数据
      async getMenuList(){
       const {data:res} =await this.$http.get('/menus');
       if(res.meta.status!==200){
         this.$message.error(res.meta.msg)
       }
       this.menuslist = res.data
      },
      //点击按钮切换左侧菜单栏的折叠与展开
      toggleCollapse(){
        this.isCollapse = !this.isCollapse
      },
      //保存当前活跃路由到sessionStorage
      saveNavState(activePath){
        // console.log(this.$route);
        window.sessionStorage.setItem('activePath',activePath);
        this.activePath = activePath
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    color: #fff;
    > div {
      display: flex;
      align-items: center;
      > span {
        margin-left: 15px;
      }
    }
    img {
      width: 50px;
      height: 50px;
    }
  }
  .el-aside {
    background-color: #333744;
    >.el-menu {
      border-right: none ;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle-button {
    background-color:#4a5064;
    line-height: 24px;
    font-size: 10px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>