<template>
  <el-dialog
          title="提示"
          :visible.sync="SetRightsDialogVisible"
          width="50%"
          @close="clearDefaultCheckedId"
          >
    <el-tree
            :data="treeData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            ref="tree"
            :default-expand-all="true"
            :default-checked-keys="defaultCheckedId"></el-tree>
    <span slot="footer" class="dialog-footer">
    <el-button @click="cancelRight">取 消</el-button>
    <el-button type="primary" @click="setRight">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "SetRightsDialog",
    props:{
      treeData:{
        type:Array
      },
    },
    // watch:{
    //   //监听role变化，当传来新的需要'分配权限'的角色，执行调用递归函数
    //   role:{
    //     handler(newValue,oldValue) {
    //         if(newValue === oldValue){
    //           this.getLeafKeys(oldValue,this.defaultCheckedId)
    //         }
    //         this.getLeafKeys(newValue,this.defaultCheckedId)
    //       }
    //     },
    // },
    data(){
      return {
        //控制'分配权限'弹出框是否弹出
        SetRightsDialogVisible:false,
        //树形控件的属性绑定对象
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        //当前角色已经拥有的权限的节点数组
        defaultCheckedId:[],
        //给哪位角色分配权限？
        roleToSetRight:{},
      }
    },
    created() {

    },
    methods:{
      //递归获取角色下的所有三级权限，并将对应的id放入数组
      getLeafKeys(node,arr){
        //没有children属性就可以确定是三级权限
        if(!node.children){
          return arr.push(node.id)
        }
        //对于所有节点进行递归判断
        node.children.forEach(item=>{
          this.getLeafKeys(item,arr)
        })
      },
      //关闭对话框之前需要清空 默认勾选的defaultCheckedId 数组
      clearDefaultCheckedId(){
        this.defaultCheckedId = []
      },
      //'分配权限'对话框的'确认'
      async setRight(){
        //调用tree的函数，获取
        const keys = [
            ...this.$refs.tree.getCheckedKeys(),
            ...this.$refs.tree.getHalfCheckedKeys()
        ].join(',');
        // console.log(keys);
        const {data:res} = await this.$http.post(`roles/${this.roleToSetRight.id}/rights`,{rids:keys});
        // console.log(res);
        if(res.meta.status!==200){
          return this.$message.error('分配权限失败！')
        }
        this.$message.success('分配权限成功！');
        //通知父组件重新发送请求获取最新的角色列表
        await this.$parent.getRoleList();
        //关闭对话框
        this.SetRightsDialogVisible = false
      },
      //获取当前'分配权限'用户的已有权限，执行递归函数，添加到默认节点数组中
      getRoleRight(){
        this.getLeafKeys(this.roleToSetRight,this.defaultCheckedId)
      },
      //'分配权限'对话框的'取消'
      cancelRight(){
        //关闭对话框
        this.SetRightsDialogVisible = false;
        this.$message.info('取消分配权限！')
      }
    }
  }
</script>

<style scoped>

</style>