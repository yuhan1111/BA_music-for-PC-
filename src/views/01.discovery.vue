<template>
  <div class="discovery-container">
<!-- 轮播图 -->
    <div class="lunbo">
      <el-carousel :interval="4000" type="card" height="200px">
      <!-- 循环获取到的接口数据 -->
      <el-carousel-item v-for="(item, index) in banners" :key="index" @click="">
      <img :src="item.imageUrl" alt="" class="lunbotu">
      </el-carousel-item>
      </el-carousel>
    </div>
    <!-- <div class="el-icon-video-play"></div> -->
  <!-- 推荐歌单s -->
    <div class="recommand-list">
      <h1 class="title">推荐歌单</h1>
      <ul class="items">
        <li class="item" v-for="(item, index) in list" :key="index" @click="toPlayList(item.id)">
          <div class="img-wrap">
            <div class="desc-wrap">
              <span class="desc">{{item.copywriter}}</span>   
            </div>
            <img :src="item.picUrl" alt="">
            <span class="r-icon el-icon-video-play"></span>   
          </div>
          <p class="name">{{item.name}}</p>
        </li>
      </ul>
    </div>
  <!-- 最新歌单e -->
  <!-- 最新音乐s -->
    <div class="newest-list">
      <h1 class="title">最新音乐</h1>
      <ul class="items">
        <li class="item" v-for="(item, index) in songs" :key="index" @click="playMusic(item.id,item.name,item.song.artists[0].name,item.picUrl)">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="">
            <span class="n-icon el-icon-video-play"></span>
          </div>

          <div class="song-wrap">
            <div class="song-name">{{item.name}}</div>
            <div class="singer">{{item.song.artists[0].name}}</div>
          </div>
        </li>
      </ul>
    </div>
  <!-- 最新音乐e -->
  <!-- 推荐MVs -->
    <div class="mv">
      <h1 class="title">推荐MV</h1>
      <ul class="items">
        <li class="item" v-for="(item, index) in mvs" :key="index" @click="toMVPlayer(item.id)">
          <div class="img-wrap">
            <!-- 封面 -->
            <img :src="item.picUrl" alt=""> 
            <span class="m-icon el-icon-video-play"></span>
            <div class="num-wrap">
              <!-- 播放次数图标 -->
              <div class="m-icon2  el-icon-caret-right"></div>
              <!-- 播放次数 -->
              <div class="num">{{item.playCount}}</div>
            </div>
          </div>
          <!-- Mv名 -->
          <div class="info-wrap">
            <div class="name">{{item.name}}</div>
            <div class="singer">{{item.artistName}}</div>
          </div>
          
        </li>
      </ul>
    </div>
  <!-- 最新MVe -->
  </div>
</template>
<script>
//1导入axios
import axios from 'axios'
export default {
  name: 'discovery',
  data(){
    return{
      //轮播图
      banners:[],
      //推荐歌单
      list:[],
      //最新音乐
      songs:[],
      //推荐MV
      mvs:[],
    }
  },
  created() {
   //2轮播图接口
    axios({
      url:'https://autumnfish.cn/banner',
      method: 'get',
    }).then(res =>{
      // console.log(res);
      this.banners = res.data.banners
    }) 
    //推荐歌单 
    axios({
      url:'https://autumnfish.cn/personalized',
      method: 'get',
      params:{
        //控制获取的数据量
        limit:12
      },
    }).then(res =>{
      this.list = res.data.result     
    }) 
    //最新音乐
    axios({
      url:'https://autumnfish.cn/personalized/newsong',
      method:'get',
    }).then(res=>{
      // console.log(res);
      this.songs = res.data.result 
    })
    //最新MV
    axios({
      url:'https://autumnfish.cn/personalized/mv',
      method:'get',
    }).then(res=>{
      // console.log(res);    
      this.mvs = res.data.result
    })
  },
  methods: {
    playMusic(id,name,rname,purl){
      // console.log(id);
      this.$parent.musicName = name
      this.$parent.rName = rname
      this.$parent.picUrl = purl
      axios({
        url:"https://autumnfish.cn/song/url",
        method: "get",
        params:{
          id:id
        },
      }).then(res=>{
        // console.log(res);
        let url = res.data.data[0].url //这里涉及倒要传递url到其他组件，所以赋值到变量url以方便传递
        // console.log(this.$parent.musicUrl);
        this.$parent.musicUrl = url //设置给父组件的播放地址      
      })
      
    },
    toMVPlayer(id){
      this.$router.push(`/mv?q=${id}`) 
    },
    toPlayList(id){
      this.$router.push(`/playlist?q=${id}`)
    }
  }
}
</script>

<style>

li {
  list-style: none;
}
.discovery-container {
    width: 950px;
}
/* focus start */
.discovery-container .lunbo {
  margin: 0 auto;
  width: 902px;
}
.discovery-container .el-carousel__container {
  width: 100%;
}
.discovery-container .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
.discovery-container .el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
  box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
}
.discovery-container .el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
  box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
}
.discovery-container .el-carousel__item {
  width: 450px;
  height: 166px;
  
}
.discovery-container .el-carousel__item .lunbotu {
  width: 100%;
}
.discovery-container .el-carousel__arrow {
  margin-top: -20px;
  background-color: rgba(0,0,0,0.9);
  box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
}
/* focus end */

/* recommand-list  start*/
.recommand-list {
  overflow: hidden;
  width: 100%;
  margin: 10px auto;
}
.recommand-list .title {
  font-size: 20px;
}
.recommand-list .items .item{
  float: left;
  width: 177px;
  height: 130px;
  margin: 10px 20px 0 0;
}
.recommand-list .item .img-wrap {
  position: relative;
  width: 100%;
  height: 100px;
  overflow: hidden;
  border-radius: 5px;
  vertical-align: baseline;
  margin-bottom: 10px;
  box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
}
.recommand-list .item .img-wrap img {
  position: absolute;
  display: block;
  left: 0;
  top: -65px;
  width: 100%;
}

.recommand-list .item .img-wrap .r-icon {
  position: absolute;
  display: none;
  text-align: center;
  line-height: 100px;
  top: 0;
  left: 0;
  font-size: 40px;
  color: white;
  width: 100%;
  height: 100%;
  z-index: 8;
}
.recommand-list .img-wrap .desc-wrap {
  position: absolute;
  display: none;
  width: 100%;
  height: 30px;
  top: 0;
  left: 0;
  z-index: 9;
}
.recommand-list .img-wrap:hover .desc-wrap {
  display: block;
}
.recommand-list .img-wrap:hover .r-icon {
  display: block;
}

.recommand-list .img-wrap .desc {
  display: block;
  overflow: hidden;
  height: 100%;
  font-size: 10px;
  color: white;
  width: 100%;
  background-color: rgba(0,0,0,0.5);
}

.recommand-list .item .name {
  height: 20px;
  width: 100%;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* recommand-list  end*/

/* newest-list start */
.newest-list {
  overflow: hidden;
  width: 100%;
}
.newest-list .title {
  font-size: 20px;
}
.newest-list .items {
  margin: 0 auto;
}
.newest-list .items .item {
  display: flex;
  float: left;
  width: 400px;
  border-radius: 10px;
  margin: 15px 40px 0 0;
}
.newest-list .items .item:hover {
  background-color: rgba(0,0,0,0.05);
}
.newest-list .item .img-wrap {
  position: relative;
  width: 100px;
  height: 100px;
  float: left;
  margin-right: 10px;
  box-shadow: 0 15px 20px -5px rgba(0,0,0,.7);
}
.newest-list .item .img-wrap img {
  width: 100%;
  height: 100%;
}
.newest-list .item .song-wrap {
  float: left;
  flex: 1;
}
.newest-list .song-wrap .song-name {
  height: 50px;
  line-height: 60px;
  overflow: hidden;
}
.newest-list .song-wrap .singer {
  height: 50px;
  line-height: 40px;
  font-size: 12px;
  color: #aaf;
  overflow: hidden;
}
.newest-list .n-icon {
  position: absolute;
  width: 100px;
  height: 100px;
  background: rgba(0,0,0,0.3);
  display: none;
  top: 0;
  left: 0;
}
.newest-list .n-icon::before {
  display: inline-block;
  text-align: center;
  line-height: 100px;
  font-size: 50px;
  width: 100%;
  height: 100%;
}
.newest-list .img-wrap:hover .n-icon {
  position: absolute;
  display: block;
  width: 100px;
  height: 100px;
  background: rgba(0,0,0,0.3);
  top: 0;
  left: 0;
}
/* newest-list end */

/* mvs start */
.mv {
  margin-top: 10px;
  background-color: white!important;
  margin-bottom: 60px;
}
.mv .title {
  font-size: 20px;
}
.mv .items .item {
  float: left;
  margin: 15px 20px 0 0;

  width: 200px;
  height: 152px;

}
.mv .items .img-wrap {
  position: relative;
  width: 200px;
  height: 112px;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
}
.mv .items .img-wrap img {
  width: 100%;
  height: 100%;
}
.mv .items .img-wrap .num-wrap {
  position: absolute;
  display: flex;
  margin-top: 4px;
  height: 20px;
  width: 80px;
  top: 0px;
  right: 0px;
}
.mv .items .img-wrap .num-wrap .m-icon2 {
  font-size: 16px;
  float: left;
  color: white;
  line-height: 20px;
  width: 20px;
}
.mv .items .img-wrap .num-wrap .num {
  float: left;
  flex: 1;
  color: white;
  font-size: 14px;
  line-height: 20px;
  width: 20px;
}
.mv .items .img-wrap .m-icon {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  top:0px;
  left:0px;
  text-align: center;
  line-height: 112px;
  font-size: 50px;
  background-color: rgba(0,0,0,0.3);

}
.mv .img-wrap:hover .m-icon {
  display: block;
}
.mv .items .info-wrap {
  width: 200px;
  height: 40px;
}
.mv .items .info-wrap .name {
  width: 100%;
  height: 20px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

}
.mv .items .info-wrap .singer {
  width: 100%;
  height: 20px;
  font-size: 10px;
  color: #ccc;
}

/* mv end */
</style>