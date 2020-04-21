<template>
  <div>
    <Card shadow title="家具分类">
      <i-button type="primary" @click="showAdd" style="margin-bottom:10px">添加分类</i-button>
      <tables ref="tables" v-model="list.list" :columns="columns" :draggable="true" @on-drag-drop="onDragDrop" @on-delete="handleDelete" v-if="list.list&&list.list.length>0"/>
      <Page :total="list.total" :page-size="listparams.pageSize" show-total class="paging" @on-change="changepage" style="margin-top:20px"></Page>
    </Card>
    <Modal v-model="modal1" title="添加/修改" @on-ok="ok" @on-cancel="cancel" :loading="loading">
      <div class="textinput">
        <i-input v-model="params.name" placeholder="请输入..." style="width: 300px;float:left">
          <span slot="prepend">分类名称<span class="xing">*</span>：</span>
        </i-input>
        <span style="line-height:30px;float:left;padding-left:7px;color:#aaa">(尽量四个字以内)</span>
        <div style="clear:both"></div>
      </div>
      <div class="textinput">
        <i-input v-model="params.sort" placeholder="输入排序..." style="width: 300px">
          <span slot="prepend">排序：</span>
        </i-input>
      </div>
      <div class="textinput">
        <i-input v-model="params.remark" placeholder="分类备注..." style="width: 300px">
          <span slot="prepend">别名：</span>
        </i-input>
      </div>
      <div class="textinput" v-if="params.parentId=='-1'">
        <span slot="prepend">首页分类展示图片：</span>
        <uploadImg ref="imageUrl" :maxlength="3" :defaultList="imageUrl" v-if="modal1" />
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { categoryList, addCategory, enableCategory, deleteCategory ,modifyCategory} from '@/api/goods'
import uploadImg from './upload.vue'
export default {
  name: 'tables_page',
  components: {
    Tables,
    uploadImg
  },
  data () {
    return {
      listparams: {
        pageNum: 1,
        pageSize: 30
      },
      params: {
        name: '',
        sort:0,
        parentId: -1,
        remark:'',
        imageUrl:'',
        categoryType:0
      },
      imageUrl:[],
      modal1: false,
      loading: true,
      modify: false,
      columns: [
        { title: 'Id', key: 'id'},
        { title: '分类名称', key: 'name' },
        { title: '备注', key: 'remark' },
        { title: '排序', key: 'sort',sortable: true,},
        { title: '状态', key: 'enableName' },
        { title: '时间', key: 'createTime' },
        {
          title: '操作',
          key: 'handle',
          width: 230,
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
                      this.Edit(params.row)
                      console.log('修改')
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
  methods: {
    initParams () {
      this.params = {
        name: '',
        parentId: -1,
        remark:'',
        imageUrl:'',
        sort:0
      }
      this.imageUrl = []
      this.modify = false
    },
    onDragDrop(a,b){
        console.log(a,b);
        // this.sort()
        // this.list.splice(b,1,...this.list.splice(a, 1 , this.list[b]));
    },
    showAdd () {
      this.modal1 = true
    },
    // sort(){
    //   modifyCategory(this.params).then(res => {
    //     console.log(res)
    //   })
    // },
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
      if (this.$refs.imageUrl.uploadList.length > 0) {
        this.imageUrl = this.$refs.imageUrl.uploadList
        this.params.imageUrl = this.$refs.imageUrl.uploadList.map(x => x.url).join(';')
      }
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
      if (this.modify) {
        modifyCategory(this.params).then(res => {
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
      } else {
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
      }
      
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
    Edit(row){
      this.modify = true
      this.imageUrl = row.imageUrl ? row.imageUrl.split(';').map(x => { var a = { url: x, name: x }; return a }) : []
      this.params = JSON.parse(JSON.stringify(row))
      this.params.categoryType = 0
      this.showAdd()
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
