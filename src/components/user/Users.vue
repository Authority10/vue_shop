<template>
  <div>
    <!--面包屑导航-->
    <users-breadcrumb></users-breadcrumb>
    <!--卡片视图区域-->
    <users-card ref="userCard" @changeVisible="changeVisible" ></users-card>
    <!--添加用户的弹出框-->
    <user-dialog ref="userDialog" @refreshNewUser="refreshNewUserList"></user-dialog>
  </div>
</template>

<script>
  import UsersBreadcrumb from "./childComps/userBasic/UsersBreadcrumb";
  import UsersCard from "./childComps/userBasic/UsersCard";
  import UserDialog from "./childComps/userBasic/UserDialog";
  export default {
    name: "Users",
    data(){
      return {

      }
    },
    components:{
      UsersBreadcrumb,
      UsersCard,
      UserDialog
    },
    created() {

    },
    methods:{
      changeVisible(){
        this.$refs.userDialog.isDialogVisible = true
      },
      refreshNewUserList(){
        this.$refs.userCard.getUserList()
      }
    }
  }
</script>

<style scoped>

</style>