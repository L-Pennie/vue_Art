import Vue from 'vue'
import Router from 'vue-router'
import { getLocalStorage } from '@/assets/js/common'

Vue.use(Router)

const checkToken = function(to, from, next) {
    let token = getLocalStorage('token', 'string')
    if (!token) {
        next({
            path: '/login'
        })
    } else {
        next()
    }
}

const home = () =>
    import ('@/components/home/home')
const search = () =>
    import ('@/components/search/search')
const ask = () =>
    import ('@/components/ask/ask')
const browse = () =>
    import ('@/components/browse/browse')
const my = () =>
    import ('@/components/my/my')
const register = () =>
    import ('@/components/register/register')
const login = () =>
    import ('@/components/login/login')
const forget = () =>
    import ('@/components/forget/forget')
const card = () =>
    import ('@/components/card/card')
const publish_ques = () =>
    import ('@/components/publish_ques/publish_ques')
const publish_work = () =>
    import ('@/components/publish_work/publish_work')
const details = () =>
    import ('@/components/details/details')
const work_details = () =>
    import ('@/components/work_details/work_details')
const order = () =>
    import ('@/components/order/order')
const address = () =>
    import ('@/components/address/address')
const my_ques = () =>
    import ('@/components/my-ques/my-ques')
const my_publish = () =>
    import ('@/components/my-publish/my-publish')
const shop = () =>
    import ('@/components/shop/shop')
const goods_detail = () =>
    import ('@/components/goods_detail/goods_detail')
const shop_cart = () =>
    import ('@/components/shop_cart/shop_cart')
const work_search = () =>
    import ('@/components/work_search/work_search')

const router = new Router({
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/register', component: register },
        { path: '/login', component: login },
        { path: '/forget', component: forget },
        { path: '/home', component: home },
        { path: '/shop_cart', component: shop_cart },
        { path: '/goods_detail', component: goods_detail },
        { path: '/publish', component: publish_work },
        { path: '/shop', component: shop },
        { path: '/ask/publish', component: publish_ques },
        { path: '/ask/details', component: details },
        { path: '/work/details', component: work_details },
        { path: '/search', component: search },
        { path: '/order', component: order },
        { path: '/address', component: address },
        { path: '/work_search', component: work_search },
        { path: '/my', component: my },
        {
            path: '/ask',
            component: ask,
            meta: {
                keepAlive: true,
            }
        },
        {
            path: '/browse',
            component: browse,
            meta: {
                keepAlive: true,
            }
        },
        {
            path: '/my/card',
            component: card,
        }, {
            path: '/my/ques',
            component: my_ques,
        }, {
            path: '/my/publish',
            component: my_publish,
        }
    ]
})



export default router