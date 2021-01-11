<template>
  <div>
    <users-breadcrumb :bread-crumb-list="['数据统计','数据报表']"></users-breadcrumb>
    <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
  import UsersBreadcrumb from "../user/childComps/userBasic/UsersBreadcrumb";
  import * as echarts from 'echarts'
  import _ from 'lodash'
  export default {
    name: "Report",
    components:{
      UsersBreadcrumb
    },
    data(){
      return {
        //图表配置项数据
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
      }
    },
    async mounted() {
      const {data:res} = await this.$http.get('reports/type/1');
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));
      // 使用刚指定的配置项和数据显示图表
      // 使用lodash合并两个对象
      const result = _.merge(res.data,this.options);
      myChart.setOption(result);
    }
  }
</script>

<style scoped>

</style>