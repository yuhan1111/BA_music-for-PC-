<template>
  <div class="index">
    <!-- 左侧导航 -->
    <div class="nav">
      <ul>
        <li class="el-icon-search">
          <router-link to="/discovery">发现音乐</router-link>
        </li>
        <li class="el-icon-document">
          <router-link to="/playlists">推荐歌单</router-link>
        </li>
        <li class="el-icon-headset">
          <router-link to="/songs">最新音乐</router-link>
        </li>
        <li class="el-icon-video-play">
          <router-link to="/mvs">最新MV</router-link>
        </li>
      </ul>
    </div>
    <!-- 右侧容器 -->
    <div class="main">
      <!-- <discovery></discovery>不使用路由时直接显示状态 -->
      <!-- 路由的出口 -->
      <router-view></router-view>
    </div>
    <div class="mp3player">
      <!-- 音频标签 -->

      <div class="music-info">
        <div class="pic">
          <img :src="picUrl" alt width="60px" />
        </div>

        <div class="song">
          <div class="mname">{{musicName}}</div>
          <div class="rname">{{rName}}</div>
        </div>
        <div class="left-controls el-icon-d-arrow-left"></div>
        <audio :src="musicUrl" controls autoplay @ended="nextSong"></audio>
        <div class="right-controls el-icon-d-arrow-right"></div>
      </div>

      <ul class="icon-wrapper">
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  </div>
</template>

<script>
import discovery from "../views/01.discovery"; //默认状态下引入01.discovery组件
import axios from "axios";
export default {
  name: "index",
  data() {
    return {
      musicUrl: "",
      musicName: "",
      rName: "",
      picUrl: "",
      songs: [],
      ids: [],
      musicNames: [],
      rNames: [],
      picUrls: [],
      currentIndex: 0
    };
  },
  components: {
    discovery
  },
  methods: {
    nextSong() {
      if (this.currentIndex < 100) {
        this.currentIndex++;
      }
      this.musicName = this.musicNames[this.currentIndex];
      this.rName = this.rNames[this.currentIndex];
      this.picUrl = this.picUrls[this.currentIndex];
      axios({
        url: "https://autumnfish.cn/song/url",
        method: "get",
        params: {
          id: this.ids[this.currentIndex]
        }
      }).then(res => {
        console.log(res);
        this.musicUrl = res.data.data[0].url;
      });
    }
  },
  created() {

    setInterval(() => {
      var start = this.musicName.substring(0, 1);
      var end = this.musicName.substring(1);
      this.musicName = end + start;
    }, 500);
  },
  watch: {
    songs() {
      //   console.log(this.songs);
      for (let i = 0; i < this.songs.length; i++) {
        this.ids[i] = this.songs[i].id;
        this.musicNames[i] = this.songs[i].name;
        this.rNames[i] = this.songs[i].artists[0].name;
        this.picUrls[i] = this.songs[i].album.picUrl;
      }
      this.musicName = this.musicNames[currentIndex];
      this.rName = this.rNames[currentIndex];
      this.picUrl = this.picUrls[currentIndex];
      //   console.log(this.ids);
      axios({
        url: "https://autumnfish.cn/song/url",
        method: "get",
        params: {
          id: this.ids[this.currentIndex]
        }
      }).then(res => {
        // console.log(res);
        
        this.musicUrl = res.data.data[0].url;
      });
    }
  }
};
</script>

<style>
a {
  text-decoration: none;
}
.index {
  position: relative;
  display: flex;
  padding-bottom: 80px;
}
.index .nav {
  width: 190px;
  margin-right: 10px;
  background: #fff2e2;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.5);
  padding-bottom: 20px;
}
.index .main {
  flex: 1;
  background-color: #fff;
  padding: 30px 25px 0 25px;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.5);
  padding-bottom: 20px;
}
.nav ul {
  /* overflow: hidden; */
  width: 190px;
  margin-top: 20px;
  height: 600px;
}
.nav li {
  box-sizing: border-box;
  padding-left: 40px;
  text-align: left;
  width: 100%;
  height: 80px;
  line-height: 80px;
  border-radius: 10px;
  font-size: 20px;
}
.nav li::before {
  font-weight: 700;
  margin-right: 10px;
  font-size: 22px;
}
.nav li:hover {
  transform: translateX(10px);
  width: 190px;
  transition: ease-in-out 0.3s;
  background: #e3edcd;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.5);
}
.router-link-active {
  color: red;
}

/* player start */

.index .mp3player {
  padding: 0px 0px 0px 20px;
  box-sizing: border-box;
  position: absolute;
  bottom: 10px;
  height: 60px;
  width: 1200px;
  background-color: #aff;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.5);
  border-bottom-right-radius: 30px;
}
.index .mp3player .music-info {
  margin-left: 250px;
  width: 700px;
  float: left;
  background-color: #e3edcd;
  height: 40px;
  margin-top: 10px;
  font-size: 14px;
  border-radius: 20px;
}
.index .mp3player .music-info .left-controls {
  float: left;
  height: 100%;
  width: 90px;
  margin-right: -20px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  background-color:  #DCE2F1;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.5);
  text-align: center;
  font-size: 25px;
  line-height: 40px;
}
.index .mp3player .music-info .right-controls {
  float: left;
  height: 100%;
  width: 90px;
  margin-left: -20px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: #DCE2F1;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.5);
  text-align: center;
  font-size: 25px;
  line-height: 40px;
}

.index .mp3player .music-info .pic {
  float: left;
  height: 40px;
  width: 40px;
  background: url(../assets/music-ico.jpg) no-repeat center center;
  background-size: contain;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.3);
}
.index .mp3player .music-info .pic img {
  width: 100%;
}
.index .mp3player .music-info .song {
  float: left;
  width: 100px;
  padding: 0px 10px 0px 10px;
  box-sizing: border-box;
}
.index .mp3player .music-info .song .mname {
  width: 100%;
  line-height: 25px;
  height: 25px;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.index .mp3player .music-info .song .rname {
  width: 100%;
  line-height: 15px;
  height: 15px;
  font-size: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: skyblue;
}
.index .mp3player .music-info audio {
  float: left;
  outline: none;
  width: 300px;
  height: 40px;
  background-color: #e3edcd;
  border-radius: 20px;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.3);
}
.index .mp3player .icon-wrapper {
  float: right;
  height: 30px;
  margin-top: 15px;
}
.index .mp3player .icon-wrapper li {
  float: right;
  width: 30px;
  height: 30px;
  margin-right: 30px;
  border-radius: 50%;
  line-height: 60px;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.5);
}
.index .mp3player .icon-wrapper li:nth-child(1) {
  background-color: #dce2f1;
}
.index .mp3player .icon-wrapper li:nth-child(2) {
  background-color: rgb(238, 238, 136);
}
.index .mp3player .icon-wrapper li:nth-child(3) {
  background-color: rgb(103, 250, 103);
}

/* player end */
</style>