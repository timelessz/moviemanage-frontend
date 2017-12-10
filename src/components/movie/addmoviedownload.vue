<template>
  <div>
    <Modal
      v-model="modal" width="900">
      <p slot="header">
        <span>修改首页大图</span>
      </p>
      <div>
        <Form ref="addmoviedownload" :model="form" :label-width="90" :rules="SaveRule" class="node-add-form">
          <Form-item label="下载链接" prop="href">
            <Input type="text" v-model="form.href" placeholder="请输入下载链接"></Input>
          </Form-item>
          <Form-item label="下载text" prop="text">
            <Input type="text" v-model="form.text" placeholder="请输入下载链接"></Input>
          </Form-item>
          <Form-item label="密码" prop="pwd">
            <Input type="text" v-model="form.pwd" placeholder="百度云盘请输入密码"></Input>
          </Form-item>
          <Form-item label="类型" prop="movietag">
            <Select ref="downloadtype" v-model="form.type_id" multiple>
              <Option v-for="item in tag" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" :loading="modal_loading" @click="save">添加</Button>
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
