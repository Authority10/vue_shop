<template>
  <div>
    <!--头部面包屑-->
    <users-breadcrumb :bread-crumb-list="['商品管理','商品列表']"></users-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
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
            {{good.row.upd_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="good">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteGood(good.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total" background>
      </el-pagination>
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
        //请求商品数据的query参数
        queryInfo:{
          //输入框的双向绑定
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
        }
        console.log(res);
        this.goodList = res.data.goods;
        this.total = res.data.total;
      },
      //监听每页显示多少(pageSize)的变化
      handleSizeChange(newSize){
        //将监听到的最新pageSize赋值给query中的pageSize
        this.queryInfo.pagesize = newSize;
        //使用新的pageSize去获取数据
        this.getGoodsList()
      },
      //监听页码值(pageNum)的改变
      handleCurrentChange(newPage){
        //将监听到的最新pageNum赋值给query中的pageSize
        this.queryInfo.pagenum = newPage;
        this.getGoodsList()
      },
      //删除商品数据
      async deleteGood(id){
        //弹框提示是否删除
        const confirmResult = await this.$confirm(
            '此操作将永久删除该商品数据, 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .catch(err => err );
        //判断用户点击'确认'或者'取消'
        if(confirmResult!=='confirm'){
          return this.$message.info('已取消删除')
        }
        //点击'确认'，向服务器发送删除请求
        const {data:res} = await this.$http.delete('goods/'+id);
        //删除失败的提示
        if(res.meta.status!==200){
          return this.$message.error('删除商品失败！')
        }
        this.$message.success('删除商品成功！')
        //删除完毕之后获取最新的参数列表
        this.getGoodsList();
      },
      //跳转到添加商品页面
      goAddPage(){
        this.$router.push('/goods/add')
      }
    }
  }
</script>

<style lang="less" scoped>

</style>