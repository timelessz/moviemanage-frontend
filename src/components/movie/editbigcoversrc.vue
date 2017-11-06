<template>
  <div>
    <Modal
      v-model="modal" width="900">
      <p slot="header">
        <span>修改首页大图</span>
      </p>
      <div>
        <Form ref="editcoversrc" :model="form" :label-width="90" :rules="SaveRule" class="node-add-form">
          <div style="width: 85%;margin: 0 auto">
            <Row>
              <Col span="24">
              <img :src="form.coversrc" alt="" style="width: 80%;">
              </Col>
            </Row>
            <Row>
              <Col span="24">
              <Input type="text" v-model="form.coversrc" placeholder="请输入缩略图的链接"></Input>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" :loading="modal_loading" @click="save">修改</Button>
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
          coversrc: ''
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
      getImgSrc(id) {
        this.apiGet('getmoviecoversrc/' + id).then((res) => {
          this.handelResponse(res, (data, msg) => {
            this.form.coversrc = data.bigcoversrc
            this.form.id = id
          }, (data, msg) => {
            this.$Message.error(msg);
          })
        }, (res) => {
          //处理错误信息
          this.$Message.error('网络异常，请稍后重试。');
        })
      },
      save() {
        if (!this.form.coversrc) {
          this.$Message.error('保存失败，请填写轮播图链接。');
          return;
        }
        this.modal_loading = true;
        let data = this.form;
        this.apiPost('setmoviecoversrc', data).then((res) => {
          this.handelResponse(res, (data, msg) => {
            this.modal = false;
            this.$Message.success(msg);
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
    props: {}
  }
</script>
