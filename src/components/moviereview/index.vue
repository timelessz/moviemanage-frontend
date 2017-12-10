<template>
  <div>
    <div class="top">
      <Input v-model="movie_name" placeholder="请输入电影名" style="width:300px;"></Input>
      <Input v-model="ages" placeholder="请输入年代" style="width:50px;"></Input>
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
    <addreview ref="addreview" :movie_id="movie_id" :movie_name="movie_name" :type="type"></addreview>
    <editreview ref="editreview"></editreview>
  </div>
</template>

<script type="text/ecmascript-6">
  import http from '../../assets/js/http.js';
  import date from '../../assets/js/date'
  //转移到电影库中
  import addreview from './addreview.vue'
  import editreview from './editreview.vue'

  export default {
    data() {
      return {
        movie_id: 0,
        movie_name: '',
        type: '',
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
      }
    },
    components: {addreview,editreview},
    created() {
      this.getData();
    },
    methods: {
      getData() {
        let data = {
          params: {
            page: this.page,
            rows: this.rows,
            ages: this.ages
          }
        }
        this.apiGet('moviereview', data).then((data) => {
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
      add() {
        this.$refs.addreview.modal = true
      },
      edit(params) {
        this.$refs.editreview.getreview(params.row.id);
        this.$refs.editreview.modal = true
      }
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
                      src: params.row.thumbnail,
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
          key: 'title',
          sortable: true,
        });
        columns.push({
          title: '电影名',
          key: 'movie_name',
          sortable: true,
        });
        columns.push({
          title: '影评类型',
          key: 'type',
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
          }
        });
        columns.push({
          title: '创建时间',
          key: 'create_time',
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
                      _this.edit(params)
                    }
                  }
                }, '修改')
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
