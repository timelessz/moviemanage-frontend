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
        <Form ref="doanloadadd" :model="form" :label-width="90" :rules="SaveRule" class="node-add-form">
          <Form-item label="电影id" prop="text">
            <Input type="text" v-model="form.movie_id" placeholder=""></Input>
          </Form-item>
          <Form-item label="下载链接" prop="href">
            <Input type="text" v-model="form.href" placeholder="请输入下载链接"></Input>
          </Form-item>
          <Form-item label="下载text" prop="text">
            <Input type="text" v-model="form.text" placeholder="下载text"></Input>
          </Form-item>
          <Form-item label="类型" prop="type">
            <Select v-model="form.type_id" style="width: 150px;" label-in-value filterable clearable
                    @on-change="changedownloadtype">
              <Option v-for="item in type" :value="item.id" :key="item.id">
                {{ item.text}}
              </Option>
            </Select>
          </Form-item>
          <Form-item label="密码" prop="pwd">
            <Input type="text" v-model="form.pwd" placeholder="百度云盘请输入密码"></Input>
          </Form-item>
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
          movie_id: 0,
          type_name: '',
          href: '',
          text: '',
          pwd: ''
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
      changedownloadtype(value) {
        this.form.type_name = value.label
      },
      add() {
        this.modal_loading = true;
        let data = this.form;
        this.apiPost('moviedownloadlink', data).then((res) => {
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
      type: {}
    }
  }
</script>
