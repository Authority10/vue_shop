<template>
  <el-dialog title="添加用户" :visible.sync="isDialogVisible" width="50%">
    <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="email" v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="isDialogVisible = false">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "UserDialog",
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
        isDialogVisible:false,
        //添加的用户表单
        addForm:{
          username:'',
          password:"",
          email:'',
          mobile:'',
        },
        //添加用户的表单的验证规则
        addFormRules:{
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

    }
  }
</script>

<style scoped>

</style>