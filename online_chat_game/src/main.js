import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import router from './router.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSocketio from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import './assets/style/theme/index.css'
Vue.use(Element)
Vue.use(VueAxios, axios)
Vue.use(new VueSocketio({
  debug: true,
  connection: SocketIO('http://localhost:8888') //xxx填后台给的socket地址，端口号根据实际后台端口写
}))


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
  sockets: {
    connect: function () {
      // console.log('连接成功');
    },
    res: function (val) {
      // console.log('接收到服务端消息', val);
    }
  }
}).$mount('#app')
