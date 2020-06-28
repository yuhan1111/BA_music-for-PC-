<template>
  <div class="mvs-container">
    <!-- 筛选器 -->
    <div class="filter-wrap">
      <!-- 分类切换-地区 -->
      <div class="section-wrap">
        <span class="section-type">地区：</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span class="title" :class="{active:area=='全部'}" @click="area='全部'">全部</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='内地'}" @click="area='内地'">内地</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='港台'}" @click="area='港台'">港台</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='欧美'}" @click="area='欧美'">欧美</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='日本'}" @click="area='日本'">日本</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:area=='韩国'}" @click="area='韩国'">韩国</span>
          </li>
        </ul>
      </div>
      <div class="type-wrap">
        <span class="type-type">类型：</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span class="title" :class="{active:type=='全部'}" @click="type='全部'">全部</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type=='官方版'}" @click="type='官方版'">官方版</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type=='原声'}" @click="type='原声'">原声</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type=='现场版'}" @click="type='现场版'">现场版</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:type=='BA出品'}" @click="type='BA出品'">BA出品</span>
          </li>
        </ul>
      </div>
      <div class="order-wrap">
        <span class="order-type">排序：</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span class="title" :class="{active:order=='上升最快'}" @click="order='上升最快'">上升最快</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:order=='最热'}" @click="order='最热'">最热</span>
          </li>
          <li class="tab">
            <span class="title" :class="{active:order=='最新'}" @click="order='最新'">最新</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 推荐MV -->
    <div class="mvs">
      <ul class="items">
        <li class="item" v-for="(item,index) in list" :key="index" @click="toMVPlayer(item.id)">
          <div class="img-wrap">
            <img :src="item.cover" alt />
          </div>
          <div class="cover-wrap el-icon-video-play"></div>
          <div class="num-wrap">
            <div class="el-icon-view m-icon"></div>
            <div class="num">{{item.playCount}}</div>
          </div>
          <div class="time-wrap">{{item.duration}}</div>
          <div class="info-wrap">
            <div class="name">{{item.name}}</div>
            <div class="singer">{{item.artists[0].name}}</div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 分页 -->
    <el-pagination
      class="m-page"
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="12"
      :limit="limit"
    ></el-pagination>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "mvs",
  data() {
    return {
      //查询结果
      list: [],
      //总条数
      total: 20,
      //页码
      page: 1,
      //页容量
      limit: 12,
      //地区
      area: "全部",
      //类型
      type: "全部",
      //排序
      order: "上升最快"
    };
  },
  watch: {
    area() {
      this.getList();
      this.page = 1;
    },
    type() {
      this.getList();
      this.page = 1;
    },
    order() {
      this.getList();
      this.page = 1;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      axios({
        url: "https://autumnfish.cn/mv/all",
        method: "get",
        params: {
          area: this.area,
          type: this.type,
          arder: this.order,
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        }
      }).then(res => {
        // console.log(res);
        this.list = res.data.data;
        for (let i = 0; i < this.list.length; i++) {
          this.list[i].playCount =
            this.list[i].playCount > 10000
              ? parseInt(this.list[i].playCount / 10000) + "万"
              : this.list[i].playCount;
        }
        for (let i = 0; i < this.list.length; i++) {
          let duration = this.list[i].duration;
          let min = parseInt(duration / 1000 / 60);
          min = min < 10 ? "0" + min : min;
          let sec = parseInt((duration / 1000) % 60);
          sec = sec < 10 ? "0" + sec : sec;
          // console.log(min +':'+ sec);
          let durations = min + ":" + sec;
          this.list[i].duration = `${min}:${sec}`;
        }
        if (res.data.count) {
          this.total = res.data.count;
        }
        // console.log(this.total);
      });
    },
    handleCurrentChange(val) {
      // console.log(`当前页:${val}`);
      this.page = val;
      this.getList();
    },
    toMVPlayer(id){
      this.$router.push(`/mv?q=${id}`)
    }
  }
};
</script>

<style>
.mvs-container {
  width: 950px;
}
.mvs-container .filter-wrap {
  width: 100%;
  font-size: 14px;
  margin-bottom: 20px;
}
.mvs-container .filter-wrap .tab {
  width: 100px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  float: left;
  cursor: pointer;
}
.filter-wrap .section-wrap,
.type-wrap,
.order-wrap {
  display: flex;
  margin-bottom: 20px;
}
.filter-wrap .section-type,
.type-type,
.order-type {
  width: 50px;
  line-height: 30px;
  font-weight: 700;
}
.active {
  display: inline-block;
  padding: 0px 20px 0px 20px;
  color: skyblue;
  background-color: #E3EDCD;
  border-radius: 30px;
  font-weight: 700;
  box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
}
/* filter-wrap end */
/* mvs start */
.mvs-container .mvs {
  width: 100%;
}
.mvs-container .mvs .items {
  width: 960px;
}
.mvs-container .mvs .items .item {
  position: relative;
  float: left;
  margin-right: 10px;
  width: 230px;
  height: 170px;
  margin-bottom: 20px;
}
.mvs-container .mvs .items .item .time-wrap {
  position: absolute;
  text-align: right;
  color: white;
  font-size: 14px;
  width: 50px;
  right: 10px;
  top: 105px;
}
.mvs-container .mvs .items .item .cover-wrap {
  position: absolute;
  z-index: 9;
  width: 230px;
  height: 130px;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 50px;
  text-align: center;
  line-height: 130px;
  display: none;
}
.mvs-container .mvs .items .item:hover .cover-wrap {
  display: block;
}
.mvs-container .mvs .items .item .img-wrap {
  width: 100%;
  height: 130px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
}
.mvs-container .mvs .items .item .img-wrap img {
  width: 100%;
  height: 100%;
}
.mvs-container .mvs .items .item .num-wrap {
  position: absolute;
  right: 0;
  top: 0;
  width: 60px;
  height: 20px;
}
.mvs-container .mvs .items .item .num-wrap .m-icon {
  float: left;
  font-size: 14px;
  text-align: center;
  line-height: 20px;
  margin-right: 5px;
  color: white;
}
.mvs-container .mvs .items .item .num-wrap .num {
  float: left;
  font-size: 12px;
  color: white;
  line-height: 20px;
}
.mvs-container .mvs .items .item .info-wrap {
  width: 100%;
  height: 40px;
}
.mvs-container .mvs .items .item .info-wrap .name {
  box-sizing: border-box;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 10px;
}
.mvs-container .mvs .items .item .info-wrap .singer {
  box-sizing: border-box;
  padding-left: 10px;
  font-size: 12px;
  color: #aac;
}
/* mvs end */
/* 分页符start */
.mvs-container .m-page {
  width: 420px;
  margin: 20px auto;
  overflow: hidden;
}
/* 分页符end */
</style>
