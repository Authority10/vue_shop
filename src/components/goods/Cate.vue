<template>
  <div>
    <users-breadcrumb :bread-crumb-list="['商品管理','商品分类']"></users-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addGood">添加商品</el-button>
      <tree-table class="treeTable"
              :data="cateList"
              :columns="columns"
              index-text="#"
              show-index
              border
              :selection-type="false"
              :expand-type="false">
        <template v-slot:isok="goods">
          <i v-if="!goods.row['cat_deleted']" class="el-icon-success" style="color:red"></i>
          <i v-else class="el-icon-error"></i>
        </template>
        <template v-slot:order="goods">
          <el-tag v-if="goods.row['cat_level']===0">一级</el-tag>
          <el-tag v-if="goods.row['cat_level']===1" type="success">二级</el-tag>
          <el-tag v-if="goods.row['cat_level']===2" type="danger">三级</el-tag>
        </template>
        <template v-slot:opt="goods">
          <el-tooltip effect="dark" content="编辑" placement="top-start" :enterable="false">
            <el-button type="primary" @click="editCateDialog(goods.row)" icon="el-icon-edit">编辑</el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top-start" :enterable="false">
            <el-button type="danger" @click="deleteCateDialog(goods.row.cat_id)" icon="el-icon-delete">删除</el-button>
          </el-tooltip>
        </template>
      </tree-table>
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[3, 5, 10, 15]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    <!--'添加分类'的弹出框-->
    <el-dialog
            title="添加分类"
            :visible.sync="goodDialogVisible"
            width="50%"
            @close="addCateDialogClosed">
      <el-form :model="addCateForm" :rules="addCateRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
                  v-model="selectedKeys"
                  :options="parentCateList"
                  :props="cascaderProps"
                  clearable
                  ref="cascaderForm"
                  @change="parentCateChanged">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goodDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!--'编辑分类'的弹出框-->
    <el-dialog
            title="编辑分类"
            :visible.sync="editDialogVisible"
            width="50%"
            >
      <el-form :model="editCateForm" :rules="addCateRules" ref="editRuleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import UsersBreadcrumb from "../user/childComps/userBasic/UsersBreadcrumb";
  export default {
    name: "Cate",
    components: {
      UsersBreadcrumb
    },
    data(){
      return {
        //get请求的请求参数
        queryInfo: {
          type:3,
          //当前页码
          pagenum:1,
          //每页显示多少条数据
          pagesize:5
        },
        //服务器返回的商品数据
        cateList:[],
        //商品总条数
        total:0,
        //tree-table的columns configs
        columns:[
          {
            label:'分类数据',
            prop:'cat_name',
          },
          {
            label:'是否有效',
            prop:'cat_delete',
            type:'template',
            template:'isok'
          },
          {
            label:'排序',
            prop:'cat_level',
            type:'template',
            template:'order'
          },
          {
            label:'操作',
            type:'template',
            template:'opt'
          },
        ],
        //是否显示'添加商品'对话框
        goodDialogVisible:false,
        //点击'编辑'出现编辑对话框
        editDialogVisible:false,
        //添加分类中的表单数据的双向绑定
        addCateForm:{
          //分类的名称
          cat_name:'',
          //父级分类的id
          cat_pid:0,
          //分类层级
          cat_level:0,
        },
        //添加(编辑)分类中的表单数据的校验规则
        addCateRules:{
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ],
        },
        //父级分类数据
        parentCateList:[],
        //级联选择器的配置项
        cascaderProps:{
          expandTrigger: 'hover',
          value:'cat_id',
          label:'cat_name',
          children:'children',
          //可以单独只选中父级
          checkStrictly:true
        },
        //级联选择器的双向绑定
        selectedKeys:[],
        //'编辑'对话框中表单数据的双向绑定
        editCateForm:{
          cat_name:'',
          cat_id:'',
        },
      }
    },
    created() {
      this.getCateList()
    },
    methods:{
      //获取商品列表
      async getCateList(){
        const {data:res} = await this.$http.get('categories',{params:this.queryInfo});
        console.log(res);
        if(res.meta.status!==200){
          return this.$message.error('获取商品列表失败')
        }
        this.cateList = res.data.result;
        this.total = res.data.total;
      },
      handleSizeChange(newSize){
        //将监听到的最新pagezize赋值给query中的pagesize
        this.queryInfo.pagesize = newSize;
        //使用新的pagesize去获取数据
        this.getCateList()
      },
      handleCurrentChange(newPage){
        //将监听到的最新pagenum赋值给query中的pagesize
        this.queryInfo.pagenum = newPage;
        this.getCateList()
      },
      //点击'添加分类'按钮
      addGood(){
        this.getParentList();
        this.goodDialogVisible = true
      },
      //获取所有父级分类商品
      async getParentList(){
        const {data:res} = await this.$http.get('categories',{params:{type:2}})
        if(res.meta.status!==200){
          return this.$message.error('获取父级分类失败！')
        }
        this.parentCateList = res.data
      },
      //级联选择器发生变化所触发的变化函数
      parentCateChanged(){
        //数组只要存在元素就证明该分类不是一级分类，肯定存在父分类
        if(this.selectedKeys.length > 0){
          //获取最后一个元素，父分类的id
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
          this.addCateForm.cat_level = this.selectedKeys.length;
          return
        }else {
          //不存在元素证明该分类是一级分类
          this.addCateForm.cat_level = 0;
          this.addCateForm.cat_pid = 0;
        }
      },
      //关闭'添加分类'
      addCateDialogClosed(){
        //清空表单中的'分类名称'
        this.$refs.ruleForm.resetFields();
        //清空级联选择器
        this.selectedKeys = [];
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      },
      //'添加商品'对话框的'确定按钮'
      addCate(){
        //判断表单提交前是否符合校验规则
        this.$refs.ruleForm.validate(async valid=>{
          //不符合
          if(!valid) {
            return
          }
          //符合校验规则就发送请求
          const {data:res} =await this.$http.post('categories',this.addCateForm);
          console.log(res);
          if(res.meta.status!==201){
            return this.$message.error('添加失败!')
          }
          this.$message.success('添加分类成功!')
          //重新拉取最新的分类数据
          this.getCateList();
          //关闭'添加分类'对话框
          this.goodDialogVisible = false;
        })
      },
      //点击'编辑'弹出对话框
      editCateDialog(good){
        // console.log(good);
        this.editCateForm.cat_name = good.cat_name;
        this.editCateForm.cat_id = good.cat_id;
        this.editDialogVisible = true
      },
      //'编辑'对话框的确定按钮
      editCate(){
        //判断表单提交前是否符合校验规则
        this.$refs.editRuleForm.validate(async valid=>{
          //不符合
          if(!valid) {
            return
          }
          //符合校验规则就发送请求
          const {data:res} =await this.$http.put('categories/'+ this.editCateForm.cat_id , {
            cat_name:this.editCateForm.cat_name
          });
          console.log(res);
          if(res.meta.status!==200){
            return this.$message.error('编辑失败!')
          }
          this.$message.success('编辑分类成功!')
          //重新拉取最新的分类数据
          this.getCateList();
          //关闭'编辑分类'对话框
          this.editDialogVisible = false;
        })
      },
      //点击'删除'按钮
      async deleteCateDialog(id){
        const confirmResult = await this.$confirm(
            '此操作将永久删除该商品, 是否继续?',
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .catch(err => err );
        // console.log(confirmResult)
        if(confirmResult!=='confirm'){
          return this.$message.info('已取消删除')
        }
        const {data:res} = await this.$http.delete('categories/' + id);
        // console.log(res)
        if(res.meta.status!==200){
          return this.$message.error('删除商品失败！')
        } else {
          this.$message.success('删除商品成功');
        }
        this.getCateList()
      },
    }
  }
</script>

<style lang="less" scoped>
 .treeTable {
   margin-top: 15px;
 }
 .el-cascader {
    width: 100%;
 }
</style>