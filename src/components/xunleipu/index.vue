<template>
  <div>
    <div class="top">
      <Input v-model="movie_name" placeholder="请输入电影名" style="width:300px;"></Input>
      <Input v-model="ages" placeholder="请输入年代" style="width:50px;"></Input>
      <Select v-model="region_id" style="width: 150px;" label-in-value filterable clearable>
        <Option v-for="item in movieregion" :value="item.value" :key="item.value">
          {{item.label}}
        </Option>
      </Select>
      <Button type="primary" @click="queryData">查询</Button>
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
    <addtomovie ref="addtomovie" :tag="movietag" :type="movietype"></addtomovie>
    <imgset ref="movieimg"></imgset>
  </div>
</template>

<script type="text/ecmascript-6">
  import http from '../../assets/js/http.js';
  import date from '../../assets/js/date'
  //转移到电影库中
  import addtomovie from './addtomovie.vue'
  import imgset from '../Movieimg/movieimg.vue'

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
        ages: '',
        datas: [],
        movieregion: {},
        addmovieinfo: {},
        movietag: {},
        movietype: {}
      }
    },
    components: {addtomovie, imgset},
    created() {
      this.getData();
      this.getMovieTag();
      this.getMovieType();
      this.getMovieRegion();
    },
    methods: {
      getData() {
        let data = {
          params: {
            page: this.page,
            rows: this.rows,
            movie_name: this.movie_name,
            region_id: this.region_id,
            ages: this.ages
          }
        }
        this.apiGet('xunleipu', data).then((data) => {
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
      addtomovie(params) {
        this.$refs.addtomovie.getXunleipu(params.row.id);
        this.$refs.addtomovie.modal = true
      },
      getmovieimg(params) {
        this.$refs.movieimg.getimgset(params.row.id, 'xunleipu');
        this.$refs.movieimg.modal = true
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
          render(h, params) {
            let name = params.row.name;
            let alias_name = params.row.alias_name;
            let title = params.row.title;
            name = name ? name : title;
            name = alias_name ? name + '/' + alias_name : name;
            return h('a', {
              attrs: {
                href: params.row.href,
                target: '_blank'
              },
            }, name)
          }
        });
        columns.push({
          title: '区域',
          key: 'region_name',
          sortable: true,
          width: 100
        });
        columns.push({
          title: '国家',
          key: 'country',
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
          title: '状态',
          key: 'movie_id',
          sortable: true,
          width: 80,
          render(h, params) {
            if (params.row.movie_id) {
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
          key: 'create_time',
          sortable: true,
          width: 180,
          render(h, params) {
            let create_date = params.row.create_time
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
                      if (params.row.movie_id) {
                        alert('该电影已经转移到电影库中');
                        return
                      }
                      _this.addtomovie(params)
                    }
                  }
                }, '添加入库'),
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  attrs: {
                    type: 'primary'
                  },
                  on: {
                    click: function () {
                      _this.getmovieimg(params)
                    }
                  }
                }, '图集'),

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
