import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem} from 'element-ui'

Vue.use(Button)
    .use(Form)
    .use(FormItem)
    .use(Input)
    .use(Container)
    .use(Header)
    .use(Aside)
    .use(Main)
    .use(Menu)
    .use(Submenu)
    .use(MenuItemGroup)
    .use(MenuItem)
//Message的导入不同，必须挂载到vue原型上
Vue.prototype.$message = Message