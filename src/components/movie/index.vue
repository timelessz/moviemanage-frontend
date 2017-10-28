<template>
  <div>
    <div class="top">
      电影名:
      <Input v-model="movie_name" placeholder="请输入活动名" style="width:300px;"></Input>
      区域:
      <Select v-model="region_id" style="width: 150px;" label-in-value filterable clearable>
        <Option v-for="item in movieregion" :value="item.value" :key="item.value">
          {{ item.label}}
        </Option>
      </Select>
      <Button type="primary" @click="queryData">查询</Button>
      <Button type="success" @click="add">添加</Button>
    </div>
    <div class="content" style="margin-top:10px;">
      <Table :context="self" :border="border" :stripe="stripe" :show-header="showheader"
             :size="size" :data="datas" :columns="tableColumns" style="width: 100%">
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" :current="current" @on-change="changePage" @on-page-size-change="changePageSize"
                show-total
                show-elevator>
          </Page>
        </div>
      </div>
    </div>
    <addmovie ref="addmovie" :region="movieregion" :tag="movietag" :type="movietype"></addmovie>
    <!--<activitysave ref="save" :form="editinfo"></activitysave>-->
  </div>
</template>

<script type="text/ecmascript-6">
  import http from '../../assets/js/http.js';
  import date from '../../assets/js/date'
  //转移到电影库中
  import addmovie from './addmovie.vue'

  export default {
    data() {
      return {
        self: this,
        border: true,
        stripe: true,
        current: 1,
        showheader: true,
        showIndex: true,
        size: 'small',
        total: 0,
        page: 1,
        rows: 10,
        movie_name: '',
        region_id: 0,
        datas: [],
//      电影类型
        movietype: {},
//      电影标签
        movietag: {},
//      电影区域
        movieregion: {},
      }
    },
    components: {addmovie},
    created() {
      this.getData();
      this.getMovieType();
      this.getMovieTag();
      this.getMovieRegion();
    },
    methods: {
      getData() {
        let data = {
          params: {
            page: this.page,
            rows: this.rows,
            movie_name: this.movie_name,
          }
        }
        this.apiGet('moviemanage', data).then((data) => {
          this.handelResponse(data, (data, msg) => {
            this.datas = data.rows
            this.total = data.total;
          }, (data, msg) => {
            this.$Message.error(msg);
          })
        }, (data) => {
          this.$Message.error('网络异常，请稍后重试');
        })
      },
      changePage(page) {
        this.page = page;
        this.getData();
      },
      changePageSize(pagesize) {
        this.rows = pagesize;
        this.getData();
      },
      queryData() {
        this.getData();
      },
      getMovieType() {
        this.apiGet('movietypelist').then((res) => {
          this.handelResponse(res, (data, msg) => {
            this.movietype = data
          }, (data, msg) => {
            this.$Message.error(msg);
          })
        }, (res) => {
          //处理错误信息
          this.$Message.error('网络异常，请稍后重试。');
        })
      },
      getMovieRegion() {
        this.apiGet('movieregionlist').then((res) => {
          this.handelResponse(res, (data, msg) => {
            this.movieregion = data
          }, (data, msg) => {
            this.$Message.error(msg);
          })
        }, (res) => {
          //处理错误信息
          this.$Message.error('网络异常，请稍后重试。');
        })
      },
      getMovieTag() {
        this.apiGet('movietaglist').then((res) => {
          this.handelResponse(res, (data, msg) => {
            this.movietag = data
          }, (data, msg) => {
            this.$Message.error(msg);
          })
        }, (res) => {
          //处理错误信息
          this.$Message.error('网络异常，请稍后重试。');
        })
      },
      add() {
        this.$refs.addmovie.modal = true
      },
    },
    computed: {
      tableColumns() {
        let columns = []
        let _this = this
        columns.push(
          {
            title: '缩略图',
            key: 'action',
            align: 'center',
            fixed: 'center',
            width: 120,
            render(h, params) {
              if (params.row.coversrc) {
                //20 表示禁用 按钮应该为启用
                return h('div', [
                  h('img', {
                    attrs: {
                      src: params.row.coversrc,
                      class: 'coverimg',
                      title: params.row.title,
                    }
                  })
                ]);
              }
              return ''
            }
          }
        );
        columns.push({
          title: '标题',
          key: 'title',
        });
        columns.push({
          title: '阅读',
          key: 'pvcount',
          width: 100
        });
        columns.push({
          title: '类型',
          key: 'region_name',
          width: 100
        });
        columns.push({
          title: '年代',
          key: 'ages',
          width: 100
        });
        columns.push({
          title: '热门',
          width: 80,
          render(h, params) {
            if (params.row.is_hot != '10') {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'checkmark'
                  },
                  attrs: {
                    style: 'color:green'
                  },
                })
              ]);
            }
            return h('div', [
              h('Icon', {
                props: {
                  type: 'close-round'
                },
                attrs: {
                  style: 'color:red'
                },
              })
            ]);
          }
        });
        columns.push({
          title: '展现',
          width: 70,
          render(h, params) {
            if (params.row.is_show != '10') {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'checkmark'
                  },
                  attrs: {
                    style: 'color:green'
                  },
                })
              ]);
            }
            return h('div', [
              h('Icon', {
                props: {
                  type: 'close-round'
                },
                attrs: {
                  style: 'color:red'
                },
              })
            ]);
          }
        });
        columns.push({
          title: '创建时间',
          key: 'created_at',
          width: 180,
          render(h, params) {
            let create_date = params.row.created_at
            var date = new Date(create_date * 1000);
            return _this.formatDate(date, 'yyyy-MM-dd hh:mm');
          }
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
                      _this.addtomovie(params)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  attrs: {
                    type: 'success',
                    style: 'margin-left:3px',
                    title: '设置'
                  },
                  on: {
                    click: function () {
                      //不知道为什么这个地方不是我需要的this
                      _this.addtomovie(params)
                    }
                  }
                }, '显示'),
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  attrs: {
                    type: 'success',
                    style: 'margin-left:3px',
                    title: '设置'
                  },
                  on: {
                    click: function () {
                      //不知道为什么这个地方不是我需要的this
                      _this.addtomovie(params)
                    }
                  }
                }, '首页大图'),
              ]);
            }
          }
        );
        return columns;
      }
    },
    mixins: [http, date]
  }

</script>
<style>
  .coverimg {
    max-width: 100px;
  }
</style>
