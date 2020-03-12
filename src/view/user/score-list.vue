<template>
  <div>
    <Card shadow title="积分列表">
      <tables ref="tables" editable searchable search-place="top" v-model="tableData.list" :columns="columns" @on-delete="handleDelete" v-if="tableData.list&&tableData.list.length>0"/>
      <Page :total="tableData.total" :page-size="listparams.pageSize" show-total class="paging" @on-change="changepage" style="margin-top:20px"></Page>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { scoreList } from '@/api/user'
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
  watch: {
    modal1 (val) {
      console.log(val)
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
      scoreList(this.listparams).then(res => {
        this.tableData = res.data.result
        this.tableData.list.map(x => {
          if (x.scoreState==1) {
            x.scoreStateName = '可用'
          } else if (x.scoreState==2) {
            x.scoreStateName = '已用完'
          } else if (x.scoreState==3) {
            x.scoreStateName = '已失效'
          }
          if (x.scoreType==1) {
            x.scoreTypeName = '自己'
          } else if (x.scoreType==2) {
            x.scoreTypeName = '邀请者'
          }
          if (x.isAdd) {
            x.isAddName = '+'
          } else {
            x.isAddName = '-'
          }
        })
      })
    },
    verifyParams () {
      for (var key in this.params) {
        if (this.params.loginAccount.length < 1) {
          this.$Modal.error({
            title: '提示',
            content: '请输入用户名',
            onOk: () => {
              this.showAddUser()
            }
          })
          return false
        } else if (this.params.realName.length < 1) {
          this.$Modal.error({
            title: '提示',
            content: '请输入姓名',
            onOk: () => {
              this.showAddUser()
            }
          })
          return false
        } else if (this.params.nickName.length < 1) {
          this.$Modal.error({
            title: '提示',
            content: '请输入昵称',
            onOk: () => {
              this.showAddUser()
            }
          })
          return false
        }
      }
      return true
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
