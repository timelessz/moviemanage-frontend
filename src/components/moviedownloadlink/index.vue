<template>
  <div>
    <div class="top">
      <Input v-model="movie_name" placeholder="请输入电影名" style="width:300px;"></Input>
      <Input v-model="ages" placeholder="请输入年代" style="width:50px;"></Input>
      类型:
      <Select v-model="region_id" style="width: 150px;" label-in-value filterable clearable>
        <Option v-for="item in moviedownloadtype" :value="item.id" :key="item.id">
          {{ item.text}}
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
    <add ref="add" :type="moviedownloadtype"></add>
    <edit ref="edit"></edit>
  </div>
</template>

<script type="text/ecmascript-6">
  import http from '../../assets/js/http.js';
  import date from '../../assets/js/date'
  //转移到电影库中
  import add from './add.vue'
  import edit from './edit.vue'

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
        moviedownloadtype: []
      }
    },
    components: {add, edit},
    created() {
      this.getData();
      this.getMovieType();
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
        this.apiGet('moviedownloadlink', data).then((data) => {
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
      getMovieType() {
        this.apiGet('moviedownloadtype').then((res) => {
          this.handelResponse(res, (data, msg) => {
            this.moviedownloadtype = data
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
      add() {
        this.$refs.add.modal = true
      },
      edit(params) {
        this.$refs.edit.getreview(params.row.id);
        this.$refs.edit.modal = true
      }
    },
    computed: {
      tableColumns() {
        let columns = []
        let _this = this
        if (this.showIndex) {
          columns.push({
            type: 'index',
            width: 60,
            align: 'center'
          })
        }
        columns.push({
          title: '下载标题',
          key: 'text',
          sortable: true,
        });
        columns.push({
          title: '下载链接',
          key: 'href',
          sortable: true,
        });
        columns.push({
          title: '类型',
          key: 'type_name',
          sortable: true,
        });
        columns.push({
          title: '创建时间',
          key: 'created_at',
          sortable: true,
          width: 180,
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
