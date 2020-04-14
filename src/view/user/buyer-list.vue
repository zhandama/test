<template>
  <div>
    <Card shadow title="小程序用户列表">
      <!-- <i-button type="primary" @click="modal3=true;addOrderId=''">添加积分</i-button> -->
      <!-- <i-button type="primary" @click="showAddUser">添加用户</i-button> -->
      <tables ref="tables" editable searchable search-place="top" v-model="tableData.list" :columns="columns" @on-row-dblclick="handleRowClick" @on-delete="handleDelete" v-if="tableData.list&&tableData.list.length>0"/>
      <Page :total="tableData.total" :page-size="listparams.pageSize" show-total class="paging" @on-change="changepage" style="margin-top:20px"></Page>
    </Card>

    <Modal v-model="modal1" title="添加积分" @on-ok="addscore" :loading="loading" width="400" :styles="{'margin-bottom': '30px'}">
      <div>
        <i-input v-model="row.nickName" style="width: 230px;margin-bottom:10px;float:left" readonly>
          <span slot="prepend">微信昵称：</span>
        </i-input>
        <div style="float:left;">
          <div style="float:left;line-height:30px;padding-left:20px">头像：</div><img :src="row.avatarUrl" width='30px' />
        </div>
      </div>
      <i-input v-model="row.id" placeholder="请输入..." style="width: 330px;margin-top:20px">
        <span slot="prepend">ID:</span>
      </i-input>
      <i-input v-model="scoreParams.score" placeholder="请输入..." style="width: 330px;margin-top:20px">
        <span slot="prepend">积分：<span class="xing">*</span>：</span>
      </i-input>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { buyerInfoList,addScore } from '@/api/user'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      listparams: {
        pageNum: 1,
        pageSize: 50
      },
      row:'',
      scoreParams:{
        id:'',
        score:''
      },
      modal1: false,
      loading: true,
      modify: false,
      columns: [
        { title: 'Id', key: 'id', },
        { title: '微信昵称', key: 'nickName'},
        { title: '自己邀请码', key: 'popuCode' },
        { title: '邀请者', key: 'parentPopuCode' },
        { title: '头像', key: 'avatarUrl', render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.avatarUrl ? params.row.avatarUrl : ''
              },
              //使用style直接定义图片的样式
              style: {
                width: '50px',
                height: '50px',
                borderRadius: '5px',
                verticalAlign: 'middle',
                margin: '5px'
              }
            })
          }
        },
        { title: '积分', key: 'score' },
        { title: '角色', key: 'userTypeName' },
        { title: '状态', key: 'stateName' },
        { title: '时间', key: 'createTime' },
        
      ],
      tableData: []
    }
  },
  methods: {
    initParams () {
    },
    handleRowClick(row){
      this.row = JSON.parse(JSON.stringify(row))
      this.scoreParams.score = ''
      this.scoreParams.id = this.row.id
      this.modal1 = true
    },
    addscore(){
      this.modal1 = false
      if (this.scoreParams.score==''||this.scoreParams.score<=0) {
        this.$Modal.error({
          title: '提示',
          content: '请输入积分',
          onOk: () => {
            this.modal1=true
          }
        })
        return false
      } else if (this.scoreParams.score>1000) {
        this.$Modal.confirm({
            title: '提示',
            content: '确定要为用户'+this.row.nickName+'添加'+this.scoreParams.score+'积分？',
            onOk: () => {
                this.confirmaddScore()
            },
            onCancel: () => {
                
            }
        });
      } else {
        this.confirmaddScore()
      }
    },
    confirmaddScore(){
      addScore(this.scoreParams).then(res => {
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
              this.modal1=true
            }
          })
        }
        this.modal1 = false
      })
    },
    handleDelete (params) {
    },
    changepage (page) {
      this.listparams.pageNum = page
      this.getList()
    },
    getList () {
      buyerInfoList(this.listparams).then(res => {
        this.tableData = res.data.result
        this.tableData.list.map(x => {
          if (x.state==2) {
            x.stateName='业务员待审核'
          } else if(x.state==3){
            x.stateName='设计师待审核'
          } else if(x.state==5){
            x.stateName='审核未通过'
          } else {
            x.stateName='正常'
          }

          if (x.userType==2) {
            x.userTypeName = '业务员'
          }else if(x.userType==3){
            x.userTypeName = '设计师'
          } else {
            x.userTypeName = '普通用户'
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
