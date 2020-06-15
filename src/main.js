import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store'
import 'amfe-flexible'
import { Pagination, Dialog, Collapse, CollapseItem, DatetimePicker, Picker, Field, Loading, PullRefresh, List, Swipe, SwipeItem, Tab, Tabs, Popup, Cell, CellGroup, Tabbar, TabbarItem, Search, Divider, Card, Button, ActionSheet, DropdownMenu, DropdownItem, Uploader, ImagePreview, SwipeCell, Tag, SubmitBar, Checkbox, Switch, CountDown, Icon, Sku, GoodsAction, GoodsActionIcon, GoodsActionButton, AddressList, AddressEdit, Radio, RadioGroup, NavBar } from 'vant';

import waterfall from 'vue-waterfall2'
Vue.use(waterfall)
import { dateFilter } from '@/assets/js/filters'
Vue.prototype.$http = axios

//富文本
import initRichText from '@/assets/js/initHTMLEditor';
initRichText();
import "font-awesome/css/font-awesome.css"
import '@/assets/icon/iconfont.css'

import { Image as VanImage } from 'vant';
Vue.use(VanImage);
Vue.use(Dialog).use(Pagination).use(Collapse).use(CollapseItem).use(DatetimePicker).use(Picker).use(Field).use(Loading).use(PullRefresh).use(Swipe).use(SwipeItem).use(Tab).use(Tabs).use(Popup).use(Cell).use(CellGroup).use(List).use(Tabbar).use(TabbarItem).use(Search).use(Divider).use(Card).use(Button).use(ActionSheet).use(DropdownMenu).use(DropdownItem).use(Uploader).use(ImagePreview).use(SwipeCell).use(Tag).use(SubmitBar).use(Checkbox).use(Switch).use(CountDown).use(Icon).use(Sku).use(GoodsAction).use(GoodsActionIcon).use(GoodsActionButton).use(AddressList).use(AddressEdit).use(Card).use(Radio).use(RadioGroup).use(NavBar);

import Vconsole from 'vconsole';
new Vconsole();

Vue.config.productionTip = false



Vue.filter('dataFilter', dateFilter)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')