<template>
  <div>
    <!--头部面包屑-->
    <users-breadcrumb :bread-crumb-list="['商品管理','添加商品']"></users-breadcrumb>
    <!--卡片区域-->
    <el-card>
    <!--添加商品信息的提示横条-->
      <el-alert
              title="添加商品信息"
              type="info"
              center
              show-icon
              :closable="false">
      </el-alert>
      <!--步骤条-->
      <el-steps :space="320" :active="dataIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--表单必须包裹在tabs的外面，不能放入到tabs里面-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!--左侧导航条-->
        <el-tabs v-model="dataIndex" :tab-position="'left'" @tab-click="handleClick" :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader class="cascader"
                           v-model="addForm.goods_cat"
                           :options="cateList"
                           :props="cascaderProps"
                           clearable
                           ref="cascaderForm"
                           @change="parentCateChanged">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in manyTableData">
              <el-checkbox-group  v-model="item.attr_vals">
                <el-checkbox border :label="cb" :key="index" v-for="(cb,index) in item.attr_vals"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in onlyTableData">
             <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

  </div>
</template>

<script>
  import UsersBreadcrumb from "../user/childComps/userBasic/UsersBreadcrumb";
  export default {
    name: "Add",
    components:{
      UsersBreadcrumb
    },
    data(){
      return {
        //步骤条活跃节点
        dataIndex:'0',
        //添加商品的表单数据绑定
        addForm:{
          goods_name:'',
          goods_price:0,
          goods_number:0,
          goods_weight:0,
          //级联选择器的节点双向绑定
          goods_cat:[],
        },
        //表单验证规则
        addFormRules: {
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
          ],
          goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' },
            { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
          ],
          goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' },
            { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
          ],
          goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' },
            { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
          ],
          goods_cat: [
            { required: true, message: '请选择商品分类', trigger: 'blur' },
          ],
        },
        //级联选择器中下拉菜单的商品分类数据
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
        //动态参数列表数据
        manyTableData:[],
        //静态参数列表数据
        onlyTableData:[],
      }
    },
    created() {
      this.getCateList()
    },
    computed:{
      cateId(){
        if(this.addForm.goods_cat.length===3){
          return this.addForm.goods_cat[2]
        }
        return null
      }
    },
    methods: {
      //左侧导航栏的点击事件
      async handleClick(tab, event) {
        // 若是点击'商品参数'导航条，则发起获取参数的请求
        if(this.dataIndex==='1'){
          const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{
            sel:'many'
          }});
          if(res.meta.status!==200){
            return this.$message.error('获取动态参数列表失败')
          }
          res.data.forEach(item=>{
            //处理vals，将字符串转换成数组
            item.attr_vals = item.attr_vals.length === 0 ? item.attr_vals = []:item.attr_vals.split(',')
          });
          this.manyTableData = res.data
        } else if(this.dataIndex==='2'){
          const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{
              sel:'only'
            }});
          if(res.meta.status!==200){
            return this.$message.error('获取静态参数列表失败')
          }
          this.onlyTableData = res.data
        }
      },
      //获取下拉栏的商品分类数据
      async getCateList(){
        const {data:res} = await this.$http.get('categories');
        console.log(res);
        if(res.meta.status!==200){
          return this.$message.error('获取商品列表失败')
        }
        this.cateList = res.data;
      },
      //级联选择器选择事件
      parentCateChanged(){
        if(this.addForm.goods_cat.length!==3){
          this.addForm.goods_cat = []
        }
      },
      //左侧导航栏切换标签之前的钩子
      beforeTabLeave(activeName,oldActiveName){
       if(oldActiveName ==='0' && this.addForm.goods_cat.length!==3){
         this.$message.error('请选择商品分类');
         return false
       }
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-checkbox {
   margin: 0 10px 0 0 !important;
  }
</style>