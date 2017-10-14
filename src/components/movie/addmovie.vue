<template>
  <div>
    <div>
      <Modal
        v-model="modal" width="1000">
        <p slot="header">
          <span>电影添加 </span>
        </p>
        <div>
          <Form ref="movieadd" :model="form" :label-width="90" :rules="AddRule" class="node-add-form">
            <Row>
              <Col span="16">
              <Row>
                <Col span="12">
                <Form-item label="电影名" prop="name">
                  <Input type="text" v-model="form.name" placeholder="电影名"></Input>
                </Form-item>
                </Col>
                <Col span="12">
                <Form-item label="别名" prop="en_name">
                  <Input type="text" v-model="form.alias_name" placeholder="别名"></Input>
                </Form-item>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                <Form-item label="所属分类" prop="movietype">
                  <Select ref="movietype" v-model="form.type" multiple>
                    <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </Form-item>
                </Col>
                <Col span="12">
                <Form-item label="区域属性" prop="movieregion">
                  <Select ref="movieregion" v-model="form.region_id" :label-in-value="true" @on-change="regionchange">
                    <Option v-for="item in region" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </Form-item>
                </Col>
              </Row>
              <!--需要考虑到如果没有的话怎么处理-->
              <Row>
                <Col span="12">
                <Form-item label="标签" prop="movietag">
                  <Select ref="movietag" v-model="form.tags" multiple>
                    <Option v-for="item in tag" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </Form-item>
                </Col>
                <Col span="12">
                <Form-item label="年代" prop="ages">
                  <Input type="text" v-model="form.ages" placeholder="年代"></Input>
                </Form-item>
                </Col>
              </Row>
              <Form-item label="电影简介" prop="summary">
                <Input type="textarea" v-model="form.summary" placeholder="电影的简介"></Input>
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
                <Form-item label="IMDB评分" prop="doubanscore">
                  <Input type="text" v-model="form.imdbscore" placeholder="IMDB评分"></Input>
                </Form-item>
                </Col>
                <Col span="9">
                <Form-item label="IMDB链接" prop="doubanurl">
                  <Input type="text" v-model="form.imdburl" placeholder="IMDB评分"></Input>
                </Form-item>
                </Col>
                <Col>
                <a :href="form.imdburl" v-if="form.imdburl" target="_blank">链接</a>
                </Col>
              </Row>
              <Row>
                <Col span="12">
                <Form-item label="上映时间" prop="releasedate">
                  <Input type="text" v-model="form.releasedate" placeholder="上映时间"></Input>
                </Form-item>
                </Col>
                <Col span="12">
                <Form-item label="电影时长" prop="length">
                  <Input type="text" v-model="form.length" placeholder="电影时长"></Input>
                </Form-item>
                </Col>
              </Row>
              <Form-item label="导演" prop="director">
                <Input type="text" v-model="form.director" placeholder="导演"></Input>
              </Form-item>
              <Form-item label="主演" prop="starring">
                <Input type="textarea" v-model="form.starring" placeholder="主演"></Input>
              </Form-item>
              </Col>
              <Col span="8">
              <div style="width: 95%;margin: 0 auto">
                <Form-item label="电影标题" prop="starring">
                  <Input type="text" v-model="form.title" placeholder="标题"></Input>
                </Form-item>
                <Row>
                  <Col span="24">
                  <img :src="form.coversrc" alt="" style="width: 80%;">
                  </Col>
                </Row>
                <Row>
                  <Col span="24">
                  <Form-item label="内容" prop="content">
                    <Input type="text" v-model="form.coversrc" placeholder="请输入缩略图的链接"></Input>
                  </Form-item>
                  </Col>
                </Row>
              </div>
              </Col>
            </Row>
            <Form-item label="内容" prop="content">
              <editor @change="updateContent" :content="form.content" :height="300" :auto-height="false"></editor>
            </Form-item>
            <Form-item label="评论" prop="comment">
              <editor @change="updateComment" :content="form.comment" :height="200" :auto-height="false"></editor>
            </Form-item>
          </Form>
        </div>
        <div slot="footer">
          <Button type="success" :loading="modal_loading" @click="add">保存</Button>
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
        modal: false,
        modal_loading: false,
        form: {
          type: [],
          tags: [],
          doubanurl: '',
          coversrc: '',
          imdburl: ''
        },
        editorOption: {},
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
    methods: {
      add() {
        this.$refs.movieadd.validate((valid) => {
          if (valid) {
            this.modal_loading = true;
            let data = this.form;
            console.log(data)
            this.apiPost('movie', data).then((res) => {
              this.handelResponse(res, (data, msg) => {
                this.modal = false;
                this.$parent.getData();
                this.$Message.success(msg);
                this.modal_loading = false;
                this.handleReset()
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
      handleReset() {
        this.$refs.movietype.resetFields();
        this.$refs.movieregion.resetFields();
        this.$refs.movietag.resetFields();
      },
      updateContent(data) {
        this.form.content = data
      },
      updateComment(data) {
        this.form.comment = data
      },
      regionchange(value) {
        this.form.region_name = value.label
        this.form.region_id = value.value
      }
    },
    mixins: [http],
    props: {
      type: {},
      tag: {},
      region: {}
    }
  }
</script>
<style>

</style>
