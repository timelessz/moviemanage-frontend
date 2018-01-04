<template>
  <div>
    <Modal
      v-model="modal"
      width="900"
    >
      <p slot="header">
        <span>电影图片查看</span>
      </p>
      <div>
        <div v-for="(item,index) in imglist" :key="index">
          <img :src="item" style="max-width:100%; max-height:200px">
          <br>
          <Input type="text" :value=item />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import http from '../../assets/js/http.js';

  export default {
    data() {
      return {
        modal: false,
        modal_loading: false,
        imglist: {},
        value1: ''
      }
    },
    computed: {},
    methods: {
      getimgset(id, tag) {
        this.apiGet('getmovieimgset/' + id + '/' + tag).then((res) => {
          this.handelResponse(res, (data, msg) => {
            console.log(data);
            this.imglist = data
          }, (data, msg) => {
            this.$Message.error(msg);
          })
        }, (res) => {
          //处理错误信息
          this.$Message.error('网络异常，请稍后重试。');
        })
      },
    },
    mixins: [http],
    props: {
      movie_id: 0,
      movie_name: '',
      type: ''
    }
  }
</script>
