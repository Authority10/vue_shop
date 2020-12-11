<template>
  <div>
    <!--头部面包屑-->
    <users-breadcrumb :bread-crumb-list="['权限管理','权限列表']"></users-breadcrumb>
    <el-card>
      <!--权限列表区域-->
      <el-table
              :data="rightsList"
              style="width: 100%"
              border
              stripe>
        <el-table-column label="#"    type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="rights">
            <el-tag v-if="rights.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="rights.row.level==='1'">二级</el-tag>
            <el-tag type="info" v-else-if="rights.row.level==='2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import UsersBreadcrumb from "../../user/childComps/userBasic/UsersBreadcrumb";
  export default {
    name: "Rights",
    data(){
      return {
        rightsList:[]
      }
    },
    components: {
      UsersBreadcrumb
    },
    created() {
      this.getRightsList()
    },
    methods:{
      async getRightsList(){
        const {data:res} = await  this.$http.get('rights/list')
        // console.log(res)
        if(res.meta.status!==200){
          return this.$message.error('获取列表失败')
        }
        this.rightsList = res.data
      }
    }
  }
</script>

<style scoped>

</style>