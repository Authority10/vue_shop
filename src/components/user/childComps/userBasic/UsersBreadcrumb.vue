<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{breadCrumbList[0]}}</el-breadcrumb-item>
    <el-breadcrumb-item>{{breadCrumbList[1]}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    name: "UsersBreadcrumb",
    props:{
      breadCrumbList:{
        type:Array
      }
    }
  }
</script>

<style scoped>

</style>