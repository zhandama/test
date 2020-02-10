<template>
  <div>
    <Card shadow title="用户列表">
      <tables ref="tables" editable searchable search-place="top" v-model="tableData.list" :columns="columns" @on-delete="handleDelete" v-if="tableData.list&&tableData.list.length>0" />
      <Page :total="tableData.total" :page-size="params.pageSize" show-total class="paging" @on-change="changepage" style="margin-top:20px"></Page>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getGoodsList, goodsOnline } from '@/api/goods'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      params: {
        pageNum: 1,
        pageSize: 30
      },
      columns: [
        { title: '商品ID', key: 'goodsId', sortable: true },
        { title: '商品标题', key: 'title' },
        { title: '价格', key: 'initPrice' },
        { title: '状态', key: 'stateName' },
        { title: '时间', key: 'createTime' },
        {
          title: '操作',
          key: 'handle',
          // options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      // this.userEdit(params.row)
                      console.log('修改')
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.setGoodsOnline(params.row)
                    }
                  }
                }, params.row.state == 1 ? '下架' : '上架'),
                // 弹窗层-包含按钮
                h('Poptip', {
                  props: {
                    // 这个参数很重要，影响到是否被遮挡的问题
                    transfer: true,
                    // placement: 'bottom',
                    confirm: true,
                    title: '你确定要删除吗?'
                  },
                  on: {
                    'on-ok': () => {
                      this.handleDelete(params)
                      vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                    }
                  }
                }, [
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    }
                  }, '删除')
                ])
              ])
            }
          ]
        }
      ],
      tableData: []
    }
  },
  methods: {
    handleDelete (params) {
      console.log({ id: params.row.id })
      deleteUserForSystem({ id: params.row.id }).then(res => {
        if (res.data && res.data.success) {
          this.$Message.success('删除成功')
        } else {
          this.$Modal.error({ title: '提示', content: res.data.message })
          setTimeout(() => {
            this.$Modal.remove()
          }, 2000)
        }
      }, err => {
        this.$Message.error('操作失败')
      })
    },
    changepage (page) {
      this.params.pageNum = page
      this.getList()
    },
    setGoodsOnline (data) {
      let params = {
        id: data.id,
        online: data.state != 1
      }
      goodsOnline(params).then(res => {
        console.log(res)
        if (res.data.success) {
          this.$Message.success('操作成功')
          this.getList()
        } else {
          this.$Message.error('操作失败')
        }
      })
    },
    getList () {
      getGoodsList(this.params).then(res => {
        this.tableData = res.data.result
        this.tableData.list.map(x => {
          if (x.state == 1) {
            x.stateName = '上架中'
          } else {
            x.stateName = '已下架'
          }
        })
      })
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style>
</style>
