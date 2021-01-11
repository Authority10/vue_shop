<template>
  <div>
    <users-breadcrumb :bread-crumb-list="['订单管理','订单列表']"></users-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容"  clearable >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="isPay">
            <el-tag v-if="isPay.row.pay_status==='0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template v-slot="isSend">

          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="time">
            {{time.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" @click="cityDialogVisible=true"></el-button>
            <el-button type="success" icon="el-icon-location" @click="showProgressDialog"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total" background>
      </el-pagination>
    </el-card>
    <!--选择城市详细地址对话框-->
    <el-dialog
            title="编辑地址"
            :visible.sync="cityDialogVisible"
            width="50%"
            @close="dialogClosed">
      <el-form :model="addressForm" :rules="addressRules" ref="addressRef" label-width="100px" >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader class="cascader"
                       v-model="addressForm.address1"
                       :options="cityData"
                       :props="cascaderProps"
                       clearable
                       ref="cascaderForm"
                       >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cityDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cityDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--物流进度对话框-->
    <el-dialog
            title="物流进度"
            :visible.sync="progressDialogVisible"
            width="50%"
            >
    </el-dialog>
  </div>
</template>

<script>
  import UsersBreadcrumb from "../user/childComps/userBasic/UsersBreadcrumb";
  import cityData from "./city_data2017_element";
  export default {
    name: "Order",
    components:{
      UsersBreadcrumb
    },
    data(){
      return{
        //请求订单数据的query参数
        queryInfo:{
          //输入框的双向绑定
          query:"",
          //当前页数
          pagenum:1,
          //当前每页显示多少
          pagesize:10
        },
        //订单数据条数
        total:0,
        //订单数据
        orderList:[],
        //修改地址对话框的打开与关闭
        cityDialogVisible:false,
        //地址省市级联选择器
        addressForm:{
          address1:[],
          address2:'',
        },
        //省市三级联动数据
        cityData:cityData,
        //级联选择器配置项
        cascaderProps:{
          expandTrigger: 'hover',
        },
        //地址校验规则
        addressRules:{
          address1:[
            { required: true, message: '请选择省市区/县', trigger: 'blur' },
          ],
          address2:[
            { required: true, message: '请填写详细地址', trigger: 'blur' },
          ],
        },
        //物流进度对话框的打开与关闭
        progressDialogVisible:false,
        //物流进度数据
        progressInfo:[],
      }
    },
    created() {
      this.getOrderData()
    },
    methods:{
      //获取订单列表数据
      async getOrderData(){
        const {data:res} = await this.$http.get('orders',{params:this.queryInfo});
        if(res.meta.status!==200){
           return this.$message.error('获取订单数据失败！')
        }
        this.orderList = res.data.goods;
        this.total = res.data.total;
      },
      //监听每页显示多少(pageSize)的变化
      handleSizeChange(newSize){
        //将监听到的最新pageSize赋值给query中的pageSize
        this.queryInfo.pagesize = newSize;
        //使用新的pageSize去获取数据
        this.getOrderData()
      },
      //监听页码值(pageNum)的改变
      handleCurrentChange(newPage){
        //将监听到的最新pageNum赋值给query中的pageSize
        this.queryInfo.pagenum = newPage;
        this.getOrderData()
      },
      //查看物流进度
      async showProgressDialog(){
        const {data:res} = this.$http.get('/kuaidi/804909574412544580');
        if(res.meta.status!==200){
          return this.$message.error('获取物流进度失败！')
        }
        this.progressInfo = res.data;
        this.progressDialogVisible = true
      },
      //关闭级联选择器
      dialogClosed(){
        this.$refs.addressRef.resetFields()
      }
    },
  }
</script>

<style lang="less" scoped>
 .el-cascader {
   width: 100%;
 }
</style>