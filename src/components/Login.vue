<template>
   <div class="login_container">
     <div class="login_box">
       <!--头像区域-->
       <div class="avatar_box">
         <img src="../assets/logo.png" alt="">
       </div>
       <!--登录区域-->
       <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
         <!--账号-->
         <el-form-item prop="username">
           <!--element-ui库自带的icon或者第三方iconfont-->
           <el-input
                   v-model="loginForm.username"
                   prefix-icon="iconfont icon-icon-test10"></el-input>
         </el-form-item>
         <!--密码-->
         <el-form-item prop="password">
           <el-input
                   v-model="loginForm.password"
                   prefix-icon="iconfont icon-icon-test5"
                   type="password"></el-input>
         </el-form-item>
         <!--按钮-->
         <el-form-item class="buttons">
           <el-button type="primary" @click="login">登录</el-button>
           <el-button type="info" @click="resetLoginForm">重置</el-button>
         </el-form-item>
       </el-form>
     </div>
   </div>
</template>

<script>
  export default {
    name: "Login",
    data(){
      return {
        //账号和密码的双向绑定
        loginForm:{
          username:'',
          password:''
        },
        //表单验证规则
        loginFormRules:{
          //账号验证规则
          username:[
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          //密码验证规则
          password:[
            { required: true, message: '请输入登录秘密', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      //点击重置按钮，清空用户名和账号
      resetLoginForm(){
        // console.log(this)
        this.$refs.loginFormRef.resetFields()
      },
      //点击登录界面进行数据预校验，判断是否满足loginFormRules
      login(){
        this.$refs.loginFormRef.validate(async valid =>{
          if(!valid) return;
          //对象结构
          const { data : res} = await this.$http.post('/login',this.loginForm);
          // console.log(res);
          if(res.meta.status !== 200){
            return this.$message.error('登录失败')
          }
          this.$message.success('登录成功');
          //将服务器返回的token保存到sessionStorage
          window.sessionStorage.setItem('token',res.data.token);
          //跳转路由进入到home界面
          this.$router.push('/home')

          //1.将登陆成功之后服务器返回的token保存到客户端的sessionStorage中
              //1.1 只有登录成功之后拿到token才有资格访问其他接口
              //1.2 token只在网页打开阶段有效，所以保存到sessionStorage而不是localStorage
          //2.通过编程式导航跳转到后台主页，路由地址为/home
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .login_container {
    height: 100%;
    background-color: #2b4b6b;
  }
  .login_box {
    height: 300px;
    width: 450px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
  }
</style>