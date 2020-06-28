<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{$route.query.q}}</h2>
      <span class="sub-title">搜索到{{songCount}}个结果</span>
    </div>
    <!-- 列表 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="歌曲" name="songs" class="el-songs">
        <div class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr class="el-table__row" v-for="(item,index) in songlist" :key="index" >
              <td>{{index+1}}</td>
              <td>
                <div class="song-wrap" @click="playMusic(item.id,item.name,item.artists[0].name,item.picUrl)">
                  <div class="name-wrap">
                    <span>{{item.name}}</span>
                    <!-- mv图标 -->
                    <span v-if="item.mvid!=0" class="el-icon-video-play"></span>
                  </div>
                  <span v-if="item.alias.length!=0" class="sub-name">{{item.alias[0]}}</span>
                  <!-- v-if 表示若满足alias里面字节不为空则{{item.alias[0]}}正常取值，否则不显示 -->
                </div>
              </td>
              <td>{{item.artists[0].name}}</td>
              <td>{{item.album.name}}</td>
              <td>{{item.duration}}</td>
            </tr>
          </tbody>
        </div>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists" class="el-lists">
        <div class="items">
          <div class="item" v-for="(item, index) in playlists" :key="index" @click="toPlayList(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{item.playCount}}</span>
              </div>
              <img :src="item.coverImgUrl" alt="">
              <div class="el-icon-video-play r-icon"></div>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv" class="el-mv">
        <div class="items">
          <div class="item" v-for="(item,index) in mvlists" :key="index" @click="toMV(item.id,item.name,item.artistName)">
            <div class="img-wrap">
              <img :src="item.cover" alt="">
              <div class="el-icon-video-play r-icon"></div>
              <div class="num-wrap">
                <div class="num el-icon-view">{{item.playCount}}</div>
              </div>
              <span class="time">{{item.duration}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">
                <div class="mv-name">{{item.name}}</div>
                <div class="singer-name">{{item.artistName}}</div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>    
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name:'result',
  data(){
    return{
      activeName:'songs',
      songlist:[],//歌曲数
      playlists:[],//歌单数
      mvlists:[],//mv数
      songCount:'',
      keyword:this.$route.query.q,
    }
  },
  watch:{
    activeName(){//侦听songs、lists、mv之间的切换,根据type刷新页面数据
      let type = 1; //设置默认为1
      let limit = 10; //设置默认值为10
      switch(this.activeName){
        case 'songs':
          type = 1;
          limit = 20;
          break;
        case 'lists':
          type = 1000;
          limit = 12;
          break;
        case 'mv':
          type = 1004;
          limit = 12;
          break;
          default:
          break;  
      }
      axios({
        url:'https://autumnfish.cn/search',
        method:'get',
        params: {
          keywords:this.$route.query.q,
          type:type,
          // 控制获取数据量为10条
          limit,
        },
      }).then(res=>{
        // console.log(res);
        if(type == 1){
          //歌曲的res
          // console.log(res);
          this.songlist = res.data.result.songs
          this.songCount = res.data.result.songCount //歌曲的搜索结果
          for(let i = 0; i<this.songlist.length;i++){
            let duration = this.songlist[i].duration
            let min = parseInt(duration/1000/60)
            min = min < 10 ? '0' + min : min
            let sec = parseInt(duration/1000%60)
            sec = sec < 10 ? '0' + sec : sec
            // console.log(min +':'+ sec);
            let durations = min +':'+ sec;
            this.songlist[i].duration = `${min}:${sec}`
          }
        } else if(type == 1000){
          // console.log(res);
          // 歌单 的res
          this.playlists = res.data.result.playlists
          //计数     
          this.songCount = res.data.result.playlistCount  //歌单的搜索结果 
          for(let i = 0; i < this.playlists.length; i++){
          this.playlists[i].playCount = this.playlists[i].playCount > 10000 ? parseInt(this.playlists[i].playCount / 10000) + '万': this.playlists[i].playCount
          }    
        } else {
          //获取mv的res
          // console.log(res);
          this.mvlists = res.data.result.mvs
          this.songCount =res.data.result.mvCount //mv的搜索结果（数量）
          for(let i = 0; i<this.mvlists.length;i++){
            let duration = this.mvlists[i].duration
            let min = parseInt(duration/1000/60)
            min = min < 10 ? '0' + min : min
            let sec = parseInt(duration/1000%60)
            sec = sec < 10 ? '0' + sec : sec
            // console.log(min +':'+ sec);
            let durations = min +':'+ sec;
            this.mvlists[i].duration = `${min}:${sec}`
          }
          for(let i = 0; i < this.mvlists.length; i++){
          this.mvlists[i].playCount = this.mvlists[i].playCount > 10000 ? parseInt(this.mvlists[i].playCount / 10000) + '万': this.mvlists[i].playCount
          }    
        }       
      })   
    },
    // 监听路由地址发生变化，再次请求数据，根据type刷新页面
    "$route": function(){
      let type = 1; 
      let limit = 10;
      switch(this.activeName){
        case 'songs':
          type = 1;
          limit = 20;
          break;
        case 'lists':
          type = 1000;
          limit = 12;
          break;
        case 'mv':
          type = 1004;
          limit = 12;
          break;
          default:
          break;  
      }
      axios({
        url:'https://autumnfish.cn/search',
        method:'get',
        params: {
          keywords:this.$route.query.q,
          type:type,
          // 控制获取数据量为10条
          limit,
        },
      }).then(res=>{
        // console.log(res);
        if(type == 1){
          //歌曲的res
          // console.log(res);
          this.songlist = res.data.result.songs
          this.songCount = res.data.result.songCount //歌曲的搜索结果
          for(let i = 0; i<this.songlist.length;i++){
            let duration = this.songlist[i].duration
            let min = parseInt(duration/1000/60)
            min = min < 10 ? '0' + min : min
            let sec = parseInt(duration/1000%60)
            sec = sec < 10 ? '0' + sec : sec
            // console.log(min +':'+ sec);
            let durations = min +':'+ sec;
            this.songlist[i].duration = `${min}:${sec}`
          }
        } else if(type == 1000){
          // console.log(res);
          // 歌单 的res
          this.playlists = res.data.result.playlists
          //计数     
          this.songCount = res.data.result.playlistCount  //歌单的搜索结果 
          for(let i = 0; i < this.playlists.length; i++){
          this.playlists[i].playCount = this.playlists[i].playCount > 10000 ? parseInt(this.playlists[i].playCount / 10000) + '万': this.playlists[i].playCount
          }    
        } else {
          //获取mv的res
          // console.log(res);
          this.mvlists = res.data.result.mvs
          this.songCount =res.data.result.mvCount //mv的搜索结果（数量）
          for(let i = 0; i<this.mvlists.length;i++){
            let duration = this.mvlists[i].duration
            let min = parseInt(duration/1000/60)
            min = min < 10 ? '0' + min : min
            let sec = parseInt(duration/1000%60)
            sec = sec < 10 ? '0' + sec : sec
            // console.log(min +':'+ sec);
            let durations = min +':'+ sec;
            this.mvlists[i].duration = `${min}:${sec}`
          }
          for(let i = 0; i < this.mvlists.length; i++){
          this.mvlists[i].playCount = this.mvlists[i].playCount > 10000 ? parseInt(this.mvlists[i].playCount / 10000) + '万': this.mvlists[i].playCount
          }    
        }       
      })
    }  
  },
  methods:{
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
        let url = res.data.data[0].url //这里涉及倒要传递url到其他组件，所以赋值到变量url以方便传递
        // console.log(this.$parent.musicUrl);
        this.$parent.musicUrl = url //设置给父组件的播放地址      
      })      
    },
    getList(){
      axios({
        url:'https://autumnfish.cn/search',
        method:'get',
        params: {
          keywords:this.$route.query.q,
          type:'1',
          // 控制获取数据量为10条
          limit: 20,
        },
      }).then(res=>{
        // console.log(res);
        this.songlist = res.data.result.songs
        this.songCount = res.data.result.songCount
        for(let i = 0; i<this.songlist.length;i++){
          let duration = this.songlist[i].duration
          let min = parseInt(duration/1000/60)
          min = min < 10 ? '0' + min : min
          let sec = parseInt(duration/1000%60)
          sec = sec < 10 ? '0' + sec : sec
          // console.log(min +':'+ sec);
          let durations = min +':'+ sec;
          this.songlist[i].duration = `${min}:${sec}`
        }       
      })
    },
    //05.result页面点击item跳转到歌单详情组件带上（item.id）参数
    toPlayList(id){ //跳转并且携带数据
      this.$router.push(`/playlist?q=${id}`)
    },
    toMV(id,name,rname){ //携带id跳转到MV页面
      this.$router.push(`/mv?q=${id}&n=${name}&r=${rname}`)
    }
  },
  created(){
    // console.log(this.$route);
    // console.log(this.$route.query.q);
    this.getList();
  },
} 
</script>

<style>
.result-container{
  width: 950px;
}

/* title-wrap start */
.result-container .title-wrap {
  width: 100%;
  margin-bottom: 20px;
}
.result-container .title-wrap .title {
  margin-bottom: 10px;
}
.result-container .title-wrap .sub-title {
  font-size: 14px;
  color: yellowgreen;
}
/* title-wrap end */

/* song start */
.result-container .el-tabs__header {
  box-sizing: border-box;
  padding: 10px;
  /* box-shadow: 0 10px 15px -5px rgba(0,0,0,.2); */
}
.result-container .el-tabs__content {
  box-sizing: border-box;
  padding: 10px;
  padding-bottom: 40px;
}
.result-container .el-table tbody tr {
  cursor: pointer;
  transition: ease-in-out .2s;
  
}
.result-container .el-table tbody tr:nth-child(2n){
  background-color: #f1ffff;
}
.result-container .el-table tbody tr:hover {
  background-color: #acf;
  transform: translateX(20px);
  box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
}
.result-container .el-table tbody td .sub-name {
  color: #aaaaaa;
}
.result-container .el-table tbody td {
  border: none;
}
.result-container .el-table tbody td:nth-child(1) {
  width: 20px;
  padding: 0 40px 0 10px;
}
.result-container .el-table tbody td:nth-child(2) {
  width: 300px;
}
.result-container .el-table tbody td:nth-child(3) {
  width: 150px;
}
.result-container .el-table tbody td:nth-child(4) {
  width: 300px;
}
.result-container .el-table tbody td:nth-child(5) {
  width: 100px;
}
/* song end */

/* song list start */
.result-container .el-lists .items .item {
  float: left;
  width: 190px;
  height: 190px;
  margin: 20px 20px 20px 20px;
}
.result-container .el-lists .items .item .img-wrap{
  position: relative;
  text-align: right;
  width: 100%;
  height: 190px;
  background-color: skyblue;
  margin-bottom: 10px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
}
.result-container .el-lists .items .item .img-wrap .num-wrap {
  position: absolute;
  right: 10px;
  color: white;
  font-size: 14px;
}
.result-container .el-lists .items .item .img-wrap img {
  height:100%;
}
.result-container .el-lists .items .item .img-wrap .r-icon {
  display: none;
  position: absolute;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 60px;
  top: 0;
  left: 0;
  text-align: center;
  line-height: 190px;
  background-color: rgba(0,0,0,.3);
}
.result-container .el-lists .items .item .img-wrap:hover .r-icon {
  display: block;
}
.result-container .el-lists .items .item .name{
  box-sizing: border-box;
  overflow: hidden;
  padding:0px 5px 0px 5px;
  width: 100%;
  height: 20px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/* song list end */

/* mv start */
.result-container .el-mv .items .item {
  float: left;
  width: 213px;
  height: 165px;
  margin: 10px 30px 10px 10px;
}
.result-container .el-mv .items .item .img-wrap{
  position: relative;
  text-align: right;
  width: 100%;
  height: 120px;
  background-color: skyblue;
  margin-bottom: 5px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
}
.result-container .el-mv .items .item .img-wrap .num-wrap {
  position: absolute;
  right: 10px;
  color: white;
  font-size: 14px;
  top: 0px;
}
.result-container .el-mv .items .item .img-wrap img {
  height:100%;
}
.result-container .el-mv .items .item .img-wrap .time {
  position: absolute;
  color: white;
  right: 10px;
  bottom: 0px;
  font-size: 14px;
}
.result-container .el-mv .items .item .img-wrap .r-icon {
  display: none;
  position: absolute;
  color: white;
  font-size: 60px;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,.3);
  text-align: center;
  line-height: 120px;
}
.result-container .el-mv .items .item .img-wrap:hover .r-icon {
  display: block;
}
.result-container .el-mv .items .item .name{
  box-sizing: border-box;
  overflow: hidden;
  padding-left: 5px;
  padding-right: 5px;
  width: 100%;
  height: 40px;
  color: #0a0a00;
  font-size: 14px;
}
.result-container .el-mv .items .item .name .mv-name {
  height: 20px;
  overflow: hidden;
}
.result-container .el-mv .items .item .name .singer-name {
  height: 20px;
  color: #acf;
}
/* mv end */

</style>