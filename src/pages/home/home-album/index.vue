<template>
  <scroll-view class="album_scroll_view"
               scroll-y
               @scrolltolower='handleTolower'>
    <!-- 轮播图 -->
    <view class="album_swiper">
      <swiper autoplay
              indicator-dots
              circular>
        <swiper-item v-for="item in banner"
                     :key="item.id">
          <image :src="item.thumb">
        </swiper-item>
      </swiper>
    </view>
    <!-- 列表 -->
    <view class="album_list">
      <navigator class="album_item"
                 v-for="item in album"
                 :key="item.id"
                 :url="`/pages/album/index?id=${item.id}`"
                 >
        <view class="album_image">
            <image mode='aspectFill'
                   :src="item.cover"></image>
        </view>
        <view class="album_info">
          <view class="album_name">{{item.name}}</view>
          <view class="album_desc">{{item.desc}}</view>
          <view class="album_btn">
            <view class="album_attention">+ 关注</view>
          </view>
        </view>
      </navigator>
    </view>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      params:{
        skip:0,
        limit:30,
        order:"new"
      },
      banner:[],
      album:[],
      hasMore:true
    }
  },
    mounted () {
    uni.setNavigationBarTitle({ title: '专辑' })
    this.getList();
  },
  methods: {
    getList(){
        this.request({
          url:"http://157.122.54.189:9088/image/v1/wallpaper/album",
          data:this.params
        }).then(result=>{
          // console.log(result);
          if(this.banner.length === 0){
          this.banner=result.res.banner;
          }
          if(result.res.album.length ===0){
            this.hasMore=false
            uni.showToast({
            title:"到底啦",
            icon:"none"
        })
            return;
          }
          this.album=[...this.album,...result.res.album];
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
  },  
}
</script>

<style lang="scss" scoped>
.album_scroll_view {
  height: calc(100vh - 36px);
}
.album_swiper{
  swiper{
    height: calc(750rpx/2.3);
    image{
        height: 100%;
    }
  }
}
.album_list {
  padding: 10rpx;
  .album_item {
    padding: 10rpx 0;
    display: flex;
    border-bottom: 1rpx solid #ccc;
    .album_image {
      flex: 1;
      padding: 10rpx;
      image {
        width: 260rpx;
        height: 180rpx;
      }
    }

    .album_info {
      flex: 2;
      padding: 0 10rpx;
      overflow: hidden;
      .album_name {
        font-size: 30rpx;
        color: #000;
        padding: 10rpx 0;
      }

      .album_desc {
        padding: 10rpx 0;
        font-size: 24rpx;

        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .album_btn {
        padding: 10rpx;
        display: flex;
        justify-content: flex-end;
        padding-top: 30rpx;
        .album_attention {
          font-size: 24rpx;
          color: $color;
          border: 1rpx solid $color;
          padding: 10rpx;
        }
      }
    }
  }
}


</style>