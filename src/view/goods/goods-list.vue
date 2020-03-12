<template>
  <div>
    <Card shadow title="商品列表">
      <i-button type="primary" @click="modal1 = true">添加商品</i-button>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData.list" :columns="columns" @on-row-dblclick="handleRowClick" @on-delete="handleDelete" v-if="tableData.list&&tableData.list.length>0" />
      <Page :total="tableData.total" :page-size="params.pageSize" show-total class="paging" @on-change="changepage" style="margin-top:20px"></Page>
    </Card>
    <Modal v-model="modal1" title="添加/修改" @on-ok="ok" @on-cancel="addcancel" :loading="loading" width="700">
      <div class="textinput">
        <i-input v-model="addparams.title" placeholder="请输入..." style="width: 400px">
          <span slot="prepend">商品名称<span class="xing">*</span>：</span>
        </i-input>
      </div>
      <div class="textinput">
        <i-input v-model="addparams.initPrice" placeholder="请输入..." style="width: 200px">
          <span slot="prepend">原价￥<span class="xing">*</span>：</span>
        </i-input>
      </div>
      <div class="textinput">
        <i-input v-model="addparams.vipPrice" placeholder="请输入..." style="width: 200px">
          <span slot="prepend">会员价￥<span class="xing">*</span>：</span>
        </i-input>
      </div>
      <div class="textinput">
        <div class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type ivu-input-group ivu-input-group-default ivu-input-group-with-prepend" style="width: 300px;">
          <div class="ivu-input-group-prepend" style=""><span>商品类别<span class="xing">*</span>：</span></div>
          <div class="ivu-input-inner-container">
            <i class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
            <Cascader :data="this.category.data" @on-change="categoryChange"></Cascader>
          </div>
        </div>
      </div>
      <div class="textinput" for="">
        <i-input v-model="addparams.phone" placeholder="请输入..." style="width: 300px">
          <span slot="prepend">动态属性：</span>
        </i-input>
      </div>
      <div class="textinput">
        <span slot="prepend">商品描述：</span>
        <editor class="textinput" ref="editor" :value="addparams.description" @on-change="handleChange" />
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { goodsAdd, goodsDelete, getGoodsList, goodsOnline, propertyInfoList, categoryList } from '@/api/goods'
import Editor from '_c/editor'
export default {
  name: 'tables_page',
  components: {
    Tables,
    Editor
  },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 30
      },
      addparams: {
        description: 'string',
        goodsAttr: 'string',
        goodsImg: 'string',
        goodsPropertyList: [],
        initPrice: 0,
        rootCategoryId: 0,
        subCategoryId: 0,
        title: 'string',
        vipPrice: 0
      },
      modal1: false,
      loading: true,
      modify: false,
      property: [],
      category: [],
      columns: [
        { title: '商品ID', key: 'goodsId', sortable: true },
        { title: '商品标题', key: 'title' },
        { title: '价格', key: 'initPrice' },
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
                      // this.userEdit(params.row)
                      console.log('修改')
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.setGoodsOnline(params.row)
                    }
                  }
                }, params.row.state == 1 ? '下架' : '上架'),
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
  methods: {
    categoryChange(e) {
      this.category.value = e
    },
    handleDelete(params) {
      goodsDelete({ id: params.row.id }).then(res => {
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
    changepage(page) {
      this.params.pageNum = page
      this.getList()
    },
    setGoodsOnline(data) {
      let params = {
        id: data.id,
        online: data.state != 1
      }
      goodsOnline(params).then(res => {
        if (res.data.success) {
          this.$Message.success('操作成功')
          this.getList()
        } else {
          this.$Message.error('操作失败')
        }
      })
    },
    getList() {
      getGoodsList(this.params).then(res => {
        this.tableData = res.data.result
        this.tableData.list.map(x => {
          if (x.state == 1) {
            x.stateName = '上架中'
          } else {
            x.stateName = '已下架'
          }
        })
      })
    },
    handleRowClick(row) {
      console.log(row)
    },
    changeContent() {
      this.$refs.editor.setHtml('<p>powered by wangeditor</p>')
    },
    handleChange(html, text) {
      console.log(html, text)
    },
    verifyParams() {
      // addparams: {
      //   description: 'string',
      //   goodsAttr: 'string',
      //   goodsImg: 'string',
      //   goodsPropertyList: [],
      //   initPrice: 0,
      //   rootCategoryId: 0,
      //   subCategoryId: 0,
      //   title: 'string',
      //   vipPrice: 0
      // }
      for (var key in this.addparams) {
        if (this.addparams.title.length < 1) {
          this.$Modal.error({
            title: '提示',
            content: '请输入商品名称',
          })
          return false
        } else if (this.params.initPrice.length < 1) {
          this.$Modal.error({
            title: '提示',
            content: '请输入价格',
          })
          return false
        }
      }
      return true
    },
    getCategory() {
      categoryList({ pageNum: 1, pageSize: 20 }).then(res => {
        this.category = res.data.result
        if (this.category && this.category.list.length > 0) {
          this.category.data = this.category.list.map(x => {
            var obj = {
              value: x.id,
              label: x.name
            }
            return obj
          })
        }
      })
    },
    getPropertyInfo() {
      propertyInfoList({ pageNum: 1, pageSize: 20 }).then(res => {
        if (res.data && res.data.success) {

        }
        this.property = res.data.result
        if (this.property && this.property.list.length > 0) {
          this.property.data = this.property.list.map(x => {
            var obj = {
              value: x.id,
              label: x.name
            }
            return obj
          })
        }
      })
    },
    ok() {
      var vm = this
      if (!this.verifyParams()) {
        this.modal1 = false
        return
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
            })
          }
          this.modal1 = false
        })
      } else {
        goodsAdd(this.params).then(res => {
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
        })
      }
    },
    addcancel() {
      // debugger
    },
    cancel() {
      this.initParams()
    },
  },
  mounted() {
    this.getList()
    this.getPropertyInfo()
    this.getCategory()
  }
}
</script>

<style>
.ivu-input-group .ivu-input,
.ivu-input-group .ivu-input-inner-container {
  z-index: auto;
}
</style>
