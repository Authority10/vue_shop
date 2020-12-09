<template>
  <div>
    <!--面包屑导航-->
    <users-breadcrumb></users-breadcrumb>
    <!--卡片视图区域-->
    <users-card @changeVisible="changeVisible"></users-card>
    <!--添加用户的弹出框-->
    <user-dialog ref="userDialog" ></user-dialog>
<!--    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">-->
<!--      <span>这是一段信息</span>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button @click="addDialogVisible = false">取 消</el-button>-->
<!--        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
  import UsersBreadcrumb from "./childComps/UsersBreadcrumb";
  import UsersCard from "./childComps/UsersCard";
  import UserDialog from "./childComps/UserDialog";
  export default {
    name: "Users",
    data(){
      return {
        //请求用户数据的query参数
        queryInfo:{
          query:"",
          //当前页数
          pagenum:1,
          //当前每页显示多少
          pagesize:2
        },
        //用户列表
        userlist:[],
        //用户数量总数
        total:0,
        //控制添加用户的弹出框是否隐藏
        addDialogVisible:false
      }
    },
    components:{
      UsersBreadcrumb,
      UsersCard,
      UserDialog
    },
    created() {
      this.getUserList();
    },
    methods:{
      //获取用户列表
      async getUserList(){
       const {data:res} = await  this.$http.get('/users',{params:this.queryInfo});
        console.log(res);
        if(res.meta.status!==200){
          return this.$message.error(res.meta.msg)
        }
        this.userlist = res.data.users;
        this.total = res.data.total;
      },
      //监听每页显示多少(pagesize)的变化
      handleSizeChange(newSize){
        //将监听到的最新pagezize赋值给query中的pagesize
        this.queryInfo.pagesize = newSize;
        //使用新的pagesize去获取数据
        this.getUserList()
      },
      //监听页码值(pagenum)的改变
      handleCurrentChange(newPage){
        //将监听到的最新pagenum赋值给query中的pagesize
        this.queryInfo.pagenum = newPage;
        this.getUserList()
      },
      //监听switch状态的改变
      async userStateChange(userInfo){
        // let userState = userInfo.mg_state;
        // let uId = userInfo.id

        // 发起请求修改服务器的用户状态
        const {data:res} = await  this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        console.log(res);
        // 修改失败
        if(res.meta.status!==200){
          //将客户端修改的状态重置回修改之前
          userInfo.mg_state = !userInfo.mg_state;
          return this.$message.error('更新用户状态失败');
        }
        // 修改成功则提示成功
        this.$message.success('更新用户状态成功')
      },
      //处理第2页搜索为空的bug
      searchUser(){
        this.queryInfo.pagenum = 1;
        this.getUserList()
      },
      changeVisible(){
        this.$refs.userDialog.isDialogVisible = true
      }
    }
  }
</script>

<style scoped>

</style>