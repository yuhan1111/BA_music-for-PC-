<template>
  <div id="app">
    <top></top>

    <index></index>
  </div>
</template>

<script>
import top from './components/01.top'
import index from './components/02.index'

export default {
  components:{
    // top:top  
    top, 
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
