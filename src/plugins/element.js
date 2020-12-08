import Vue from 'vue'
import { Button,Form,FormItem,Input,Message } from 'element-ui'

Vue.use(Button).use(Form).use(FormItem).use(Input);
//Message的导入不同，必须挂载到vue原型上
Vue.prototype.$message = Message