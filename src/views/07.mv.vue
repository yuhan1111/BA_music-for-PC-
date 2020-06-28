<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <div class="left-wrap">
        <!-- mv-player -->
        <div class="player-wrap">
          <h4 class="title">{{ mvDetail.artistName }}：{{ mvDetail.name }}</h4>
          <div class="mvplayer">
            <video :src="mvUrl" controls :poster="mvDetail.cover"></video>
          </div>
          <div class="mv-info">
            <span class="date">{{ mvDetail.publishTime }} 发布</span>
            <span class="playCounts">{{ mvDetail.playCount }} 次播放</span>
            <span class="shareCounts">{{ mvDetail.shareCount }} 次分享</span>
          </div>
          <div class="mv-desc" v-if="mvDetail.desc.length != 0">
            <span>MV简介：</span>
            {{ mvDetail.desc }}
          </div>
        </div>
        <!-- singer-资料 -->
        <div class="singerInfo-wrap">
          <div class="singer-pref">
            <div class="avatar-wrap">
              <img :src="artistInfo.picUrl" alt />
            </div>
            <div class="name">{{ artistInfo.name }}</div>
            <div class="nickName">{{ artistInfo.alias[0] }}</div>
          </div>
          <div class="singer-desc" v-if="artistInfo.briefDesc.length != 0">
            <span>歌手简介：</span>
            {{ artistInfo.briefDesc }}
          </div>
          <div class="rep-songs">
            <span class="title">代表歌曲：</span>
            <span>{{ hotSongs[0].name }}</span
            >\ <span>{{ hotSongs[1].name }}</span
            >\ <span>{{ hotSongs[2].name }}</span
            >\ <span>{{ hotSongs[3].name }}</span
            >\ <span>{{ hotSongs[4].name }}</span
            >\
            <span>{{ hotSongs[5].name }}</span>
          </div>
        </div>
      </div>
      <!-- mv-相关 -->
      <div class="relation-wrap">
        <h4 class="title">相关MV</h4>
        <div class="mvs">
          <ul class="items">
            <li class="item" v-for="(item, index) in relationList" :key="index">
              <div class="img-wrap">
                <div
                  class="el-icon-video-play play-icon"
                  @click="playMV(item.id)"
                ></div>
                <div class="el-icon-view num-wrap">{{ item.playCount }}</div>
                <div class="duration">{{ item.duration }}</div>
                <img :src="item.cover" width="230px" />
              </div>
              <div class="name-wrap">
                {{ item.artists[0].name }}：{{ item.name }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="comment-box">
      <!-- 热门评论 -->
      <div class="comment-wrap">
        <p class="title">
          热门评论
          <span>({{ hotCommentsCount }}条)</span>
        </p>
        <ul class="comments-wrap">
          <li class="item" v-for="(item, index) in hotComments" :key="index">
            <div class="content-wrap">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" />
              </div>
              <div class="info-wrap">
                <div class="name">{{ item.user.nickname }}</div>
                <div class="comment">{{ item.content }}</div>
              </div>
            </div>
            <div class="reply-wrap" v-if="item.beReplied.length != 0">
              <div class="name">
                <span>回复:</span>
                {{ item.beReplied[0].user.nickname }}
              </div>
              <div class="comment">{{ item.beReplied[0].content }}</div>
            </div>
            <div class="date">{{ item.time }}</div>
          </li>
        </ul>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">
          最新评论
          <span>({{ total }}条)</span>
        </p>
        <ul class="comments-wrap">
          <li class="item" v-for="(item, index) in comments" :key="index">
            <div class="content-wrap">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" />
              </div>
              <div class="info-wrap">
                <div class="name">{{ item.user.nickname }}</div>
                <div class="comment">{{ item.content }}</div>
              </div>
            </div>
            <div class="reply-wrap" v-if="item.beReplied.length!=0">
                <div class="huifu">回复:</div>
                <div class="r-name">{{item.beReplied[0].user.nickname}}</div>
                <div class="r-comment">{{item.beReplied[0].content}}</div>
            </div>
            <div class="date">{{ item.time }}</div>
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "mv",
  data() {
    return {
      mvUrl: "",
      relationList: [],
      mvName: "",
      artistName: "",
      artistInfo: {},
      mvDetail: {},
      hotSongs: [],
      commentsCount: 0,
      comments: [],
      hotCommentsCount: 0,
      hotComments: [],
      total: 0,
      page: 1,
    };
  },
  methods: {
    playMV(id) {
      // console.log(id);
      // 更新mv地址
      axios({
        url: "https://autumnfish.cn/mv/url",
        method: "get",
        params: {
          id: id,
        },
      }).then((res) => {
        // console.log(res);
        this.mvUrl = res.data.data.url;
      });
      // 更新mvdetail
      axios({
        url: "https://autumnfish.cn/mv/detail",
        method: "get",
        params: {
          mvid: id,
        },
      }).then((res) => {
        // console.log(res);
        this.mvDetail = res.data.data;
      });
      axios({
        url: "https://autumnfish.cn/comment/mv",
        method: "get",
        params: {
          id: id,
          limit: 10,
          offset: (this.page - 1) * 10,
        },
      }).then((res) => {
        // console.log(res);
        this.total = res.data.total;

        this.comments = res.data.comments;
        this.hotComments = res.data.hotComments;

        // this.commentsCount = res.data.comments.length;
        this.hotCommentsCount = res.data.hotComments.length;
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
    handleCurrentChange(val) {
      // console.log(`当前页${val}`);
      this.page = val;
      axios({
        url: "https://autumnfish.cn/comment/mv",
        method: "get",
        params: {
          id: this.$route.query.q,
          limit: 10,
          offset: (this.page - 1) * 10,
        },
      }).then((res) => {
        // console.log(res);

        this.comments = res.data.comments;
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
  },
  created() {
    //获取mvurl
    axios({
      url: "https://autumnfish.cn/mv/url",
      method: "get",
      params: {
        //获取url中的id
        id: this.$route.query.q,
        mvname: this.$route.query.n,
        artistname: this.$route.query.r,
      },
    }).then((res) => {
      // console.log(res);
      this.mvUrl = res.data.data.url;
      this.mvName = res.config.params.mvname;
      this.artistName = res.config.params.artistname;
    });
    //获取相关mvurl
    axios({
      url: "https://autumnfish.cn/simi/mv",
      method: "get",
      params: {
        //获取url中的id
        mvid: this.$route.query.q,
      },
    }).then((res) => {
      // console.log(res);
      this.relationList = res.data.mvs;
      for (let i = 0; i < this.relationList.length; i++) {
        this.relationList[i].playCount =
          this.relationList[i].playCount > 10000
            ? parseInt(this.relationList[i].playCount / 10000) + "万"
            : this.relationList[i].playCount;
      }
      for (let i = 0; i < this.relationList.length; i++) {
        let duration = this.relationList[i].duration;
        let min = parseInt(duration / 1000 / 60);
        min = min < 10 ? "0" + min : min;
        let sec = parseInt((duration / 1000) % 60);
        sec = sec < 10 ? "0" + sec : sec;
        // console.log(min +':'+ sec);
        let durations = min + ":" + sec;
        this.relationList[i].duration = `${min}:${sec}`;
      }
    });

    //获取MV信息
    axios({
      url: "https://autumnfish.cn/mv/detail",
      method: "get",
      params: {
        //获取url中的id
        mvid: this.$route.query.q,
      },
    }).then((res) => {
      // console.log(res);
      this.mvDetail = res.data.data;
      //依据歌曲id来获取对应的歌手id 再来获取歌手信息  !!!!!!! axios的嵌套使用
      // 获取歌手信息
      axios({
        url: "https://autumnfish.cn/artists",
        method: "get",
        params: {
          //获取url中的id
          id: this.mvDetail.artists[0].id,
        },
      }).then((res) => {
        // console.log(res);
        this.artistInfo = res.data.artist;
        this.hotSongs = res.data.hotSongs;
      });
    });
    //获取评论信息
    axios({
      url: "https://autumnfish.cn/comment/mv",
      method: "get",
      params: {
        id: this.$route.query.q,
        limit: 10,
        offset: (this.page - 1) * 10,
      },
    }).then((res) => {
      // console.log(res);
      this.total = res.data.total;

      this.comments = res.data.comments;
      this.hotComments = res.data.hotComments;

      // this.commentsCount = res.data.comments.length;
      this.hotCommentsCount = res.data.hotComments.length;
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
};
</script>

<style>
.mv-container {
  width: 950px;
}
.mv-container .mv-wrap {
  display: flex;
  width: 100%;
  overflow: hidden;
}
/* left-wrap start */
.mv-container .mv-wrap .left-wrap {
  width: 700px;
}
.mv-container .mv-wrap .left-wrap .player-wrap .title {
  width: 100%;
  height: 40px;
  font-size: 20px;
  white-space: nowrap;
  line-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 10px;
}
.mv-container .mv-wrap .left-wrap .player-wrap .mvplayer {
  position: relative;
  width: 100%;
  height: 394px;
  margin-bottom: 10px;
  padding: 0;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.5);
}
.mv-container .mv-wrap .left-wrap .mvplayer video {
  width: 700px;
  height: 394px;
}
.mv-container .mv-wrap .left-wrap .mvplayer-wrap .mv-info {
  height: 20px;
  margin-bottom: 10px;
}
.mv-container .mv-wrap .left-wrap .mvplayer-wrap .mv-info span {
  margin: 0px 20px 20px 10px;
  color: #aaf;
}
.mv-container .mv-wrap .left-wrap .mvplayer-wrap .mv-desc {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 20px;
  cursor: pointer;
}
.mv-container .mv-wrap .left-wrap .mvplayer .mv-desc span {
  color: yellowgreen;
  font-weight: 600;
}
.mv-container .mv-wrap .left-wrap .mvplayer .mv-desc:hover {
  white-space: normal;
}
.mv-container .mv-wrap .left-wrap .singerInfo-wrap {
  width: 100%;
}
.mv-container .mv-wrap .left-wrap .singerInfo-wrap .singer-pref {
  width: 100%;
  height: 60px;
  vertical-align: middle;
  margin-bottom: 20px;
}
.mv-container .mv-wrap .left-wrap .singerInfo-wrap .singer-pref .avatar-wrap {
  float: left;
  width: 60px;
  height: 60px;
  border-radius: 60px;
  overflow: hidden;
  margin-right: 20px;
  background-color: #acf;
}
.mv-container .mv-wrap .left-wrap .singerInfo-wrap .singer-pref .avatar-wrap img {
  height: 100%;
  margin-left: -5px;
}
.mv-container .mv-wrap .left-wrap .singerInfo-wrap .singer-pref .name {
  float: left;
  line-height: 60px;
  font-size: 20px;
  font-weight: 700;
  margin-right: 20px;
}
.mv-container .mv-wrap .left-wrap .singerInfo-wrap .singer-pref .nickName {
  float: left;
  line-height: 60px;
  margin-right: 20px;
}
.mv-container .mv-wrap .left-wrap .singerInfo-wrap .singer-pref .publishTime {
  float: left;
  line-height: 60px;
}
.mv-container .mv-wrap .left-wrap .singerInfo-wrap .singer-desc {
  width: 100%;
  margin-bottom: 20px;
  cursor: pointer;
}
.mv-container .mv-wrap .left-wrap .singerInfo-wrap .singer-desc span {
  color: yellowgreen;
  font-weight: 600;
}
.mv-container .mv-wrap .left-wrap .singerInfo-wrap .rep-songs {
  margin-bottom: 20px;
}
.mv-container .mv-wrap .left-wrap .singerInfo-wrap .rep-songs .title {
  color: yellowgreen;
  font-weight: 600;
}
/* left-wrap end */
/* relation-wrap start */
.mv-container .mv-wrap .relation-wrap {
  flex: 1;
  margin-left: 20px;
}
.mv-container .mv-wrap .relation-wrap .title {
  height: 40px;
  line-height: 40px;
  font-size: 20px;
}
.mv-container .mv-wrap .relation-wrap .item {
  width: 230px;
}
.mv-container .mv-wrap .relation-wrap .item .name-wrap {
  padding: 0px 5px 0px 5px;
  font-size: 14px;
  margin-bottom: 10px;
}
.mv-container .mv-wrap .relation-wrap .item .img-wrap {
  position: relative;
  width: 100%;
  height: 129px;
  box-shadow: 0 10px 15px -5px rgba(0, 0, 0, 0.5);
}
.mv-container .mv-wrap .relation-wrap .item .img-wrap .num-wrap {
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 14px;
  color: wheat;
}
.mv-container .mv-wrap .relation-wrap .item .img-wrap .duration {
  position: absolute;
  right: 5px;
  bottom: 5px;
  font-size: 14px;
  color: wheat;
}
.mv-container .mv-wrap .relation-wrap .item .img-wrap .play-icon {
  position: absolute;
  display: none;
  width: 100%;
  height: 100%;
  font-size: 50px;
  text-align: center;
  line-height: 130px;
  color: #aaf;
  background-color: rgba(0, 0, 0, 0.5);
}
.mv-container .mv-wrap .relation-wrap .item .img-wrap:hover .play-icon {
  display: block;
}
/* relation-wrap end */

/* comment start */
.mv-container .comment-wrap .title {
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
.mv-container .comment-wrap .comments-wrap {
  width: 100%;
  box-sizing: border-box;
  background-color: #f8f8ff;
  border-radius: 20px;
  padding: 10px;
}
.mv-container .comments-wrap .item {
  width: 100%;
  font-size: 14px;
  vertical-align: middle;
  /* background-color: #acf; */
  margin-bottom: 5px;
}
.mv-container .comments-wrap .item .date {
  width: 100%;
  text-align: right;
  height: 20px;
}
.mv-container .comments-wrap .item .content-wrap {
  width: 100%;
}
.mv-container .comments-wrap .item .icon-wrap {
  float: left;
  width: 20px;
  height: 20px;
  overflow: hidden;
  background-color: #bbffff;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.mv-container .comments-wrap .item .icon-wrap img {
  width: 100%;
  border-radius: 50%;
  vertical-align: middle;
}
.mv-container .comments-wrap .item .content-wrap .info-wrap {
  font-size: 14px;
}
.mv-container .comments-wrap .item .content-wrap .info-wrap .name {
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
.mv-container .comments-wrap .item .content-wrap .info-wrap .comment {
  overflow: hidden;
  padding: 0px 10px;
  font-size: 14px;
}
.mv-container .comments-wrap .item .reply-wrap {
  margin-top: 5px;
  padding: 10px;
  box-sizing: border-box;
  background-color: #dff;
  border-radius: 20px;
  font-size: 14px;
}
.mv-container .comments-wrap .item .reply-wrap .huifu {
  float: left;
}
.mv-container .comments-wrap .item .reply-wrap .r-name {
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
.mv-container .comments-wrap .item .reply-wrap .r-comment {
  padding: 0 10px;
}

/* comment end */
</style>
