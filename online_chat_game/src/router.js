import Vue from 'vue'
import Router from 'vue-router'


import hall from './components/hall'
import personalInfor from './components/personalInfor'


Vue.use(Router)


const routes = [
    { path: '/', redirect: 'hall' },
    { path: '/hall', component: hall },
    { path: '/personalInfor', component: personalInfor }
]


const router = new Router({
    routes,
    linkActiveClass: 'router-link-active'
})

export default router
