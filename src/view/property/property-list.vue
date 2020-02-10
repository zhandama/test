<template>
  <div>
    <Card shadow title="商品属性">
      <i-button type="primary" @click="showAdd" style="margin-bottom:10px">添加属性</i-button>
      <tables ref="tables" v-model="list.list" :columns="columns" @on-delete="handleDelete" v-if="list.list&&list.list.length>0"/>
      <Page :total="list.total" :page-size="listparams.pageSize" show-total class="paging" @on-change="changepage" style="margin-top:20px"></Page>
    </Card>
    <Modal v-model="modal1" title="添加/修改" @on-ok="ok" @on-cancel="cancel" :loading="loading">
      <div class="textinput">
        <i-input v-model="params.name" placeholder="请输入..." style="width: 300px" :disabled="modify">
          <span slot="prepend">属性名称<span class="xing">*</span>：</span>
        </i-input>
      </div>
      <div class="textinput">
        属性类型：
        <RadioGroup v-model="propertyTypeName">
          <Radio label="文本框"></Radio>
          <Radio label="下拉框"></Radio>
          <Radio label="单选框"></Radio>
          <Radio label="多选框"></Radio>
        </RadioGroup>
      </div>
      <div class="textinput">
        <i-input v-model="params.defalutValue" placeholder="请输入..." style="width: 300px">
          <span slot="prepend">默认值：</span>
        </i-input>
        <p style="padding:10px 0;color:#999">默认值如果是多个值用英文的分号（<span style="color:red">;</span>）隔开</p>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { propertyInfoList, addProperty, modifyProperty, deleteProperty } from '@/api/goods'
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
      propertyTypeName: '文本框',
      params: {
        defalutValue: '',
        name: '',
        propertyType: 0
      },
      modal1: false,
      loading: true,
      modify: false,
      columns: [
        { title: 'Id', key: 'id', sortable: true },
        { title: '属性名', key: 'name' },
        { title: '默认值', key: 'defalutValue' },
        { title: '类型', key: 'propertyType' },
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
                }, '修改'),
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
  // watch:{
  //   modal1(val) {
  //     console.log(val)
  //   }
  // },
  methods: {
    initParams () {
      this.params = {
        defalutValue: '',
        name: '',
        propertyType: 0
      }
      this.modify = false
    },
    showAdd () {
      this.modal1 = true
    },
    handleDelete (params) {
      deleteProperty(params.row.id).then(res => {
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
      propertyInfoList(this.listparams).then(res => {
        this.list = res.data.result
      })
    },
    verifyParams () {
      for (var key in this.params) {
        if (this.params.name.length < 1) {
          this.$Modal.error({
            title: '提示',
            content: '输入属性名称',
            onOk: () => {
              this.showAdd()
            }
          })
          return false
        }
      }
      return true
    },
    ok () {
      var vm = this
      if (!this.verifyParams()) {
        this.modal1 = false
        return
      }
      if (this.propertyTypeName == '文本框') {
        this.params.propertyType = 1
      } else if (this.propertyTypeName == '下拉框') {
        this.params.propertyType = 2
      } else if (this.propertyTypeName == '单选框') {
        this.params.propertyType = 3
      } else if (this.propertyTypeName == '多选框') {
        this.params.propertyType = 4
      }
      if (this.modify) {
        modifyProperty(this.params).then(res => {
          if (res.data && res.data.success) {
            this.$Message.success('操作成功')
            this.initParams()
            this.listparams.pageNum = 1
            this.getList()
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.data.message,
              onOk: () => {
                vm.showAdd()
              }
            })
          }
          this.modal1 = false
        })
      } else {
        addProperty(this.params).then(res => {
          if (res.data && res.data.success) {
            this.$Message.success('操作成功')
            this.initParams()
            this.listparams.pageNum = 1
            this.getList()
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.data.message,
              onOk: () => {
                vm.showAdd()
              }
            })
          }
          this.modal1 = false
        })
      }
    },
    cancel () {
      this.initParams()
    },
    userEdit (item) { // 修改用户
      console.log(item)
      this.modify = true
      this.showAdd()
      this.params.defalutValue = item.defalutValue
      this.params.propertyType = item.propertyType
      this.params.name = item.name
      this.propertyTypeName = item.age
      if (item.propertyType == 1) {
        this.propertyTypeName = '文本框'
      } else if (item.propertyType == 2) {
        this.propertyTypeName = '下拉框'
      } else if (item.propertyType == 3) {
        this.propertyTypeName = '单选框'
      } else if (item.propertyType == 4) {
        this.propertyTypeName = '多选框'
      }
      this.params.id = item.id
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style>
.xing{color:red;padding:0 2px}
</style>
