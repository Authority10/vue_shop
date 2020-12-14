<template>
  <el-dialog
          title="分配用户"
          :visible.sync="setRoleDialogVisible"
          width="50%"
          @close="clearSelectedValue">
    <div>
      <p>当前用户：{{currentRole.username}}</p>
      <p>当前角色：{{currentRole.role_name}}</p>
      <p>分配角色:
        <el-select v-model="selectedValue" placeholder="请选择">
        <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
        </el-option>
        </el-select>
      </p>
    </div>
    <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "SetRole",
    data(){
      return {
        //是否弹出'分配角色'的对话框
        setRoleDialogVisible:false,
        //需要被分配角色的当前用户
        currentRole:{},
        //双向绑定的select角色名称
        selectedValue:'',
        //服务器返回的角色列表
        rolesList:[]
      }
    },
    methods:{
      //关闭'分配角色'对话框,清空selectedValue绑定值
      clearSelectedValue(){
        this.selectedValue = ''
      },
      //'分配角色'对话框的'确认'按钮
      async saveRoleInfo(){
        if(!this.selectedValue){
          return this.$message.error('请选择需要分配的角色')
        }
        //将选中的selectedValue发送到服务器，更新角色信息
        const {data:res} = await this.$http.put(`users/${this.currentRole.id}/role`,{
          rid:this.selectedValue
        });
        // console.log(res);
        if(res.meta.status!==200){
          return this.$message.error('分配角色失败')
        }
        this.$message.success('分配角色成功');
        //发射事件，更新获取最新的用户列表
        this.$emit('refreshUserList');
        //关闭对话框
        this.setRoleDialogVisible = false
      }
    }
  }
</script>

<style scoped>

</style>