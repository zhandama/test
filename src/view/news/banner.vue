<template>
  <div>
    <Card shadow title="首页轮播图">
      <tables ref="tables" editable searchable search-place="top" v-model="tableData.list" :columns="columns" @on-delete="handleDelete" v-if="tableData.list&&tableData.list.length>0" />
      <Page :total="tableData.total" :page-size="listparams.pageSize" show-total class="paging" @on-change="changepage" style="margin-top:20px"></Page>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { addNews, deleteNews, modifyNews, contentList, contentId } from '@/api/news'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data() {
    return {
      listparams: {
        pageNum: 1,
        pageSize: 30,
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
        { title: '帐号', key: 'loginAccount', sortable: true },
        { title: '姓名', key: 'realName' },
        { title: '性别', key: 'sexName' },
        { title: '昵称', key: 'nickName' },
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
                      this.userEdit(params.row)
                    }
                  }
                }, '发货')
              ])
            }
          ]
        } 
      ],
      tableData: []
    }
  },
  watch: {
    modal1(val) {
      console.log(val)
    }
  },
  methods: {
    initParams() {
      this.params = {
        loginAccount: '',
        realName: '',
        nickName: '',
        sexName: '男',
        age: 1,
        phone: '',
        qq: '',
        userType: 1
      }
      this.modify = false
    },
    showAddUser() {
      this.modal1 = true
    },
    handleDelete(params) {

    },
    changepage(page) {
      this.listparams.pageNum = page
      this.getList()
    },
    getList() {
      contentList(this.listparams).then(res => {
        this.tableData = res.data.result
      })
    },
    ok() {

    },
    cancel() {

    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>
