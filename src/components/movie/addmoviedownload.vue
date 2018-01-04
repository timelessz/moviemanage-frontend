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
            <Input type="text" v-model="form.text" placeholder="请输入下载链接展现text"></Input>
          </Form-item>
          <Form-item label="密码" prop="pwd">
            <Input type="text" v-model="form.pwd" placeholder="百度云盘请输入密码"></Input>
          </Form-item>
          <Form-item label="类型" prop="movietag">
            <Select ref="downloadtype" v-model="form.type_id" label-in-value @on-change="typechange">
              <Option v-for="item in downloadtype" :value="item.id" :key="item.id">{{ item.text }}</Option>
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
          movie_id: 0,
          movie_name: ''
        },
        downloadtype: {},
        SaveRule: {
          href: [
            {required: true, message: '请填写下载链接', trigger: 'blur'},
          ],
          text: [
            {required: true, message: '请填写下载链接text', trigger: 'blur'},
          ]
        }
      }
    },
    computed: {},
    methods: {
      getMovieDownload(movie_id, movie_name) {
        this.form.movie_id = movie_id
        this.form.movie_name = movie_name
        this.apiGet('moviedownloadtype').then((res) => {
          this.handelResponse(res, (data, msg) => {
            this.downloadtype = data
          }, (data, msg) => {
            this.$Message.error(msg);
          })
        }, (res) => {
          //处理错误信息
          this.$Message.error('网络异常，请稍后重试。');
        })
      },
      save() {
        if (!this.form.type_id) {
          this.$Message.error('请选择下载链接类型的分类。');
          return
        }
        this.$refs.addmoviedownload.validate((valid) => {
          if (valid) {
            this.modal_loading = true;
            let data = this.form;
            this.apiPost('moviedownloadlink', data).then((res) => {
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
        })


      },
      typechange(value) {
        this.form.type_name = value.label
        this.form.type_id = value.value
      }
    },
    mixins: [http],
  }
</script>
