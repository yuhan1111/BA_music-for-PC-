<template>
  <div id="app">
    <top></top>
    <!-- 3.定位组件 头部组件-->

    <!--主体组件  -->
    <index></index>
  </div>
</template>

<script>
import top from './components/01.top' //1.引入组件
import index from './components/02.index'

export default {
  components:{
    // top:top  
    top,  //2.注册组件简写
    index,

  },
  methods:{
    
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  
  margin: 0 auto;
  padding: 0;
  width: 1200px;
}
</style>