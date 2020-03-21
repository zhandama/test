<template>
  <div>
    <Card shadow title="收获地址列表">
      <tables ref="tables" editable searchable search-place="top" v-model="tableData.list" :columns="columns" @on-delete="handleDelete" v-if="tableData.list&&tableData.list.length>0"/>
      <Page :total="tableData.total" :page-size="listparams.pageSize" show-total class="paging" @on-change="changepage" style="margin-top:20px"></Page>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { addressInfoList } from '@/api/frontuser'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      listparams: {
        pageNum: 1,
        pageSize: 30
      },
      params: {
        loginAccount: '',
        realName: '',
        nickName: '',
        sexName: '男',
        age: 1,
        phone: '',
        qq: '',
        userType: 1
      },
      modal1: false,
      loading: true,
      modify: false,
      columns: [
        { title: 'id', key: 'id'},
        { title: '订单号', key: 'orderId' },
        { title: '类型', key: 'isAddName', maxWidth:80}, //isAdd 加：true，减false
        { title: '积分', key: 'score', maxWidth:80},
        { title: '来源', key: 'scoreTypeName', maxWidth:100}, //scoreType 1自己下单获取的积分，2别人下单获取的积分
        { title: '状态', key: 'scoreStateName', maxWidth:100}, //scoreState：1：可用，2：已用完，3已失效
        { title: '时间', key: 'createTime' },
        // {
        //   title: '操作',
        //   key: 'handle',
        //   // options: ['delete'],
        //   button: [
        //     (h, params, vm) => {
        //       return h('div', [
        //         h('Button', {
        //           props: {
        //             type: 'primary',
        //             size: 'small'
        //           },
        //           style: {
        //             marginRight: '5px'
        //           },
        //           on: {
        //             click: () => {
        //               this.userEdit(params.row)
        //             }
        //           }
        //         }, '修改'),
        //         // 弹窗层-包含按钮
        //         h('Poptip', {
        //           props: {
        //             // 这个参数很重要，影响到是否被遮挡的问题
        //             transfer: true,
        //             // placement: 'bottom',
        //             confirm: true,
        //             title: '你确定要删除吗?'
        //           },
        //           on: {
        //             'on-ok': () => {
        //               this.handleDelete(params)
        //               vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        //             }
        //           }
        //         }, [
        //           h('Button', {
        //             props: {
        //               type: 'error',
        //               size: 'small'
        //             }
        //           }, '删除')
        //         ])
        //       ])
        //     }
        //   ]
        // }
      ],
      tableData: []
    }
  },
  methods: {
    handleDelete (params) {
    },
    changepage (page) {
      this.listparams.pageNum = page
      this.getList()
    },
    getList () {
      addressInfoList(this.listparams).then(res => {
        this.tableData = res.data.result
        this.tableData.list.map(x => {
          
        })
      })
    },
  },
  mounted () {
    this.getList()
  }
}
</script>

<style>
.xing{color:red;padding:0 2px}
</style>