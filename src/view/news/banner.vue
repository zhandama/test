<template>
  <div>
    <Card shadow title="首页轮播图">
      <i-button type="primary" @click="showAdd">添加</i-button>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData.list" :columns="columns" @on-delete="handleDelete" v-if="tableData.list&&tableData.list.length>0" />
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
        newsType:1
      },
      params: {
        title:'',
        titleAttr:'',
        newsType:1,
        sort:1,
        newsContent:'',
        videoUrl:''
      },
      newsImg:[],
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
      this.params.title= ''
      this.params.titleAttr= ''
      this.params.newsContent= ''
      this.params.videoUrl=''
      this.newsImg = []
      this.modify = false
    },
    showAdd() {
      this.modal1 = true
    },
    handleDelete(params) {

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
        goodsModify(this.addparams).then(res => {
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
    cancel() {

    },
  },
  mounted() {
    this.getList()
    this.$refs.editor.setHtml(this.params.newsContent)
  }
}
</script>
