<template>
  <div>
    <Card shadow title="用户列表">
      <i-button type="primary" @click="showAddUser">添加用户</i-button>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData.list" :columns="columns" @on-delete="handleDelete" v-if="tableData.list&&tableData.list.length>0"/>
      <Page :total="tableData.total" :page-size="listparams.pageSize" show-total class="paging" @on-change="changepage" style="margin-top:20px"></Page>
    </Card>
    <Modal v-model="modal1" title="添加/修改" @on-ok="ok" @on-cancel="cancel" :loading="loading">
      <div class="textinput">
        <i-input v-model="params.loginAccount" placeholder="请输入..." style="width: 300px" :disabled="modify">
          <span slot="prepend">用户名<span class="xing">*</span>：</span>
        </i-input>
      </div>
      <div class="textinput">
        <i-input v-model="params.realName" placeholder="请输入..." style="width: 300px">
          <span slot="prepend">姓名<span class="xing">*</span>：</span>
        </i-input>
      </div>
      <div class="textinput">
        性别：
        <RadioGroup v-model="params.sexName">
          <Radio label="男"></Radio>
          <Radio label="女"></Radio>
        </RadioGroup>
      </div>
      <div class="textinput">
        <i-input v-model="params.nickName" placeholder="请输入..." style="width: 300px">
          <span slot="prepend">昵称<span class="xing">*</span>：</span>
        </i-input>
      </div>
      <div class="textinput">
        <div class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type ivu-input-group ivu-input-group-default ivu-input-group-with-prepend" style="width: 300px;">
          <div class="ivu-input-group-prepend" style=""><span>年龄：</span></div>
          <div class="ivu-input-inner-container">
            <i class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
            <Input-number :max="100" :min="1" v-model="params.age"></Input-number>
          </div>
        </div>
      </div>
      <div class="textinput">
        <i-input v-model="params.phone" placeholder="请输入..." style="width: 300px">
          <span slot="prepend">手机：</span>
        </i-input>
      </div>
      <div class="textinput">
        <i-input v-model="params.qq" placeholder="请输入..." style="width: 300px">
          <span slot="prepend">QQ号：</span>
        </i-input>
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getTableData, deleteUserForSystem, addUser, modifyUserForSystem } from '@/api/user'
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
      tableData: []
    }
  },
  watch: {
    modal1 (val) {
      console.log(val)
    }
  },
  methods: {
    initParams () {
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
    showAddUser () {
      this.modal1 = true
    },
    handleDelete (params) {
      deleteUserForSystem(params.row.id).then(res => {
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
      getTableData(this.listparams).then(res => {
        this.tableData = res.data.result
        this.tableData.list.map(x => {
          if (x.sex) {
            x.sexName = '男'
          } else {
            x.sexName = '女'
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
    ok () {
      var vm = this
      if (!this.verifyParams()) {
        this.modal1 = false
        return
      }
      if (this.params.sexName == '男') {
        this.params.sex = true
      } else {
        this.params.sex = false
      }
      if (this.modify) {
        modifyUserForSystem(this.params).then(res => {
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
                vm.showAddUser()
              }
            })
          }
          this.modal1 = false
        })
      } else {
        addUser(this.params).then(res => {
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
                vm.showAddUser()
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
      this.showAddUser()
      this.params.loginAccount = item.loginAccount
      this.params.realName = item.realName
      this.params.age = item.age
      this.params.id = item.id
      this.params.nickName = item.nickName
      this.params.qq = item.qq
      this.params.sex = item.sex
      this.params.sexName = item.sexName
      this.params.userType = item.userType
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
