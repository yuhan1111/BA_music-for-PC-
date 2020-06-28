<template>
  <div class="songs-container">
    <div class="tab-bar">
      <span class="item" @click="tag=0" :class="{active:tag==0}">全部</span>
      <span class="item" @click="tag=7" :class="{active:tag==7}">华语</span>
      <span class="item" @click="tag=96" :class="{active:tag==96}">欧美</span>
      <span class="item" @click="tag=8" :class="{active:tag==8}">日本</span>
      <span class="item" @click="tag=16" :class="{active:tag==16}">韩国</span>
    </div>
    <div class="btn">
      <input type="button" @click="playAll" value="播放全部" class="playAll">
    </div>
    <!-- 底部table -->
    <table class="el-table playlist-table">
      <thead>
        <th></th>
        <th></th>
        <th>歌曲名</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
        <th></th>
      </thead>
      <tbody>
        <tr class="el-table__row" v-for="(item, index) in lists" :key="index" @click="playMusic(item.id,item.album.name,item.artists[0].name,item.album.picUrl,index)">
          <td>{{index+1}}</td>
          <td>
            <div class="img-wrap">
              <img :src="item.album.picUrl" alt="">
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{item.album.name}}</span>
                <span></span>
              </div>
              <span>{{item.album.description}}</span>
            </div>
          </td>
          <td>{{item.artists[0].name}}</td>
          <td>{{item.album.name}}</td>
          <td>{{item.duration}}</td>
          <td>
            <div class="el-icon-video-play p-icon"></div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name:'songs',
  data(){
    return{
      lists:[],
      tag:'0',
    };
  },
  //侦听
  watch:{
    tag(){
      this.getList();
    }
  },
  created(){
    this.getList();
  },
  methods:{
    getList(){
      axios({
        url:'https://autumnfish.cn/top/song',
        method:'get',
        params:{
          type: this.tag,
          limit:100,
        }   
      }).then(res=>{
        // console.log(res);
        this.lists = res.data.data
        //处理时间格式
        for(let i = 0; i<this.lists.length;i++){
          let duration = this.lists[i].duration
          let min = parseInt(duration/1000/60)
          min = min < 10 ? '0' + min : min
          let sec = parseInt(duration/1000%60)
          sec = sec < 10 ? '0' + sec : sec
          // console.log(min +':'+ sec);
          let durations = min +':'+ sec;
          this.lists[i].duration = `${min}:${sec}`
        } 
      })
    },
    playMusic(id,name,rname,purl,index){
      this.$parent.musicName = name
      this.$parent.rName = rname
      this.$parent.picUrl = purl
      this.$parent.currentIndex = index

      axios({
        url:'https://autumnfish.cn/song/url',
        method:'get',
        params:{
          id:id,
        },
      }).then(res=>{
        // console.log(res);
        let url = res.data.data[0].url
        // console.log(url);     
        // console.log(this.$parent); 
        this.$parent.musicUrl = url;       
      })
    },
    playAll(){
      axios({
        url:'https://autumnfish.cn/top/song',
        method:'get',
        params:{
          type: this.tag,
          limit:100,
        }   
      }).then(res=>{
        // console.log(res);
        let songs = res.data.data
        // console.log(songs);
        this.$parent.songs = songs;
        
      })
    }
  }
};
</script>

<style>
.songs-container {
  width: 950px;
}
.songs-container .tab-bar {
  float: left;
  height: 20px;
  line-height: 20px;
  margin: 0 0 20px 0;
  box-sizing: border-box;
  width: 90%;
  font-size: 16px;
  font-weight: 600;
  color: yellowgreen;
}
.songs-container .btn {
  position: relative;
  width: 10%;
  height: 20px;
  float: left;
  
}
.songs-container .btn .playAll {
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
  cursor: pointer;
  border-radius: 40px;
  padding: 5px 10px;
  box-shadow: 0 15px 11px -5px rgba(0,0,0,.3);
  border: none;
  outline: none;
  color: #6495ED;
  background-color: #DCE2F1;
  font-weight: 600;
}
.songs-container .tab-bar .item {
  margin-right: 30px;
  cursor: pointer;
}
.songs-container .playlist-table {
  border-collapse: collapse;
  border: none;
}
.songs-container .playlist-table tbody thead th {
  padding: 10px;
}
.songs-container .playlist-table tbody .img-wrap {
  position: relative;
  width: 40px;
  height: 40px;
  overflow: hidden;
  margin: -5px 0px -5px 0px;
  border-radius: 50%;
}
.songs-container .playlist-table tbody .img-wrap img {
  width: 100%;
}
.songs-container .playlist-table tbody tr:nth-child(2n+1){
  background-color: #eef;
}
.songs-container .playlist-table tbody tr {
  cursor: pointer;
  transition: ease-in-out .2s;
}
.songs-container .playlist-table tbody tr:hover {
  background-color: rgba(0,0,0,.1);
  transform: translateX(20px);
  box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
}
.songs-container .playlist-table tbody tr:hover td:nth-child(7) .p-icon::before {
  display: block;
}
.songs-container .playlist-table tbody td {
  border: none;
}
.songs-container .playlist-table tbody td:nth-child(1) {
  width: 60px;
  text-align: center;
}
.songs-container .playlist-table tbody td:nth-child(2) {
  width: 80px;
}
.songs-container .playlist-table tbody td:nth-child(3) {
  width: 250px;
}
.songs-container .playlist-table tbody td:nth-child(4) {
  width: 100px;
}
.songs-container .playlist-table tbody td:nth-child(5) {
  width: 200px;
}
.songs-container .playlist-table tbody td:nth-child(6) {
  width: 100px;
}
.songs-container .playlist-table tbody td:nth-child(7) {
  width: 50px;
}
.songs-container .playlist-table tbody td:nth-child(7) .p-icon::before {
  display: none;
  border-radius: 50%;
  font-size: 25px;
  
}

</style>
