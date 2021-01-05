<template>
  <div>
    <!--面包屑-->
    <users-breadcrumb :bread-crumb-list="['权限管理','角色列表']"></users-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
                :data="roleList"
                style="width: 100%"
                border
                stripe>
          <!--展开列-->
          <el-table-column type="expand">
            <template v-slot="rights">
              <el-row :class="['bdbottom','vertical-center',i1===0 ? 'bdtop':'']" v-for="(item1,i1) in rights.row.children" :key="item1.id">
                <!--一级权限-->
                <el-col :span="5">
                  <el-tag closable
                          @close="removeRightById(rights.row,item1.id)"
                  >{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!--二级权限-->
                <el-col :span="19">
                  <el-row :class="['vertical-center',i2===0 ? '' : 'bdtop' ]" v-for="(item2,i2) in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="success"
                              closable
                              @close="removeRightById(rights.row,item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!--三级权限-->
                    <el-col :span="18">
                       <el-tag type="warning"
                               :class="[i3===0 ? '' : 'bdtop' ]"
                               v-for="(item3,i3) in item2.children"
                               :key="item3.id"
                               closable
                               @close="removeRightById(rights.row,item3.id)">
                         {{item3.authName}}
                       </el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="#"    type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="singleRole">
              <el-button type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete">删除</el-button>
              <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" @click="showSetRightsDialog(singleRole.row)">分配权限</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
    </el-card>
    <!--分配权限弹出框-->
    <set-rights-dialog
            ref="RightsDialog"
            :tree-data="rightList"
            ></set-rights-dialog>
  </div>
</template>

<script>
  import UsersBreadcrumb from "../../user/childComps/userBasic/UsersBreadcrumb";
  import SetRightsDialog from "./SetRightsDialog";
  export default {
    name: "Roles",
    data(){
      return {
        //角色列表
        roleList:[],
        //所有权限列表
        rightList:[],
        //给哪位角色分配权限？
        // roleToSetRight:{}
      }
    },
    components: {
      UsersBreadcrumb,
      SetRightsDialog
    },
    created() {
      //获取角色列表
      this.getRoleList()
    },
    methods:{
      //向服务器发起角色列表请求
      async getRoleList(){
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status!==200){
          return this.$message.error('获取角色列表失败')
        }
        this.roleList =res.data
      },
      //根据Id删除对应的权限

      //点击'分配权限'弹出对话框
      async showSetRightsDialog(role){
        //向服务器发起请求获取所有的树形权限列表
        const {data:res} = await this.$http.get('rights/tree');
        //保存'树形权限列表'数据
        this.rightList = res.data;

        //获取点击'分配权限'的角色,传给子组件
        this.$refs.RightsDialog.roleToSetRight = role;
        //调用子组件方法，获取当前'分配权限'用户的已有权限
        //使用props+watch方法会出现bug，点击同一个人的分配权限清空之后props不会传值
        this.$refs.RightsDialog.getRoleRight();

        //修改子组件SetRightsDialogVisible，弹出对话框
        this.$refs.RightsDialog.SetRightsDialogVisible = true;
      },

    }
  }
</script>

<style lang="less" scoped>
  .el-tag{
    margin: 7px;
  }
  .bdtop {
    border-top:1px solid #eeeeee;
  }
  .bdbottom {
    border-bottom:1px solid #eeeeee;
  }
  .vertical-center {
    display: flex;
    align-items: center;
  }
</style>