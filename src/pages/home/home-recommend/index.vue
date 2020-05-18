<template>
  <scroll-view @scrolltolower="handleTolower"
               class="recommends_view"
               scroll-y
               v-if="recommends.length>0">
<!-- 推荐模块 -->
<view class="recommend_wrap">
  <navigator 
      class="recommend_item"
      v-for="item in recommends"
      :key="item.id"
      :url="`/pages/album/index?id=${item.target}`"
      >
    <image mode="widthFix"
    :src="item.thumb">
  </navigator>
</view>
<!-- 月份模块 -->
<view class="moneths_wrap">
    <view class="moneths_title">
        <view class="moneths_title_info">
          <view class="moneths_info">
            <text>{{monthes.DD}}/</text>
            {{monthes.MM}}月
          </view>
          <view class="moneths_text">{{monthes.title}}</view>
        </view>
        <view class="moneths_title_more">更多</view>
    </view>
      <view class="monthes_content">
        <view class="monthes_item"
              v-for="(item,index) in monthes.items"
              :key="item.id">
          <!-- 父传子 -->
          <go-detail :list='monthes.items'
                     :index='index'>
            <image mode='aspectFill'
                   :src="item.thumb+item.rule.replace('$<Height>',360)">
            </image>
          </go-detail>
        </view>
      </view>
</view>
<!-- 热门 -->
    <view class="hots_wrap">
      <view class="hots_title">
        <text> 热门 </text>
      </view>
      <view class="hots_content">
        <view class="hots_item"
              v-for="(item,index) in hots"
              :key="item.id">
          <go-detail :list='hots'
                     :index='index'>
            <image mode='widthFix'
                   :src="item.thumb">
            </image>
          </go-detail>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import moment from 'moment';
import goDetail from "@/components/goDetail"
export default {
  components:{
    goDetail
  },
  data(){
    return{
      recommends:[],
      monthes:{},
      hots:[],
      params:{
        limit:30,
        order:'hot',
        skip:0
      },
      hasMore:true
    }
  },
  mounted() {
    uni.setNavigationBarTitle({ title: '推荐' })
    this.getList()
  },
  methods: {
    async getList(){
      this.request({
      url:"http://157.122.54.189:9088/image/v3/homepage/vertical",
      data:this.params
    })
    .then(result=>{
            
        if (result.res.vertical === 0) {
            this.hasMore = false;
            uni.showToast({
            title:"到底啦"
           })
            return;
         }

      if(this.recommends.length === 0){
      this.recommends=result.res.homepage[1].items;
      this.monthes=result.res.homepage[2];
      this.monthes.MM=moment(this.monthes.stime).format('MM');
      this.monthes.DD=moment(this.monthes.stime).format('DD');
      // console.log(this.monthes);
      // console.log(result);
      }
      else{
      this.hots = [...this.hots, ...result.res.vertical];
      }
    })
  },
  handleTolower(){
    if(this.hasMore){
      this.params.skip+=this.params.limit;
      this.getList();
    }else{
      uni.showToast({
        title:"到底啦",
        icon:"none"
      })
    }
  }
}
}
</script>

<style lang="scss" scoped>

.recommends_view {
  height: calc(100vh - 36px);
}
.recommend_wrap {
  display: flex;
  flex-wrap: wrap;
  .recommend_item {
    width: 50%;
    border: 5rrpx solid #fff;
  }
}

.moneths_wrap {
  .moneths_title {
    display: flex;
    justify-content: space-between;
    padding: 20rpx;
    .moneths_title_info {
      color: $color;
      font-size: 30rpx;
      font-weight: 600;
      display: flex;
      .moneths_info {
        text {
          font-size: 36rpx;
        }
      }

      .moneths_text {
        color: #555;
        font-size: 34rpx;
        margin-left: 30rpx;
      }
    }

    .moneths_title_more {
        color:$color;
        font-size: 30rpx;
    }
  }
   .monthes_content {
    display: flex;
    flex-wrap: wrap;
    .monthes_item {
      width: 33.33%;
      border: 5rpx solid #fff;
    }
  }
}
.hots_wrap {
  .hots_title {
    padding: 20rpx;
    text {
      border-left: 20rpx solid $color;
      padding-left: 20rpx;
      font-size: 34rpx;
      font-weight: 600;
    }
  }

  .hots_content {
    display: flex;
    flex-wrap: wrap;
    .hots_item {
      width: 33.33%;
      border: 5rpx solid #fff;
    }
  }
}
</style>