<template>
  <div>
    <Card shadow title="家具分类">
      <i-button type="primary" @click="showAdd" style="margin-bottom:10px">添加一级分类</i-button>
      <tables ref="tables" v-model="list.list" :columns="columns" @on-delete="handleDelete" v-if="list.list&&list.list.length>0"/>
      <Page :total="list.total" :page-size="listparams.pageSize" show-total class="paging" @on-change="changepage" style="margin-top:20px"></Page>
    </Card>
    <Modal v-model="modal1" title="添加/修改" @on-ok="ok" @on-cancel="cancel" :loading="loading">
      <div class="textinput">
        <i-input v-model="params.name" placeholder="请输入..." style="width: 300px" :disabled="modify">
          <span slot="prepend">分类名称<span class="xing">*</span>：</span>
        </i-input>
      </div>
      <div class="textinput">
        <i-input v-model="params.remark" placeholder="分类备注..." style="width: 300px">
          <span slot="prepend">备注：</span>
        </i-input>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { categoryList, addCategory, enableCategory, deleteCategory } from '@/api/goods'
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
        name: '',
        parentId: 7,
        remark:''
      },
      modal1: false,
      loading: true,
      modify: false,
      columns: [
        { title: 'Id', key: 'id', sortable: true },
        { title: '分类名称', key: 'name' },
        { title: '备注', key: 'remark' },
        { title: '状态', key: 'enableName' },
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
                    type: params.row.enable?'warning':'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.enable(params.row)
                    }
                  }
                }, params.row.enable ? '禁用' : '启用'),
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
      list: []
    }
  },
  methods: {
    initParams () {
      this.params = {
        name: '',
        parentId: 0,
        remark:''
      }
      this.modify = false
    },
    showAdd () {
      this.modal1 = true
    },
    handleDelete (params) {
      deleteCategory(params.row.id).then(res => {
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
      this.listparams.pageNum = page
      this.getList()
    },
    getList () {
      categoryList(this.listparams).then(res => {
        this.list = res.data.result
        this.list.list.map(x=>{
          if (x.enable) {
            x.enableName="启用中"
          } else {
            x.enableName="禁用中"
          }
        })
      })
    },
    ok () {
      var vm = this
      if (this.params.name.length<1) {
        this.modal1 = false
        this.$Modal.error({
            title: '提示',
            content: '请输入名称',
            onOk: () => {
              this.modal1 = true
            }
          })
        return
      }
      addCategory(this.params).then(res => {
        if (res.data && res.data.success) {
          this.$Message.success('操作成功')
          this.initParams()
          this.listparams.pageNum = 1
          this.getList()
        } else {
          this.$Modal.error({
            title: '提示',
            content: res.data.message,
          })
        }
        this.modal1 = false

      }, err => {
        this.modal1 = false
        this.$Message.error(err.response.data.message)
      })
    },
    enable(row) {
      enableCategory({id:row.id,enable:!row.enable}).then(res => {
        if (res.data.success) {
          this.$Message.success('操作成功')
          this.getList()
        } else {
          this.$Message.error('操作失败')
        }
      })
    },
    cancel () {
      this.initParams()
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
