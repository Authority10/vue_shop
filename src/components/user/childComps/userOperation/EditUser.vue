<template>
  <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
    <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="email" v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "EditUser",
    props:{
      editFormProps:{
        type:Object
      }
    },
    watch:{
      editFormProps(val){
        this.editForm=val
      }
    },
    data(){
      //自定义邮箱校验规则
      var checkEmain = (rule,value,callback)=>{
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value)){
          callback()
        }
        callback(new Error('请输入合法邮箱'))
      };
      //自定义手机校验规则
      var checkMobile = (rule,value,callback)=>{
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        if(regMobile.test(value)){
          callback()
        }
        callback(new Error('请输入合法手机号码'))
      };
      return {
        //控制弹出框的隐藏和开启
        editDialogVisible:false,
        //需要被修改的用户表单
        editForm:this.editFormProps,
        //需要被修改的用户表单的验证规则
        editFormRules:{
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ],
          email: [
            {require:true,message:'请输入邮箱',trigger:'blur'},
            {validator: checkEmain, trigger: 'blur'}
          ],
          mobile: [
            {require:true,message:'请输入手机',trigger:'blur'},
            {validator: checkMobile, trigger: 'blur'}
          ],
        }
      }
    },
    methods:{
      //监听修改用户对话框的关闭，触发重置表单功能
      editDialogClosed(){
        this.$refs.editFormRef.resetFields()
      },
      //修改用户对话框的表单预验证，同时向服务器发送修改请求
      editUser(){
        this.$refs.editFormRef.validate(async (valid)=>{
          if(!valid){
            return this.$message.error('请输入正确格式')
          }
          //携带email和mobile参数进行请求
          const {data:res} = await this.$http.put('users/' + this.editForm.id,{
            email:this.editForm.email,
            mobile:this.editForm.mobile
          });
          console.log(res);
          // 创建失败立即返回错误提示跳出函数
          if(res.meta.status!==200){
            return this.$message.error('修改用户失败')
          }

          //下面3步都是成功之后的操作

          //修改成功之后提示成功
          this.$message.success('修改用户成功');
          //关闭对话框
          this.editDialogVisible = false;
          //子传父，发射'确定修改用户信息'的事件
          this.$emit('editUserInfo');
        })
      }
    }
  }
</script>

<style scoped>

</style>