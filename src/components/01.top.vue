<template>
    <div class="top-container">
        <div class="left-box">
            <ul class="icon-wrapper">
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>
        <div class="right-box">
            <div class="el-input el-inupt--small el-input--prefix">
                <input type="text" autocomplete="off" placeholder="搜索" class="el-input__inner" v-model="inputValue" @keyup.enter="toResult">
                <span class="el-input__prefix el-icon-search"></span>            
            </div>
        </div>
    </div>
</template>

<script>
import Axios from 'axios'
export default {
    name:"top",
    data(){
        return {
            // 输入的内容
            inputValue: ''
        }
    },
    methods: {
        toResult(){
            // 非空判断
            if(this.inputValue == ''){
                this.$message.warning('请输入要搜索内容') 
            } else { 
                this.$router.push(`/result?q=${this.inputValue}`)  
            }
        },
    },
}
</script>

<style>
.top-container {
    display: flex;
    width: 1200px;
    height: 60px;
    margin: 10px 0;
    background-color: #aff;
    box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
    border-top-left-radius: 30px;
}
.top-container .left-box {
    width: 900px;
}
.top-container .left-box .icon-wrapper {
    float: left;
    height: 30px;
    margin-top: 15px;
    margin-left: 20px;
}
.top-container .left-box .icon-wrapper li {
    float: left;
    width: 30px;
    height: 30px;
    margin-right: 30px;
    border-radius: 50%;
    line-height: 60px;
    box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
}
.top-container .left-box .icon-wrapper li:nth-child(1){
    background-color: #DCE2F1  ;
}
.top-container .left-box .icon-wrapper li:nth-child(2){
    background-color: rgb(238, 238, 136);
}
.top-container .left-box .icon-wrapper li:nth-child(3){
    background-color: rgb(103, 250, 103);
}
.top-container .left-box .history-wrapper {
    float: left;
    /* background-color: greenyellow; */
    margin-top: 15px;
    margin-left: 20px;
}
.top-container .left-box .history-wrapper li {
    float: left;
    width: 30px;
    height: 30px;
    margin-right: 30px;
    border-radius: 50%;
    line-height: 60px;
    font-size: 30px;
    line-height: 30px;
    text-align: center;
    font-weight: 700;
    color: honeydew;
    
}
.top-container .left-box .history-wrapper li::before {
    box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
    border-radius: 50%;
}

/* right box start */
.top-container .right-box {
    box-sizing: border-box;
    padding-right: 20px;
    text-align: right;
    line-height: 60px;
    flex: 1;
}
.top-container .right-box .el-input {
    position: relative;
}
.top-container .right-box .el-input input {
    padding-left: 40px;
    font-size: 16px;
    width: 280px;
    /* outline: none; */
    border: none;
    border-radius: 20px;
    box-shadow: 0 10px 15px -5px rgba(0,0,0,.5);
}
.top-container .right-box .el-input span {
    position: absolute;
    display: block;
    line-height: 64px;
    left: 10px;
    color: skyblue;
    font-size: 20px;
}
/* right box end */

        
</style>

</style>
