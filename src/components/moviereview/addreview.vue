<template>
  <div>
    <Modal
      v-model="modal"
      width="900"
    >
      <p slot="header">
        <span>添加电影/美剧影评</span>
      </p>
      <div>
        <Form ref="moviereview" :model="form" :label-width="90" :rules="SaveRule" class="node-add-form">
          <Form-item label="标题" prop="name">
            <Input type="text" v-model="form.title" placeholder="标题"></Input>
          </Form-item>
          <Form-item label="阅读次数" prop="count">
            <Input type="text" v-model="form.count" placeholder="阅读次数"></Input>
          </Form-item>
          <Form-item label="页面关键词" prop="keyword">
            <Input type="text" v-model="form.keyword" placeholder="页面关键词"></Input>
          </Form-item>
          <Form-item label="总结" prop="summary">
            <Input type="text" v-model="form.summary" placeholder="总结"></Input>
          </Form-item>
          <div style="width: 85%;margin: 0px auto;padding-bottom: 20px">
            <Row>
              <Col span="12">
              缩略图
              <Input type="text" v-model="form.thumbnail" placeholder="缩略图链接"></Input>
              </Col>
              <Col span="12">
              <img :src="form.thumbnail" alt="" style="width: 200px;">
              </Col>
            </Row>
          </div>
          <div style="width: 85%;margin: 0 auto">
            <Row>
              <Col span="24">
              <editor @change="updateContent" :content="form.content" :height="300"
                      :auto-height="false">
              </editor>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" :loading="modal_loading" @click="add">保存</Button>
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
        form: {
          content: '',
          thumbnail: '',
        },
        SaveRule: {
//          name: [
//            {required: true, message: '请填写活动/创意名', trigger: 'blur'},
//          ],
        }
      }
    },
    computed: {},
    methods: {
      updateContent(data) {
        this.form.content = data
      },
      add() {
        this.modal_loading = true;
        let data = this.form;
        data.movie_id = this.movie_id;
        data.movie_name = this.movie_name;
        data.type = this.type;
        this.apiPost('moviereview', data).then((res) => {
          this.handelResponse(res, (data, msg) => {
            this.modal = false;
            this.$Message.success(msg);
            this.$parent.getData();
            this.modal_loading = false;
            this.form = {};
          }, (data, msg) => {
            this.modal_loading = false;
            this.$Message.error(msg);
          })
        }, (res) => {
          //处理错误信息
          this.modal_loading = false;
          this.$Message.error('网络异常，请稍后重试。');
        })
      }
    },
    mixins: [http],
    props: {
      movie_id: 0,
      movie_name: '',
      type: ''
    }
  }
</script>
