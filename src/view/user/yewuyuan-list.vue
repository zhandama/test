<template>
  <div>
    <Card shadow title="业务员审核">
      <tables ref="tables" v-model="tableData.list" :columns="columns" @on-delete="handleDelete" v-if="tableData.list&&tableData.list.length>0"/>
      <Page :total="tableData.total" :page-size="listparams.pageSize" show-total class="paging" @on-change="changepage" style="margin-top:20px"></Page>
    </Card>
    <Modal v-model="modal1" title="审核" @on-ok="ok" @on-cancel="cancel" :loading="loading" okText="审核通过" cancelText="审核不通过">
      <div v-if="row.images">
        <div class="">上传的图片：<br/></div>
          <div class="demo-upload-list" v-for="(url,index) in row.images" :key="index">
            <img :src="$showUrl2+url" >
            <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" size='30' @click.native="handleView($showUrl2+url)"></Icon>
            </div>
          </div>
      </div>
    </Modal>
    <Modal title="查看大图" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { buyerInfoList, buyerInfoAudit } from '@/api/user'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      listparams: {
        pageNum: 1,
        pageSize: 30,
        state:this.$route.name=='design'?3:2
      },
      row: {},
      modal1: false,
      loading: true,
      visible: false,
      columns: [
        { title: '微信昵称', key: 'nickName' },
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
                }, '审核'),
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
    handleView(url) {
      this.imgName = url;
      this.visible = true;
    },
    initParams () {
      this.row = {}
    },
    showAddUser () {
      this.modal1 = true
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
    ok () {
      this.buyerInfoAudit(4)
    },
    cancel () {
      this.buyerInfoAudit(5)
    },
    buyerInfoAudit(auditState) {
      var vm = this
      let params = {
        auditState:auditState,
        id:this.row.id
      }
      buyerInfoAudit(params).then(res => {
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
      },error=>{
        this.$Message.error('操作失败')
        this.modal1 = false
      })
    },
    userEdit (item) { // 审核
      this.row = item
      this.row.images = item.fileUrl.split(';')
      this.showAddUser()
    }
  },
  mounted () {
    this.getList()
  }
}
</script>
<style>
.demo-upload-list {
  display: inline-block;
  width: 82px;
  height: 82px;
  text-align: center;
  line-height: 82px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
