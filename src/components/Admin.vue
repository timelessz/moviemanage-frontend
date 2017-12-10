<style scoped>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    height: 100%;
  }

  .layout-breadcrumb {
    margin-top: 60px;
    padding: 10px 15px 0;
  }

  .layout-content {
    min-height: 200px;
    margin: 15px;
    background: #fff;
    border-radius: 4px;
  }

  .layout-content-main {
    padding: 10px;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }

  .layout-menu-left {
    background: #464c5b;
  }

  .layout-right{
    height: 100%;
    overflow-y: scroll;
  }

  .layout-header {
    position: fixed;
    width: 100%;
    z-index: 999;
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

  .layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }

  .layout-ceiling-main a {
    color: #9ba7b5;
  }

  .layout-hide-text .layout-text {
    display: none;
  }

  .ivu-col {
    transition: width .2s ease-in-out;
  }

  .ivu-row-flex {
    height: 100%;
  }
</style>
<template>
  <div class="layout" :class="{'layout-hide-text': spanLeft < 4}">
    <Row type="flex">
      <Col :span="spanLeft" class="layout-menu-left">
      <Menu active-name="activeName" theme="dark" width="auto">
        <div class="layout-logo-left"></div>
        <MenuItem name="1">
          <Icon type="ios-keypad" :size="iconSize"></Icon>
          <span class="layout-text" @click="routerChange('/admin/movie','电影管理')">电影管理</span>
        </MenuItem>
        <MenuItem name="2">
          <Icon type="ios-keypad" :size="iconSize"></Icon>
          <span class="layout-text" @click="routerChange('/admin/moviedownloadlink','电影下载链接管理')">电影下载链接管理</span>
        </MenuItem>
        <MenuItem name="3">
          <Icon type="ios-navigate" :size="iconSize"></Icon>
          <span class="layout-text" @click="routerChange('/admin/xunleipu','迅雷铺电影')">迅雷铺电影</span>
        </MenuItem>
        <MenuItem name="4">
          <Icon type="ios-navigate" :size="iconSize"></Icon>
          <span class="layout-text" @click="routerChange('/admin/hao6v','HAO6V电影')">HAO6V电影</span>
        </MenuItem>
        <MenuItem name="5">
          <Icon type="ios-analytics" :size="iconSize"></Icon>
          <span class="layout-text" @click="routerChange('/admin/moviepreview','电影影评')">电影影评</span>
        </MenuItem>
      </Menu>
      </Col>
      <Col :span="spanRight" class="layout-right">
      <div class="layout-header">
        <Button type="text" @click="toggleClick">
          <Icon type="navicon" size="32"></Icon>
        </Button>
      </div>
      <div class="layout-breadcrumb">
        <Breadcrumb>
          <BreadcrumbItem href="#">首页</BreadcrumbItem>
          <BreadcrumbItem href="#">应用中心</BreadcrumbItem>
          <BreadcrumbItem>某应用</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div class="layout-content">
        <div class="layout-content-main">
          <router-view></router-view>
        </div>
      </div>
      <div class="layout-copy">
        2011-2016 &copy; TalkingData
      </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        spanLeft: 4,
        spanRight: 20,
        activeName: '',
      }
    },
    computed: {
      iconSize() {
        return this.spanLeft === 4 ? 14 : 24;
      }
    },
    methods: {
      routerChange(path, activeName) {
        this.activeName = activeName;
        router.push(path);
      },
      toggleClick() {
        if (this.spanLeft === 4) {
          this.spanLeft = 2;
          this.spanRight = 22;
        } else {
          this.spanLeft = 4;
          this.spanRight = 20;
        }
      },
    }
  }
</script>
