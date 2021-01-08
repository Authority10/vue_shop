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
          <el-tab-pane label="商品图片" name="3">
            <el-upload
                    class="upload-demo"
                    :action="uploadUrl"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :headers="headerObj"
                    list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addBtn" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
            title="图片预览"
            :visible.sync="previewVisible"
            width="50%"
            >
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'lodash'
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
          //图片数组
          pics:[],
          //商品介绍（富文本）
          goods_introduce:'',
          //静态属性和动态属性
          attrs:[],
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
        //上传图片的URL地址
        uploadUrl:'http://127.0.0.1:8888/api/private/v1/upload',
        //图片上传请求头
        headerObj:{
          Authorization:window.sessionStorage.getItem('token')
        },
        //预览图片地址
        previewPath:'',
        //是否放大图片预览
        previewVisible:false
      }
    },
    created() {
      this.getCateList()
    },
    computed:{
      //获取当前选中的三级分类的id
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
      },

      //处理图片预览效果
      handlePreview(file){
        // console.log(file)
        //打开图片预览
        this.previewVisible = true;
        //图片预览中的图片url来自图片上传之后返回的url地址
        this.previewPath = file.response.data.url
      },

      //处理删除图片
      handleRemove(file){
        // console.log(file)
        //获取被删除图片的信息
        const filePath = file.response.data.tmp_path;
        //根据图片信息中的临时路径找到数组中的对应索引
        const i =  this.addForm.pics.findIndex(item => item.pic === filePath);
        //删除数组中该条图片信息
        this.addForm.pics.splice(i,1);
        console.log(this.addForm)
      },

      //图片上传成功的钩子函数
      handleSuccess(res){
        // console.log(res);
        //拼接一个图片对象
        const picInfo = {pic:res.data.tmp_path};
        //将图片对象放入到表单绑定数据中的pics数组
        this.addForm.pics.push(picInfo)
      },

      //添加商品的按钮
      addGood(){
        // console.log(this.addForm)
        // 表单验证
        this.$refs.addFormRef.validate(async (valid)=>{
          if(!valid){
            return this.$message.error('请填写必要的表单项目')
          }

          //利用lodash进行深拷贝
          const form = _.cloneDeep(this.addForm);
          form.goods_cat =  form.goods_cat.join(',');

          //处理动态参数
          this.manyTableData.forEach(item=>{
            const newInfo = {
              attr_id:item.attr_id,
              attr_value:item.attr_vals.join(',')
            };
            this.addForm.attrs.push(newInfo)
          });

          //处理动态参数
          this.onlyTableData.forEach(item=>{
            const newInfo = {
              attr_id:item.attr_id,
              attr_value:item.attr_vals
            };
            this.addForm.attrs.push(newInfo)
          });

          form.attrs = this.addForm.attrs;
          console.log(form);
          //携带表单数据进行请求
          const {data:res} = await this.$http.post('goods',form);
          console.log(res);
          // 创建失败立即返回错误提示跳出函数
          if(res.meta.status!==201){
            return this.$message.error('添加商品失败')
          }

          //修改成功之后提示成功
          this.$message.success('添加商品成功');
          //路由跳转
          this.$router.push('/goods')
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-checkbox {
   margin: 0 10px 0 0 !important;
  }
  .previewImg {
    width: 100%;
  }
  .addBtn {
    margin-top: 15px;
  }
</style>