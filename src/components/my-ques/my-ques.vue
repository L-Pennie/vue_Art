<template>
  <div class="my-ques">
    <app-header title="我的问题" class="header" />
    <div class="list">
      <div>
        <van-swipe-cell v-for="(item,index) in quesList" :key="item.question_id">
          <van-cell
            :border="true"
            :title="num+index+1+'.'+item.title"
            @click="to_detail(item.question_id)"
          />
          <template #right>
            <van-button square type="danger" text="删除" @click="to_delete(item.question_id)" />
          </template>
        </van-swipe-cell>
      </div>
    </div>
    <van-pagination
      class="page"
      v-model="currentPage"
      :page-count="totalPage"
      @change="pageChange"
      mode="simple"
    />
  </div>
</template>
<script>
import AppHeader from "@/base/header/header";
import { GET_MY_QUESTION, DELETE_QUESTION } from '@/api'
import { handleResponse } from '@/assets/js/common'
import { Dialog, Toast } from 'vant';

export default {
  data() {
    return {
      currentPage: 1,
      page: 1,
      totalPage: 1,
      quesList: [],
      maxScrollY: null,
      num: 0
    }
  },
  components: {
    AppHeader,
  },
  created() {
    this._reqMyQues()

  },
  methods: {
    to_detail(id) {
      this.$router.push(`/ask/details?id=${id}`)
    },
    to_delete(id) {
      Dialog.confirm({
        message: '确认删除？',
      })
        .then(() => {
          DELETE_QUESTION(id).then(res => {
            handleResponse(res, () => {
              this._reqMyQues()
            })
          })
        })
        .catch(() => {
          // on cancel
        });

    },
    _reqMyQues() {
      GET_MY_QUESTION(this.page).then(res => {
        handleResponse(res, () => {
          if (res.data.list && res.data.list.length) {
            this.quesList = res.data.list
            this.num = (this.page - 1) * 20
            this.totalPage = res.data.totalPage
          }
        })
      })
    },
    pageChange(page) {
      this.page = page
      this.list = []
      this._reqMyQues()
    },
  }
};
</script>
<style lang="less" scope>
.header {
  position: fixed;
  top: 0;
}
.list {
  margin-top: 48px;
  margin-bottom: 50px;
}
.van-cell {
  .van-cell__title {
    font-size: 18px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    letter-spacing: 2px;
  }

  .goods-card {
    margin: 0;
    background-color: white;
  }

  .delete-button {
    height: 100%;
  }
}
.page {
  position: fixed;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  height: 50px;
  background-color: white;
}
</style>
