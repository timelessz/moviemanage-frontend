<template>
  <div>
    <Modal
      v-model="modal" width="900" :transfer="transfer" style="position: relative;z-index: 1100;">
      <p slot="header">
        <span>修改模板</span>
      </p>
      <div>
        <Form ref="doanloadsave" :model="form" :label-width="90" :rules="SaveRule" class="node-add-form">
          <Form-item label="下载链接" prop="href">
            <Input type="text" v-model="form.href" placeholder="请输入下载链接"></Input>
          </Form-item>
          <Form-item label="下载text" prop="text">
            <Input type="text" v-model="form.text" placeholder="请输入模板活动/创意相关信息"></Input>
          </Form-item>
          <Form-item label="密码" prop="pwd">
            <Input type="text" v-model="form.pwd" placeholder="百度云盘请输入密码"></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" :loading="modal_loading" @click="save">保存</Button>
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
        SaveRule: {
          name: [
            {required: true, message: '请填写活动/创意名', trigger: 'blur'},
          ],
          detail: [
            {required: true, message: '请填写活动/创意详情', trigger: 'blur'},
          ],
          directory_name: [
            {required: true, message: '请填写活动文件夹名', trigger: 'blur'}
          ]
        },
        transfer: true
      }
    },
    computed: {},
    methods: {
      save() {
        this.$refs.doanloadsave.validate((valid) => {
          if (valid) {
            this.modal_loading = true;
            let data = this.form;
            //更新数据
            this.apiPut('btbtdydownloadlink/' + data.id, data).then((res) => {
              this.handelResponse(res, (data, msg) => {
                this.modal = false;
                //父亲节点重新请求下载链接
                this.$Message.success(msg);
                this.modal_loading = false;
                this.$refs.doanloadsave.resetFields();
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
      }
    },
    mixins: [http],
    props: {
      form: {
        default: {}
      }
    }
  }
</script>
