<template>
  <div>
    <Card shadow title="设计案例">
      <i-button type="primary" @click="showAdd" style="margin-bottom:10px">添加</i-button>
      <tables ref="tables" editable v-model="tableData.list" :columns="columns" @on-delete="handleDelete" v-if="tableData.list&&tableData.list.length>0" />
      <Page :total="tableData.total" :page-size="listparams.pageSize" show-total class="paging" @on-change="changepage" style="margin-top:20px"></Page>
    </Card>
    <Modal v-model="modal1" title="添加/修改" @on-ok="ok" @on-cancel="cancel" :loading="loading" width="700" :styles="{'margin-bottom': '30px'}">
      <div class="textinput">
        <i-input v-model="params.title" placeholder="请输入..." style="width: 430px;">
          <span slot="prepend">标题<span class="xing">*</span>：</span>
        </i-input>
      </div>
      <div class="textinput">
        <span slot="prepend">展示图片：</span>
        <uploadImg ref="newsImg" :maxlength="1" :defaultList="newsImg" v-if="modal1" />
      </div>
      <div class="textinput">
        <span slot="prepend">内容描述：</span>
        <editor class="textinput" ref="editor" v-model="params.newsContent" @on-change="handleChange" />
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { addNews, deleteNews, modifyNews, contentList, contentId } from '@/api/news'
import uploadImg from '../goods/upload.vue'
import Editor from '_c/editor'
export default {
  name: 'tables_page',
  components: {
    Tables,
    uploadImg,
    Editor
  },
  data() {
    return {
      listparams: {
        pageNum: 1,
        pageSize: 30,
        newsType:3
      },
      params: {
        title:'',
        titleAttr:'',
        newsType:3,
        sort:1,
        newsContent:'',
      },
      newsImg:[],
      modal1: false,
      loading: true,
      modify: false,
      columns: [
        { title: '标题', key: 'title'},
        {          title: '缩略图', key: 'titleAttr', render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.titleAttr ? this.$showUrl + params.row.titleAttr : ''
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
          }        },
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
                      this.edit(params.row)
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
    modal1(val) {
      console.log(val)
    }
  },
  methods: {
    initParams() {
      this.params.title= ''
      this.params.titleAttr= ''
      this.params.newsContent= ''
      this.newsImg = []
      this.modify = false
    },
    showAdd() {
      this.modal1 = true
    },
    handleDelete(params) {
      deleteNews(params.row.id).then(res => {
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
    handleChange(html, text) {
      // this.params.newsContent = html
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
      if (this.$refs.newsImg.uploadList.length > 0) {
        this.newsImg = this.$refs.newsImg.uploadList
        this.params.titleAttr = this.$refs.newsImg.uploadList.map(x => x.url).join(';')
      }
      if (this.modify) {
        modifyNews(this.params).then(res => {
          if (res.data && res.data.success) {
            this.$Message.success('操作成功')
            this.initParams()
            this.params.pageNum = 1
            this.getList()
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.data.message,
              onOk: () => {
                this.showAdd()
              }
            })
          }
          this.modal1 = false
        })
      } else {
        addNews(this.params).then(res => {
          if (res.data && res.data.success) {
            this.$Message.success('操作成功')
            this.initParams()
            this.params.pageNum = 1
            this.getList()
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.data.message,
              onOk: () => {
                this.showAdd()
              }
            })
          }
          this.modal1 = false
        })
      }
    },
    edit(row){
      this.modify = true
      this.newsImg = row.titleAttr ? [{ url: row.titleAttr, name: row.titleAttr }] : []
      this.params = row
      this.showAdd()
    },
    cancel() {

    },
  },
  mounted() {
    this.getList()
    this.$refs.editor.setHtml(this.params.newsContent)
  }
}
</script>
