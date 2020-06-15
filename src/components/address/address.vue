<template>
  <div>
    <header-main title="我的收货地址" class="header"></header-main>
    <div class="address">
      <van-address-list
        v-model="chosenAddressId"
        :list="addressList"
        default-tag-text="默认"
        @select="clickItem"
        @add="onAdd"
        @edit="onEdit"
      />
      <!-- @click-item="clickItem" -->
      <van-popup v-model="show_edit" class="popup">
        <van-address-edit
          :address-info="editInfo"
          :area-list="areaList"
          show-postal
          show-delete
          show-set-default
          show-search-result
          :search-result="searchResult"
          :area-columns-placeholder="['请选择', '请选择', '请选择']"
          @save="onSave"
          @delete="onDelete"
          @change-detail="onChangeDetail"
          @change-area="onChangeArea"
        />
      </van-popup>
    </div>
  </div>
</template>
<script>
import HeaderMain from "@/base/header/header";
import areaInfo from "@/assets/js/area.js"
import { Toast } from 'vant';
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  data() {
    return {
      addressList: [],
      editInfo: null,
      chosenAddressId: '',
      show_edit: false,
      areaList: areaInfo,
      searchResult: [],
      search_content: '',
      city: "",
      SearchList: [],
      placeSearch: null,
    }
  },
  computed: {
    ...mapState(['address', 'defaultAddress', 'ids']),
  },
  components: {
    HeaderMain,
  },
  created() {
    this.addressList = this.address;
  },
  methods: {
    ...mapMutations(['addAddress', 'removeFormAddress', 'setTempAddress']),
    clickItem(val) {
      this.setTempAddress(val)
      this.$router.push(`order`)
    },
    onChangeArea(val) {
      this.city = val[2].name
    },
    handleSearch(search_content) {
      var _this = this;
      AMap.service(["AMap.PlaceSearch"], function () {
        var placeSearch = new AMap.PlaceSearch({
          pageSize: 10, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: _this.city, // 兴趣点城市
          citylimit: true,  //是否强制限制在设置的城市内搜索
          autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
        //关键字查询
        placeSearch.search(search_content, function (status, result) {
          _this.searchResult = result.poiList.pois
        })

      });
    },
    onChangeDetail(val) {
      this.handleSearch(val)

    },
    onAdd() {
      this.show_edit = true;
      this.editInfo = {};
      this.city = "";
      this.searchResult = [];
    },
    onEdit(item, index) {
      this.editInfo = item
      this.show_edit = true;
    },
    onSave(val) {
      var addressInfo = {
        name: val.name,
        tel: val.tel,
        province: val.province,
        city: val.city,
        county: val.county,
        areaCode: val.areaCode,
        postalCode: val.postalCode,
        addressDetail: val.addressDetail,
        isDefault: val.isDefault,
        address: val.province + val.city + val.county + val.addressDetail
      }
      JSON.stringify(this.editInfo) == "{}" ? addressInfo.id = this.ids : addressInfo.id = this.editInfo.id
      if (val.province == val.city) {
        addressInfo.address = val.city + val.county + val.addressDetail
      }
      this.addAddress(addressInfo)
      this.show_edit = false;
      this.chosenAddressId = (this.defaultAddress == true ? this.addressList[0].id : '')
      Toast.success('保存成功');
    },
    onDelete(val) {
      this.removeFormAddress(val.id)
      this.show_edit = false;
      Toast.success('删除成功');
    }





  },
};
</script>
<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  z-index: 10000;
}
.address {
  margin-top: 45px;
  .popup {
    margin-top: 45px;
    width: 100%;
    height: 100%;
  }
}
</style>