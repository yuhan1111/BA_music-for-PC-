<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="playlist.coverImgUrl" alt />
      </div>
      <div class="info-wrap">
        <div class="info-title">
          <span class="t-title">{{ playlist.name }}</span>
        </div>
        <div class="author-wrap">
          <img :src="playlist.creator.avatarUrl" />
          <div class="name">{{ playlist.creator.nickname }}</div>
          <div class="time">{{ playlist.createTime }} 创建</div>
          <div class="subscribers el-icon-headset">
            <ul>
              <li v-for="(item,index) in subscribers" :key="index">
                <img :src="item.avatarUrl" width="40px" alt />
              </li>
            </ul>
          </div>
          <div class="play-wrap">
            <span class="count-played">{{ playlist.playCount }}次播放</span>
            <span class="share">{{playlist.shareCount}}次分享</span>
          </div>
        </div>

        <div class="tag-wrap" v-if="playlist.tags.length != 0">
          <div class="title">标签：</div>
          <ul>
            <li v-for="(item,index) in playlist.tags" :key="index">{{item}}</li>
          </ul>
        </div>
        <div class="description-wrap" v-if="playlist.description != null">
          <div class="title">简介：</div>
          <p>{{ playlist.description }}</p>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div class="buttom-wrap">
      <el-tabs v-model="activeName">
        <!-- 歌单列表 -->
        <el-tab-pane label="歌单列表" name="first">
          <div class="el-table">
            <thead>
              <th></th>
              <th></th>
              <th>精选歌单</th>
              <th>歌手</th>
              <th>上传时间</th>
              <th>点击播放</th>
            </thead>
            <tbody>
              <tr class="el-table__row" v-for="(item, index) in tracklist" :key="index">
                <td class="num">{{index+1}}</td>
                <td class="img-wrap">
                  <img :src="item.al.picUrl" alt />
                </td>
                <td class="name">
                  <div class="main-name">{{item.name}}</div>
                  <div class="sub-name">{{item.al.name}}</div>
                </td>
                <td class="author">{{item.ar[0].name}}</td>
                <td class="createTime">{{item.publishTime}}</td>
                <td
                  class="c-play"
                  @click="playMusic(item.id,item.name,item.ar[0].name,item.al.picUrl)"
                >
                  <div class="el-icon-video-play"></div>
                </td>
              </tr>
            </tbody>
          </div>
        </el-tab-pane>
        <!-- 评论列表 -->
        <el-tab-pane label="评论" name="second">
          <!-- 热门评论 -->
          <div class="comment-wrap">
            <!-- 标题 -->
            <p class="title">
              热门评论
              <span>({{hotCommentscount}}条)</span>
            </p>
            <ul class="comments-wrap">
              <li class="item" v-for="(item,index) in hotComments" :key="index">
                <!-- 用户头像 -->
                <div class="content-wrap">
                  <div class="icon-wrap">
                    <img :src="item.user.avatarUrl" />
                  </div>
                  <!-- 评论 -->
                  <div class="info-wrap">
                    <div class="name">{{item.user.nickname}}</div>
                    <div class="comment">{{item.content}}</div>
                  </div>
                </div>
                <!-- 回复 （注意:回复不一定有）-->
                <div class="reply-wrap" v-if="item.beReplied.length!=0">
                  <div class="huifu">回复:</div>
                  <div class="r-name">{{item.beReplied[0].user.nickname}}</div>
                  <div class="r-comment">{{item.beReplied[0].content}}</div>
                </div>
                <!-- 评论创建时间 -->
                <div class="date">{{item.time}}</div>
              </li>
            </ul>
          </div>
          <!-- 最新评论 -->
          <div class="comment-wrap">
            <p class="title">
              最新评论
              <span>({{total}}条)</span>
            </p>
            <ul class="comments-wrap">
              <li class="item" v-for="(item,index) in comments" :key="index">
                <div class="content-wrap">
                  <div class="icon-wrap">
                    <img :src="item.user.avatarUrl" />
                  </div>
                  <div class="info-wrap">
                    <div class="name">{{item.user.nickname}}</div>
                    <div class="comment">{{item.content}}</div>
                  </div>
                </div>
                <div class="reply-wrap" v-if="item.beReplied.length!=0">
                  <div class="huifu">回复:</div>
                  <div class="r-name">{{item.beReplied[0].user.nickname}}</div>
                  <div class="r-comment">{{item.beReplied[0].content}}</div>
                </div>
                <div class="date">{{item.time}}</div>
              </li>
            </ul>
          </div>
          <el-pagination
            @current-change="handleCurrentChange"
            background
            layout="prev, pager, next"
            :total="total"
            :current-page="page"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "playlist",
  data() {
    return {
      playlist: {},
      tracklist: [],
      subscribers: [],
      comments: [],
      hotComments: [],
      hotCommentscount: 0,
      activeName: "first",
      total: 0,
      page: 1
    };
  },
  created() {
    //获取歌单详情
    axios({
      url: "https://autumnfish.cn/playlist/detail",
      method: "get",
      params: {
        id: this.$route.query.q
      }
    }).then(res => {
      // console.log(res);
      // console.log(this.tracklist);
      this.playlist = res.data.playlist;
      let pTime = this.playlist.createTime;
      let dates = new Date(pTime);
      let py = dates.getFullYear();
      let pm = dates.getMonth() + 1;
      pm = pm < 10 ? "0" + pm : pm;
      let pd = dates.getDate();
      pd = pd < 10 ? "0" + pd : pd;
      let ph = dates.getHours();
      ph = ph < 10 ? "0" + ph : ph;
      let pmi = dates.getMinutes();
      pmi = pmi < 10 ? "0" + pmi : pmi;
      let ps = dates.getSeconds();
      ps = ps < 10 ? "0" + ps : ps;
      this.playlist.createTime = `${py}-${pm}-${pd} ${ph}:${pmi}:${ps}`;
      this.subscribers = res.data.playlist.subscribers;
      this.tracklist = res.data.playlist.tracks;
      for (let i = 0; i < this.tracklist.length; i++) {
        let pTime = this.tracklist[i].publishTime;
        let dates = new Date(pTime);
        let PD = dates.getDay();
        this.tracklist[i].publishTime = `${PD}天前`;
      }
    });
    //获取热门评论
    axios({
      url: "https://autumnfish.cn/comment/hot",
      method: "get",
      params: {
        id: this.$route.query.q,
        type: 2
      }
    }).then(res => {
      // console.log(res);
      this.hotComments = res.data.hotComments;
      this.hotCommentscount = res.data.total;
      for (let i = 0; i < this.hotComments.length; i++) {
        let pTime = this.hotComments[i].time;
        let dates = new Date(pTime);
        let py = dates.getFullYear();
        let pm = dates.getMonth() + 1;
        pm = pm < 10 ? "0" + pm : pm;
        let pd = dates.getDate();
        pd = pd < 10 ? "0" + pd : pd;
        let ph = dates.getHours();
        ph = ph < 10 ? "0" + ph : ph;
        let pmi = dates.getMinutes();
        pmi = pmi < 10 ? "0" + pmi : pmi;
        let ps = dates.getSeconds();
        ps = ps < 10 ? "0" + ps : ps;
        // console.log(PD);
        this.hotComments[i].time = `${py}-${pm}-${pd} ${ph}:${pmi}:${ps}`;
      }
    });
    //获取最新评论
    axios({
      url: "https://autumnfish.cn/comment/playlist",
      method: "get",
      params: {
        id: this.$route.query.q,
        limit: 10,
        offset: (this.page - 1) * 10
      }
    }).then(res => {
      this.total = res.data.total;
      this.comments = res.data.comments;
      // console.log(res);
      for (let i = 0; i < this.comments.length; i++) {
        let pTime = this.comments[i].time;
        let dates = new Date(pTime);
        let py = dates.getFullYear();
        let pm = dates.getMonth() + 1;
        pm = pm < 10 ? "0" + pm : pm;
        let pd = dates.getDate();
        pd = pd < 10 ? "0" + pd : pd;
        let ph = dates.getHours();
        ph = ph < 10 ? "0" + ph : ph;
        let pmi = dates.getMinutes();
        pmi = pmi < 10 ? "0" + pmi : pmi;
        let ps = dates.getSeconds();
        ps = ps < 10 ? "0" + ps : ps;
        // console.log(PD);
        this.comments[i].time = `${py}-${pm}-${pd} ${ph}:${pmi}:${ps}`;
      }
    });
  },
  methods: {
    playMusic(id, name, rname, purl) {
      this.$parent.musicName = name;
      this.$parent.rName = rname;
      this.$parent.picUrl = purl;
      axios({
        url: "https://autumnfish.cn/song/url",
        method: "get",
        params: {
          id: id
        }
      }).then(res => {
        // console.log(res);
        let url = res.data.data[0].url;
        this.$parent.musicUrl = url;
      });
    },
    handleCurrentChange(val) {
      this.page = val;
      axios({
        url: "https://autumnfish.cn/comment/playlist",
        method: "get",
        params: {
          id: this.$route.query.q,
          limit: 10,
          offset: (this.page - 1) * 10
        }
      }).then(res => {
        // this.total = res.data.total;
        this.comments = res.data.comments;
        // console.log(res);
        for (let i = 0; i < this.comments.length; i++) {
          let pTime = this.comments[i].time;
          let dates = new Date(pTime);
          let py = dates.getFullYear();
          let pm = dates.getMonth() + 1;
          pm = pm < 10 ? "0" + pm : pm;
          let pd = dates.getDate();
          pd = pd < 10 ? "0" + pd : pd;
          let ph = dates.getHours();
          ph = ph < 10 ? "0" + ph : ph;
          let pmi = dates.getMinutes();
          pmi = pmi < 10 ? "0" + pmi : pmi;
          let ps = dates.getSeconds();
          ps = ps < 10 ? "0" + ps : ps;
          // console.log(PD);
          this.comments[i].time = `${py}-${pm}-${pd} ${ph}:${pmi}:${ps}`;
        }
      });
    }
  }
};
</script>

<style>
.playlist-container {
  width: 950px;
}
.playlist-container .top-wrap {
  box-sizing: border-box;
  display: flex;
  padding: 10px;
  width: 100%;
  background-color: #eaeaef;
  border-radius: 10px;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
}
.playlist-container .top-wrap .img-wrap {
  width: 150px;
  height: 150px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.5);
  margin-right: 10px;
}
.playlist-container .top-wrap .img-wrap img {
  width: 100%;
}
.playlist-container .top-wrap .info-wrap {
  flex: 1;
}
.playlist-container .top-wrap .info-wrap .info-title {
  margin-bottom: 5px;
  height: 20px;
}
.playlist-container .top-wrap .info-wrap .t-title {
  font-size: 12px;
  padding: 0px 10px 0px 10px;
  border-radius: 10px;
  color: white;
  font-weight: 700;
  background-color: black;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.3);
}
.playlist-container .top-wrap .info-wrap .author-wrap {
  box-sizing: border-box;
  height: 20px;
  line-height: 20px;
  margin-bottom: 5px;
  width: 100%;
  overflow: hidden;
  background-color: #acf;
  border-radius: 10px;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.3);
  padding-left: 10px;
}
.playlist-container .top-wrap .info-wrap .author-wrap .name {
  float: left;
  font-size: 12px;
  margin-right: 10px;
  font-weight: 700;
}
.playlist-container .top-wrap .info-wrap .author-wrap img {
  display: block;
  margin-right: 10px;
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.playlist-container .top-wrap .info-wrap .author-wrap .time {
  float: left;
  font-size: 12px;
  margin-right: 20px;
}
.playlist-container .top-wrap .info-wrap .author-wrap .subscribers {
  display: flex;
  float: left;
  padding-left: 10px;
  width: 250px;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
  color: #33f;
  overflow: hidden;
}
.playlist-container .top-wrap .info-wrap .author-wrap .subscribers ul {
  flex: 1;
  margin-left: 10px;
}
.playlist-container .top-wrap .info-wrap .author-wrap .subscribers ul li {
  float: left;
  margin-right: 5px;
  width: 20px;
  height: 20px;
  overflow: hidden;
}
.playlist-container .top-wrap .info-wrap .author-wrap .subscribers ul li img {
  display: block;
  width: 100%;
  border-radius: 50%;
}
.playlist-container .top-wrap .info-wrap .author-wrap .play-wrap {
  float: left;
  height: 100%;
  font-size: 12px;
}
.playlist-container .top-wrap .info-wrap .author-wrap .play-wrap .count-played {
  margin-right: 20px;
}
.playlist-container .top-wrap .info-wrap .tag-wrap {
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  height: 20px;
  width: 200px;
  line-height: 20px;
  overflow: hidden;
  background-color: #acf;
  border-radius: 10px;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.3);
  margin-bottom: 5px;
}
.playlist-container .top-wrap .info-wrap .tag-wrap .title {
  font-size: 12px;
  color: #33f;
  font-weight: 600;
}
.playlist-container .top-wrap .info-wrap .tag-wrap ul {
  flex: 1;
  height: 100%;
  font-size: 12px;
}
.playlist-container .top-wrap .info-wrap .tag-wrap li {
  float: left;
  margin-right: 5px;
}
.playlist-container .top-wrap .info-wrap .description-wrap {
  padding: 5px 10px 5px 10px;
  display: flex;
  font-size: 12px;
  background-color: #acf;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
.playlist-container .top-wrap .info-wrap .description-wrap .title {
  font-size: 12px;
  color: #33f;
  font-weight: 600;
}
.playlist-container .top-wrap .info-wrap .description-wrap p {
  flex: 1;
  /* height: 58px; */
  overflow: auto;
}
/* 歌单列表和评论列表start */
.playlist-container .buttom-wrap .el-table tbody tr:nth-child(2n + 1) {
  background-color: #eef;
}
.playlist-container .buttom-wrap .el-table th {
  padding: 10px 20px 10px 20px;
}
.playlist-container .buttom-wrap tr {
  cursor: pointer;
  transition: ease-in-out 0.2s;
}
.playlist-container .buttom-wrap tr:hover {
  background-color: rgba(0, 0, 0, 0.1);
  transform: translateX(20px);
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.5);
}
.playlist-container .buttom-wrap td {
  padding: 0px 20px 0px 20px;
}
.playlist-container .buttom-wrap .num {
  width: 10px;
}
.playlist-container .buttom-wrap .img-wrap {
  width: 40px;
}
.playlist-container .buttom-wrap .img-wrap img {
  vertical-align: middle;
  height: 40px;
  width: 40px;
  border-radius: 50%;
}
.playlist-container .buttom-wrap .name {
  width: 300px;
}
.playlist-container .buttom-wrap .sub-name {
  color: #acf;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.playlist-container .buttom-wrap .author {
  width: 200px;
}
.playlist-container .buttom-wrap .createTime {
  width: 200px;
}
.playlist-container .buttom-wrap .c-play {
  width: 100px;
}
.playlist-container .buttom-wrap .c-play .el-icon-video-play {
  width: 100px;
  height: 50px;
  line-height: 50px;
  font-size: 30px;
  color: #acf;
}
/* 歌单列表和评论列表end */
/* comment start */
.playlist-container .comment-wrap .title {
  width: 120px;
  color: white;
  font-weight: 600;
  padding-left: 10px;
  border-radius: 10px;
  height: 20px;
  font-size: 14px;
  margin-top: 10px;
  background-color: black;
}
.playlist-container .comment-wrap .comments-wrap {
  width: 100%;
  box-sizing: border-box;
  background-color: #f8f8ff;
  border-radius: 20px;
  padding: 10px;
}
.playlist-container .comments-wrap .item {
  width: 100%;
  font-size: 14px;
  vertical-align: middle;
  /* background-color: #acf; */
  margin-bottom: 5px;
}
.playlist-container .comments-wrap .item .date {
  width: 100%;
  text-align: right;
  height: 20px;
}
.playlist-container .comments-wrap .item .content-wrap {
  width: 100%;
}
.playlist-container .comments-wrap .item .icon-wrap {
  float: left;
  width: 20px;
  height: 20px;
  overflow: hidden;
  background-color: #bbffff;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.playlist-container .comments-wrap .item .icon-wrap img {
  width: 100%;
  border-radius: 50%;
  vertical-align: middle;
}
.playlist-container .comments-wrap .item .content-wrap .info-wrap {
  font-size: 14px;
}
.playlist-container .comments-wrap .item .content-wrap .info-wrap .name {
  float: left;
  padding: 0 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgb(70, 8, 8);
  background-color: #bbffff;
  width: 100px;
  height: 20px;
  font-weight: 600;
}
.playlist-container .comments-wrap .item .content-wrap .info-wrap .comment {
  overflow: hidden;
  padding: 0px 10px;
  font-size: 14px;
}
.playlist-container .comments-wrap .item .reply-wrap {
  margin-top: 5px;
  padding: 10px;
  box-sizing: border-box;
  background-color: #dff;
  border-radius: 20px;
  font-size: 14px;
}
.playlist-container .comments-wrap .item .reply-wrap .huifu {
  float: left;
}
.playlist-container .comments-wrap .item .reply-wrap .r-name {
  float: left;
  padding: 0 10px;
  color: rgb(70, 8, 8);
  height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  width: 100px;
  border-radius: 10px;
  background-color: turquoise;
}
.playlist-container .comments-wrap .item .reply-wrap .r-comment {
  padding: 0 10px;
}

/* comment end */
</style>
