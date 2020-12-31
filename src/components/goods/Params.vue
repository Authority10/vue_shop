<template>
  <div>
    <!--头部面包屑-->
    <users-breadcrumb :bread-crumb-list="['商品管理','参数列表']"></users-breadcrumb>
    <el-card>
      <el-alert
              title="注意：只允许为第三级分类设置相关参数！"
              type="warning"
              show-icon
              :closable="false">
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader class="cascader"
                  v-model="selectedKeys"
                  :options="cateList"
                  :props="cascaderProps"
                  clearable
                  ref="cascaderForm"
                  @change="parentCateChanged">
          </el-cascader>
        </el-col>
      </el-row>
      <el-row>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary"  :disabled="buttonDisabled">添加参数</el-button>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" :disabled="buttonDisabled">添加属性</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import UsersBreadcrumb from "../user/childComps/userBasic/UsersBreadcrumb";
  export default {
    name: "Params",
    components: {
      UsersBreadcrumb
    },
    data(){
      return{
        cateList:[],
        //级联选择器的配置项
        cascaderProps:{
          expandTrigger: 'hover',
          value:'cat_id',
          label:'cat_name',
          children:'children',
          //可以单独只选中父级
          checkStrictly:false
        },
        //级联选择器的节点双向绑定
        selectedKeys:[],
        //标签页默认选中第二栏
        activeName: 'many',
      }
    },
    computed:{
      //选中三级分类之后才能点击'添加参数'或者'添加属性'
      buttonDisabled(){
        //selectedKeys数组长度为3个才是选中了三级分类
        return this.selectedKeys.length!==3
      },
      cateId(){
        //确实是三级分类，需要获取三级分类的id
        if(this.selectedKeys.length===3){
          return this.selectedKeys[2]
        }
        return null
      }
    },
    created() {
       this.getCateList()
    },
    methods:{
      //获取商品列表数据
      async getCateList(){
        const {data:res} = await this.$http.get('categories');
        // console.log(res);
        if(res.meta.status!==200){
          return this.$message.error('获取商品列表失败')
        }
        this.cateList = res.data
      },
      //级联选择器选中项变化时触发的函数
      async parentCateChanged(){
        //如果不是选中三级分类则清空选中节点组成的数组
        if(this.selectedKeys.length!==3){
          // this.buttonDisabled = true;
          this.selectedKeys = [];
          return
        }
        // 选中了三级分类，发送请求获取分类参数列表,
        // 请求路径中必须包含当前三级分类id
        // 请求体中需设置sel代表获取静态参数还是动态参数 activeName是only或者是many（api文档）
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{
          sel:this.activeName
          }});
        console.log(res);
        if(res.meta.status!==200){
          this.$message.error('获取参数列表失败')
        }
      },
      //标签页切换的触发函数
      handleClick(tab, event) {
        // console.log(tab);
        // console.log(event)
      }
    },

  }
</script>

<style scoped>
 .cat_opt {
   margin: 15px 0;
 }
  .cascader {
    margin-left: 10px;
  }
</style>