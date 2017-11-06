<template>
  <div>
    <div>
      <Modal
        v-model="modal" width="1000">
        <p slot="header">
          <span>迅雷铺电影转移 {{form.region_name}} <a :href="form.href" target="_blank">{{form.title}}</a></span>
        </p>
        <div>
          <Form ref="movieedit" :model="form" :label-width="90" :rules="AddRule" class="node-add-form">
            <Form-item label="电影页面标题" prop="name">
              <Input type="text" v-model="form.title" placeholder="电影页面标题"></Input>
            </Form-item>
            <Row>
              <Col span="15">
              <Row>
                <Col span="12">
                <Form-item label="电影名" prop="name">
                  <Input type="text" v-model="form.name" placeholder="电影名"></Input>
                </Form-item>
                </Col>
                <Col span="12">
                <Form-item label="别名" prop="alias_name">
                  <Input type="text" v-model="form.alias_name" placeholder="别名"></Input>
                </Form-item>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                <Form-item label="电影类型" prop="movietype">
                  <Select ref="movietype" v-model="form.type" multiple>
                    <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </Form-item>
                </Col>
                <Col span="12">
                <Form-item label="标签" prop="movietag">
                  <Select ref="movietag" v-model="form.tags" multiple>
                    <Option v-for="item in tag" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </Form-item>
                </Col>
              </Row>
              <Form-item label="详情" prop="summary">
                <Input type="textarea" v-model="form.summary" placeholder="详情"></Input>
              </Form-item>
              <Row>
                <Col span="12">
                <Form-item label="豆瓣评分" prop="doubanscore">
                  <Input type="text" v-model="form.doubanscore" placeholder="豆瓣评分"></Input>
                </Form-item>
                </Col>
                <Col span="9">
                <Form-item label="链接" prop="doubanurl">
                  <Input type="text" v-model="form.doubanurl" placeholder="豆瓣评分"></Input>
                </Form-item>
                </Col>
                <Col>
                <a :href="form.doubanurl" v-if="form.doubanurl" target="_blank">链接</a>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                <Form-item label="IMDB分数" prop="tag">
                  <Input type="text" v-model="form.imdbscore" placeholder="IMDB评分"></Input>
                </Form-item>
                </Col>
                <Col span="9">
                <Form-item label="链接" prop="tag">
                  <Input type="text" v-model="form.imdburl" placeholder="IMDB评分"></Input>
                </Form-item>
                </Col>
                <Col>
                <a :href="form.imdburl" v-if="form.imdburl" target="_blank">链接</a>
                </Col>
              </Row>
              <Form-item label="上映时间" prop="releasedate">
                <Input type="text" v-model="form.releasedate" placeholder="上映时间"></Input>
              </Form-item>
              <Form-item label="导演" prop="director">
                <Input type="text" v-model="form.director" placeholder="导演"></Input>
              </Form-item>
              <Form-item label="主演" prop="starring">
                <Input type="textarea" v-model="form.starring" placeholder="主演"></Input>
              </Form-item>
              </Col>
              <Col span="9">
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
              </Col>
            </Row>
            <Form-item label="内容" prop="tag">
              <editor @change="updateContent" :content="form.content" :height="300" :auto-height="false"></editor>
            </Form-item>
            <Form-item label="评论" prop="comment">
              <editor @change="updateComment" :content="form.comment" :height="200" :auto-height="false"></editor>
            </Form-item>
          </Form>
        </div>
        <div slot="footer">
          <Button type="success" :loading="modal_loading" @click="edit">保存</Button>
          <Button type="ghost" @click="handleReset" style="margin-left: 8px">重置</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import http from '../../assets/js/http.js';

  export default {
    data() {
      return {
        self: this,
        modal: false,
        modal_loading: false,
        form: {},
        editorOption: {},
        showheader: true,
        size: 'small',
        perdownloadlink: {},
        AddRule: {
//          name: [
//            {required: true, message: '请填写文章分类', trigger: 'blur'},
//          ],
//          detail: [
//            {required: true, message: '请填写文章详情', trigger: 'blur'},
//          ],
//          tag: [
//            {required: true, message: '请输入标签区分分类', trigger: 'blur'},
//          ]
        }
      }
    },
    components: {},
    methods: {
      edit() {
        this.$refs.movieedit.validate((valid) => {
          if (valid) {
            this.modal_loading = true;
            let data = this.form;
            let id = this.form.id;
            this.apiPut('moviemanage/' + id, data).then((res) => {
              this.handelResponse(res, (data, msg) => {
                this.modal = false;
                this.$parent.getData();
                this.$Message.success(msg);
                this.modal_loading = false;
                this.handleReset();
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
      getMovie(id) {
        this.apiGet('moviemanage/' + id + '/edit').then((res) => {
          this.handelResponse(res, (data, msg) => {
            this.form = data
          }, (data, msg) => {
            this.$Message.error(msg);
          })
        }, (res) => {
          //处理错误信息
          this.$Message.error('网络异常，请稍后重试。');
        })
      },
      handleReset() {
        this.$refs.movietype.resetFields();
        this.$refs.movietag.resetFields();
      },
      updateContent(data) {
        this.form.content = data
      },
      updateComment(data) {
        this.form.comment = data
      },
    },
    props: {
      type: {},
      tag: {},
    },
    computed: {
      downloadcolums() {
        let columns = []
        let _this = this
        columns.push({
          title: '下载链接',
          key: 'href',
          sortable: true,
          render(h, params) {
            let text = params.row.text;
            return h('a', {
              attrs: {
                href: params.row.href,
                target: '_blank',
                title: params.row.title
              },
            }, text)
          }
        });
        columns.push({
          title: '类型',
          key: 'type_name',
          sortable: true,
          width: 100
        });
        columns.push(
          {
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 150,
            render(h, params) {
              return h('div', [
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  attrs: {
                    type: 'primary'
                  },
                  on: {
                    click: function () {
                      //不知道为什么这个地方不是我需要的this
                      _this.editdownload(params)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  attrs: {
                    type: 'error',
                    style: 'margin-left:3px',
                    title: '删除'
                  },
                  on: {
                    click: function () {
                      //不知道为什么这个地方不是我需要的this
                      _this.deletedownload(params)
                    }
                  }
                }, '删除'),
              ]);
            }
          }
        );
        return columns;
      }
    },
    mixins: [http]
  }
</script>
<style>

</style>
