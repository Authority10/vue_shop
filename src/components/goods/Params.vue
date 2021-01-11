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
            <el-button
                    type="primary"
                    :disabled="buttonDisabled"
                    @click="addParamsVisible = true">添加参数</el-button>
            <el-table :data="manyTableData" border stripe>
              <el-table-column type="expand">
                <template v-slot="params">
                  <el-tag
                          :key="index"
                          v-for="(tag,index) in params.row.attr_vals"
                          closable
                          :disable-transitions="false"
                          @close="handleClose(index,params.row)">
                    {{tag}}
                  </el-tag>
                  <el-input
                          class="input-new-tag"
                          v-if="params.row.inputVisible"
                          v-model="params.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(params.row)"
                          @blur="handleInputConfirm(params.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(params.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template v-slot="params">
                  <el-button type="primary" icon="el-icon-edit" @click="editParams(params)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="deleteParams(params)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button
                    type="primary"
                    :disabled="buttonDisabled"
                    @click="addParamsVisible = true">添加属性</el-button>
            <el-table :data="onlyTableData" border stripe>
              <el-table-column type="expand">
                <template v-slot="params">
                  <el-tag
                          :key="index"
                          v-for="(tag,index) in params.row.attr_vals"
                          closable
                          :disable-transitions="false"
                          @close="handleClose(index,params.row)">
                    {{tag}}
                  </el-tag>
                  <el-input
                          class="input-new-tag"
                          v-if="params.row.inputVisible"
                          v-model="params.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(params.row)"
                          @blur="handleInputConfirm(params.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(params.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template v-slot="params">
                  <el-button type="primary" icon="el-icon-edit" @click="editParams(params)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="deleteParams(params)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>
    <!--添加属性的弹出框-->
    <el-dialog
            :title="this.activeName==='many'?'添加动态参数':'添加静态属性'"
            :visible.sync="addParamsVisible"
            width="50%"
            @close="closeDialog">
      <el-form :model="addRuleForm" :rules="rules" ref="addRuleRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="this.activeName==='many'?'动态参数':'静态属性'" prop="attr_name">
          <el-input v-model="addRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttrName">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改属性的弹出框-->
    <el-dialog
            :title="this.activeName==='many'?'编辑动态参数':'编辑静态属性'"
            :visible.sync="editParamsVisible"
            width="50%"
            >
      <el-form :model="editRuleForm" :rules="rules" ref="editRuleRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="this.activeName==='many'?'动态参数':'静态属性'" prop="attr_name">
          <el-input v-model="editRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttrName">确 定</el-button>
      </span>
    </el-dialog>
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
        //级联选择器渲染数据
        cateList:[],
        //级联选择器的节点双向绑定
        selectedKeys:[],
        //标签页默认选中第二栏
        activeName: 'many',
        //动态参数数据
        manyTableData:[],
        //静态属性数据
        onlyTableData:[],
        //控制显示'添加静态属性/添加动态参数'的对话框
        addParamsVisible:false,
        //'添加静态属性/添加动态参数'的表单绑定
        addRuleForm: {
          attr_name: '',
        },
        //添加和修改可以共用一个表单验证规则
        rules:{
          attr_name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
        },
        //控制显示'修改静态属性/修改动态参数'的对话框
        editParamsVisible:false,
        //'修改静态属性/修改动态参数'的表单绑定
        editRuleForm: {
          attr_name: '',
          attr_id:'',
        },
        //文本输入框和+new Tag 的互相切换
        // inputVisible:false,
        //tag标签上的文本内容双向绑定
        // inputValue:'',

      }
    },
    computed:{
      //选中三级分类之后才能点击'添加参数'或者'添加属性'
      buttonDisabled(){
        //selectedKeys数组长度为3个才是选中了三级分类
        return this.selectedKeys.length!==3
      },
      //获取级联选择器选中的三级分类id
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

      //获取参数列表
      async getParamsData(){
        //如果不是选中三级分类则清空选中节点组成的数组
        if(this.selectedKeys.length!==3){
          // this.buttonDisabled = true;
          this.selectedKeys = [];
          //动态参数数据
          this.manyTableData = [];
          //静态属性数据
          this.onlyTableData = [];
          return
        }
        // 选中了三级分类，发送请求获取分类参数列表,
        // 请求路径中必须包含当前三级分类id
        // 请求体中需设置sel代表获取静态参数还是动态参数 activeName是only或者是many（api文档）
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{
            sel:this.activeName
          }});
        if(res.meta.status!==200){
          this.$message.error('获取参数列表失败')
        }
        //提前对attr_vals做字符串转成数组的处理
        res.data.forEach(item=>{
          //为每一个属性设置自己的tag标签的inputVisible和inputValue
          //文本输入框和+new Tag 的互相切换
          item.inputVisible = false;
          //tag标签上的文本内容双向绑定
          item.inputValue = '';
          //判断空字符串，为空直接转成空数组
          item.attr_vals = item.attr_vals ? item.attr_vals.split(','):[]
        });
        if(this.activeName === 'many'){
          this.manyTableData = res.data
        } else {
          this.onlyTableData= res.data
        }
      },

      //级联选择器选中项变化时触发的函数
      async parentCateChanged(){
        this.getParamsData()
      },

      //标签页切换的触发函数
      handleClick(tab, event) {
        this.getParamsData()
      },

      //关闭'添加参数'或者'添加属性'的对话框
      closeDialog(){
        //关闭时调用组件内部方法重置表单
        this.$refs.addRuleRef.resetFields()
      },

      //'添加参数'或者'添加属性'的对话框的'确定'按钮
      addAttrName(){
        //调用addRuleRef组件内部的表单验证方法
        this.$refs.addRuleRef.validate(async (valid)=>{
          if(!valid){
            return this.$message.error('请输入正确格式')
          }
          const {data:res} = await this.$http.post('categories/'+this.cateId +'/attributes',{
            attr_name:this.addRuleForm.attr_name,
            attr_sel:this.activeName,
            });
          console.log(res);
          // 创建失败立即返回错误提示跳出函数
          if(res.meta.status!==201){
            return this.$message.error('添加属性失败')
          }
          //下面3步都是成功之后的操作
          //创建成功之后提示成功
          this.$message.success('添加属性成功');
          //关闭对话框
          this.addParamsVisible = false;
          //重新向服务器拉取最新的分类参数
          this.getParamsData()
        })
      },

      //点击某一条属性或者参数的'编辑'
      async editParams(params){
        //获取当前被编辑的参数的id和name，与editRuleForm表单绑定
        //一开始的做法是直接从params里面获取，
        // 但是如果别人在你获取到服务器最新数据之后，进行编辑操作之前又修改了一次就会获取不到当前最新的name
        // this.editRuleForm.attr_id = params.row.attr_id;
        // this.editRuleForm.attr_name = params.row.attr_name;

        //所以最好的做法还是重新发送一个get请求获取服务器中的最新name
        const {data:res} = await  this.$http.get('categories/'+this.cateId +'/attributes/' + params.row.attr_id);
        if(res.meta.status!==200){
          return this.$message.error('获取参数失败')
        }
        //将服务器返回的params的name/id等等属性和表单绑定
        this.editRuleForm= res.data;
        //打开'编辑'的对话框
        this.editParamsVisible = true;
      },

      //点击某一条属性或者参数的'删除'
      async deleteParams(params){
        //弹框提示是否删除
        const confirmResult = await this.$confirm(
            '此操作将永久删除该属性, 是否继续?',
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
        const {data:res} = await this.$http.delete('categories/'+this.cateId +'/attributes/' + params.row.attr_id);
        //删除失败的提示
        if(res.meta.status!==200){
          return this.$message.error('删除权限失败')
        }
        //删除完毕之后获取最新的参数列表
        this.getParamsData();
      },

      //'修改参数'或者'修改属性'的对话框的'确定'按钮
      editAttrName(){
        this.$refs.editRuleRef.validate(async (valid)=>{
          if(!valid){
            return this.$message.error('请输入正确格式')
          }
          const {data:res} = await this.$http.put('categories/'+this.cateId +'/attributes/' + this.editRuleForm.attr_id,{
            attr_name:this.editRuleForm.attr_name,
            attr_sel:this.activeName,
            attr_vals:this.editRuleForm.attr_vals
          });
          console.log(res);
          // 创建失败立即返回错误提示跳出函数
          if(res.meta.status!==200){
            return this.$message.error('编辑属性失败')
          }
          //下面3步都是成功之后的操作
          //编辑成功之后提示成功
          this.$message.success('编辑属性成功');
          //关闭对话框
          this.editParamsVisible = false;
          //重新向服务器拉取最新的分类参数
          this.getParamsData()
        })
      },

      //发送请求将添加的新的tag上传服务器
      async saveAttrVals(row){
        const {data:res} = await this.$http.put('categories/'+this.cateId +'/attributes/' + row.attr_id,{
          attr_name:row.attr_name,
          attr_sel:row.attr_sel,
          attr_vals:row.attr_vals.join(',')
        });
        if(res.meta.status!==200){
          return this.$message.error('修改参数属性失败！')
        }
        this.$message.success('修改参数属性成功！')
      },

      //当tag文本框失去焦点或者按下enter，新增tag标签
      async handleInputConfirm(row){
        //判断是否为空字符串
        if(row.inputValue.trim().length===0){
          row.inputValue = '';
          row.inputVisible = false;
          return
        }
        //不为空字符则添加新的tag
        row.attr_vals.push(row.inputValue);
        row.inputValue = '';
        row.inputVisible = false;
        //发送请求将添加的新的tag上传服务器
        this.saveAttrVals(row);
      },

      //点击'add Tag'
      showInput(row){
        row.inputVisible = true;
        //文本框自动获得焦点
        //$nextTick 当页面上元素被重新渲染之后才会执行回调函数
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      //删除标签
      handleClose(index,row) {
        row.attr_vals.splice(index, 1);
        //发送请求将最新的tag上传服务器
        this.saveAttrVals(row);
      },
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
  .el-tag {
    margin: 5px;
  }
  .input-new-tag {
    width: 120px;
  }
</style>