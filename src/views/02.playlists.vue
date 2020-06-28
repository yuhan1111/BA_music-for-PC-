<template>
  <div class="playlists-container">
    <div class="top-card">
      <div class="icon-wrap">
        <!-- 封面图片 -->
        <img :src="topList.coverImgUrl" alt="">
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <!-- 标题 -->
        <div class="title">
          {{topList.name}}
        </div>
        <!-- 介绍 -->
        <div class="info">
          {{topList.description}}
        </div>
      </div>
    </div>
    <!-- top-card背景图片 -->
    <div class="bg"><img :src="topList.coverImgUrl" alt="" class="bgs"></div>
    <div class="bg-mask"></div>
    <!-- tab栏顶部 -->
    <div class="tab-container">
      <div class="tab-bar">
        <span class="item" :class="{active:tag=='全部'}" @click="tag='全部'">全部</span>
        <span class="item" :class="{active:tag=='欧美'}" @click="tag='欧美'">欧美</span>
        <span class="item" :class="{active:tag=='华语'}" @click="tag='华语'">华语</span>
        <span class="item" :class="{active:tag=='流行'}" @click="tag='流行'">流行</span>
        <span class="item" :class="{active:tag=='说唱'}" @click="tag='说唱'">说唱</span>
        <span class="item" :class="{active:tag=='摇滚'}" @click="tag='摇滚'">摇滚</span>
        <span class="item" :class="{active:tag=='民谣'}" @click="tag='民谣'">民谣</span>
        <span class="item" :class="{active:tag=='电子'}" @click="tag='电子'">电子</span>
        <span class="item" :class="{active:tag=='轻音乐'}" @click="tag='轻音乐'">轻音乐</span>
        <span class="item" :class="{active:tag=='影视原声'}" @click="tag='影视原声'">影视原声</span>
        <span class="item" :class="{active:tag=='ACG'}" @click="tag='ACG'">ACG</span>
        <span class="item" :class="{active:tag=='怀旧'}" @click="tag='怀旧'">怀旧</span>
        <span class="item" :class="{active:tag=='治愈'}" @click="tag='治愈'">治愈</span>
        <span class="item" :class="{active:tag=='旅行'}" @click="tag='旅行'">旅行</span>
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <ul class="items">
          <li class="item" v-for="(item, index) in list" :key="index"  @click="toPlayList(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount}}</span>
              </div>
              <!-- 封面 -->
              <img :src="item.coverImgUrl" alt="">
              <span class="tc-p el-icon-video-play"></span>           
            </div>
            <p class="name">{{item.name}}</p>
          </li>
        </ul>
      </div>
    </div>

    <!-- 分页器 -->
    <!-- total 总item数 -->
    <!-- current-page 当前页 -->
    <!-- page-size 每页多少条数据 -->
    <!-- @current-change 页码改变事件 -->
    <!-- 到methods里面调用 handleCurrentChange-->
    <el-pagination class="p-page"
      @current-change="handleCurrentChange"      
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="10">
    </el-pagination>
  </div>
</template>

<script>
//导入axios
import axios from 'axios'
export default {
  name: 'recommand',
  data(){
    return{ //起始值
      //item数
      total:0,
      //页码
      page:1,
      //顶部的推荐歌单
      topList:{},
      list:[],
      tag:"全部",
      //offset 页码改变的时候改变offset        
    }
  },
  //侦听器
  watch:{
    tag(){
      //精品歌单
    this.topData()  
      //歌单列表
    this.listData()
      //监听到tag发生改变时触发 实现你点击了分页符后再点击其他tag分页符自动跳转到第一页这个功能
    this.page = 1
    }   
  },
  created(){
    //精品歌单
    this.topData()
    //歌单列表
    this.listData()
  },
  methods: {
    //抽取的方法1 精品歌单数据 //因为这两个接口及参数多个地方调用，直接将他写成方法调用
    topData(){
      axios({
      url:'https://autumnfish.cn/top/playlist/highquality',
      method:'get',
      params: {
        limit:1,
        // 分类数据
        cat: this.tag,
      }
    }).then(res=>{ 
      // console.log(res);
      this.topList = res.data.playlists[0]
    })
    },

    //抽取的方法2 歌单列表 
    listData(){
      axios({
      url:'https://autumnfish.cn/top/playlist/',
      method:'get',
      params:{
        limit:10, //每页要显示的item数
        // offset:0, 起始值 offset:偏移数量，用于分页，如：（页数-1）*每页要显示的item数
        offset: (this.page-1)*10,
        // 分类数据
        cat: this.tag,
      }
    }).then(res=>{
      // console.log(res);
      this.total =res.data.total
      this.list = res.data.playlists
    })
    },
    toPlayList(id){
      this.$router.push(`/playlist?q=${id}`)
    },
    //页码改变事件
    handleCurrentChange(val){
      // console.log(`当前页：${val}`);
      // 保存页码
      this.page = val
      // 重新获取数据 即时更新列表
      this.listData()
    }
  }

}

</script>

<style>
.playlists-container {
  width: 950px;
  position: relative;
  overflow: hidden;
}
.playlists-container .top-card {
  position: relative;
  z-index: 4;
  display: flex;
  width: 100%;
  height: 150px;
  box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
  
}
.playlists-container .top-card .icon-wrap {
  box-sizing: border-box;
  width: 150px;
  height: 150px;
  padding: 15px;
  border-radius: 10px;
  overflow: hidden;
}
.playlists-container .top-card .icon-wrap img {
  width: 100%;
  height: 100%;
}
.playlists-container .top-card .content-wrap {
  box-sizing: border-box;
  flex: 1;
  height: 150px;
  padding: 15px;
  padding-left: 0;

}
.playlists-container .top-card .content-wrap .tag {
  box-sizing: border-box;
  margin-bottom: 5px;
  height: 25px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  width: 100px;
  border: 1px solid white;
  border-radius: 5px;
  color: aqua;
}
.playlists-container .top-card .content-wrap .title {
  margin-bottom: 5px;
  height: 20px;
  font-weight: 700;
  color: white;
  font-size: 14px;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
}
.playlists-container .top-card .content-wrap .info {
  height: 70px;
  font-size: 8px;
  color: #aef;
  line-height: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.playlists-container .bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 150px;
  overflow: hidden;
}
.playlists-container .bg .bgs {
  width: 100%;
  
}
.playlists-container .bg-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 150px;
  z-index: 3;
  background: rgba(0,0,0,.1);
}
/* top-card end */

/* tab-container start */
.playlists-container .tab-bar {
  text-align: right;
  overflow: hidden;
  width: 950px;
  margin: 25px auto;
}
.playlists-container .tab-bar .item {
  margin-left: 15px;
  font-size: 14px;
  color: #a5b3a0;
  cursor: pointer;
}
.playlists-container .tab-bar .active {
  color: gold;
}
.playlists-container .tab-content {
  width: 950px;
  overflow: hidden;
}
.playlists-container .tab-content .items {
  width: 950px;
}
.playlists-container .tab-content .items .item {
  position: relative;
  float: left;
  width: 160px;
  height: 180px;
  margin-right: 22.5px;
  margin-bottom: 22.5px;
}
.playlists-container .tab-content .items .item .img-wrap {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
}
.playlists-container .tab-content .items .item .img-wrap .num-wrap {
  box-sizing: border-box;
  position: absolute;
  display: none;
  color: white;
  height: 20px;
  line-height: 20px;
  padding-left: 10px;
  font-size: 12px;
  width: 100%;
  background-color: rgba(0,0,0,.4);
}
.playlists-container .tab-content .items .item .img-wrap:hover .num-wrap {
  display: block;
}
.playlists-container .tab-content .items .item .img-wrap img {
  width: 100%;
  height: 100%;
}
.playlists-container .tab-content .items .item .img-wrap .tc-p {
  position: absolute;
  display: none;
  width: 100%;
  height: 100%;
  font-size: 60px;
  color: white;
  text-align: center;
  line-height: 160px;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,.3);
}
.playlists-container .tab-content .items .item .img-wrap:hover .tc-p{
  display: block;
}
.playlists-container .tab-content .items .item .name {
  position: absolute;
  bottom: -10px;
  width: 160px;
  height: 20px;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.playlists-container .p-page {
  width: 420px;
  margin: 20px auto;
}
/* tab-container end */

</style>