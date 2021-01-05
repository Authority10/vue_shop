<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
                placeholder="请输入内容"
                v-model="queryInfo.query"
                clearable
                @clear="getUserList">
          <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="changeDialogVisible">添加用户</el-button>
      </el-col>
    </el-row>
    <!--用户列表区域-->
    <el-table
            :data="userList"
            style="width: 100%"
            border
            stripe>
      <el-table-column label="#"    type="index"></el-table-column>
      <el-table-column label="名称" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态" >
        <template v-slot="state">
          <el-switch v-model="state.row.mg_state" @change="userStateChange(state.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <template v-slot="user">
          <el-tooltip effect="dark" content="编辑" placement="top-start" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" @click="ShowEditUser(user.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top-start" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" @click="RemoveUserById(user.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" @click="setRole(user.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
    </el-pagination>
    <edit-user ref="EditUser" :editFormProps="editForm" @editUserInfo="refreshUsers"></edit-user>
    <set-role ref="SetRole" @refreshUserList="refreshUsers"></set-role>
  </el-card>
</template>

<script>
  import EditUser from "../userOperation/EditUser";
  import SetRole from "../userOperation/SetRole";
  export default {
    name: "UsersCard",
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
        userList:[],
        //用户数量总数
        total:0,
        //控制添加用户的弹出框是否隐藏
        addDialogVisible:false,
        //使用id获取的最新用户信息
        editForm:{}
      }
    },
    components:{
      EditUser,
      SetRole
    },
    created() {
      this.getUserList()
    },
    methods:{
      //获取用户列表
      async getUserList(){
        const {data:res} = await  this.$http.get('/users',{params:this.queryInfo});
        console.log(res);
        if(res.meta.status!==200){
          return this.$message.error(res.meta.msg)
        }
        this.userList = res.data.users;
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
      //子传父发射事件，点击了'添加用户按钮'，
      changeDialogVisible(){
        this.$emit('changeVisible')
      },
      //打开用户操作的编辑对话框
      async ShowEditUser(id){
        // console.log(this.$refs.EditUser)
        // EditDialogVisible的前面不需要加data
        // console.log(id);
        this.$refs.EditUser.editDialogVisible = true;
        const {data:res} = await this.$http.get(`users/${id}`);
        // console.log(res)
        if(res.meta.status!==200){
          return this.$message.error('获取用户信息失败')
        }
        this.editForm = res.data
      },
      //接受到子组件的'确定修改用户信息'事件，更新用户列表 <edit-user>组件
      //接受到子组件的'确定分配角色'事件，更新用户列表   <set-role>组件
      refreshUsers(){
        this.getUserList()
      },
      //根据用户id删除用户
      async RemoveUserById(id){
        const confirmResult = await this.$confirm(
            '此操作将永久删除该用户, 是否继续?',
            '提示',
            {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            })
            .catch(err => err );
        // console.log(confirmResult)
        if(confirmResult!=='confirm'){
          return this.$message.info('已取消删除')
        }
        const {data:res} = await this.$http.delete('users/' + id);
        // console.log(res)
        if(res.meta.status!==200){
          return this.$message.error('删除用户失败！')
        }
        this.$message.success('删除用户成功')
        this.getUserList()
      },
      //点击'分配角色'
      async setRole(currRole){
        //当前分配角色的用户是谁？传递给<set-role>子组件
        this.$refs.SetRole.currentRole = currRole;
        //获取角色列表
        const {data:res} = await this.$http.get('roles');
        // console.log(res);
        if(res.meta.status!==200){
          return this.$message.error('获取角色列表失败！')
        }
        //将角色列表传递给<set-role>子组件
        this.$refs.SetRole.rolesList = res.data;
        //显示'分配角色'对话框
        this.$refs.SetRole.setRoleDialogVisible = true;
      }
    }
  }
</script>

<style scoped>

</style>