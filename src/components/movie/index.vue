<template>
  <div>
    <div class="top">
      活动:
      <Input v-model="movie_name" placeholder="请输入活动名" style="width:300px;"></Input>
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
        this.apiGet('movie', data).then((data) => {
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
        if (this.showCheckbox) {
          columns.push({
            type: 'selection',
            width: 60,
            align: 'center'
          })
        }
        if (this.showIndex) {
          columns.push({
            type: 'index',
            width: 60,
            align: 'center'
          })
        }
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
          title: '电影名',
          key: 'name',
          sortable: true,
        });
        columns.push({
          title: '区域',
          key: 'region_name',
          sortable: true,
          width: 100
        });
        columns.push({
          title: '区域',
          key: 'region_name',
          sortable: true,
          width: 100
        });
        columns.push({
          title: '年代',
          key: 'ages',
          sortable: true,
          width: 100
        });
        columns.push({
          title: '创建时间',
          key: 'created_at',
          sortable: true,
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
                }, '添加入库')
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
