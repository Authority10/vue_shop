<template>
  <div>
    <!--头部面包屑-->
    <users-breadcrumb :bread-crumb-list="['商品管理','商品列表']"></users-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="inputValue">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table
              :data="goodList"
              style="width: 100%"
              border
              stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="700">

        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template v-slot="good">
            {{good.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="good">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import UsersBreadcrumb from "../user/childComps/userBasic/UsersBreadcrumb";
  export default {
    name: "List",
    components: {
      UsersBreadcrumb
    },
    data(){
      return {
        //输入框的双向绑定
        inputValue:"",
        //请求商品数据的query参数
        queryInfo:{
          query:"",
          //当前页数
          pagenum:1,
          //当前每页显示多少
          pagesize:10
        },
        //商品列表
        goodList:[],
        //商品数量总数
        total:0,
      }
    },
    created() {
      this.getGoodsList()
    },
    methods:{
      //获取商品数据
      async getGoodsList(){
        const {data:res} = await this.$http.get('goods',{params:this.queryInfo});
        if(res.meta.status!==200){
          return this.$message.error('获取商品列表失败')
        };
        console.log(res);
        res.data.goods.forEach(item=>{
          item.add_time = this.changeDate(item.add_time)
        });
        this.goodList = res.data.goods;
        this.total = res.data.total;
      },
      //时间戳转成标准日期
      changeDate(time){
        function getTimer(time) {
          var year = time.getFullYear();
          var month = time.getMonth()+1;
          var day = time.getDate();
          var hour = time.getHours();
          hour = hour<10 ? "0"+hour : hour;
          var minutes = time.getMinutes();
          minutes = minutes<10 ? "0"+minutes : minutes;
          var seconds = time.getSeconds();
          seconds = seconds<10 ? "0"+seconds : seconds;
          return year+"年" + month+"月" + day+"日"  + hour +":"+ minutes + ":"+seconds
        }
      }
    }
  }
</script>

<style lang="less" scoped>

</style>