<template>
  <div>
    <Card shadow title="商品列表">
      <i-button type="primary" @click="showAdd()">添加商品</i-button>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData.list" :columns="columns" @on-row-dblclick="handleRowClick" @on-delete="handleDelete" v-if="tableData.list&&tableData.list.length>0" />
      <Page :total="tableData.total" :page-size="params.pageSize" show-total class="paging" @on-change="changepage" style="margin-top:20px"></Page>
    </Card>
    <Modal v-model="modal1" title="添加/修改" @on-ok="ok" @on-cancel="addcancel" :loading="loading" width="700" :styles="{'margin-bottom': '30px'}">
      <div class="textinput">
        <i-input v-model="addparams.title" placeholder="请输入..." style="width: 430px;float:left;">
          <span slot="prepend">商品名称<span class="xing">*</span>：</span>
        </i-input>
        <Checkbox v-model="addparams.hot" style="float:left;padding-top:7px;padding-left:10px">热销</Checkbox>
        <div style="clear:both"></div>
      </div>
      <div class="textinput">
        <i-input v-model="addparams.initPrice" placeholder="请输入..." style="width: 200px;float:left">
          <span slot="prepend">原价￥<span class="xing">*</span>：</span>
        </i-input>
        <i-input v-model="addparams.vipPrice" placeholder="请输入..." style="width: 200px;float:left;margin-left:30px">
          <span slot="prepend">会员价￥<span class="xing">*</span>：</span>
        </i-input>
        <div style="clear:both"></div>
      </div>
      <div class="textinput">
        <div class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type ivu-input-group ivu-input-group-default ivu-input-group-with-prepend" style="width: 350px;">
          <div class="ivu-input-group-prepend"><span>商品类别<span class="xing">*</span>：</span></div>
          <div class="ivu-input-inner-container">
            <i class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
            <Cascader :data="category.data" @on-change="categoryChange" :value="category.value"></Cascader>
          </div>
        </div>
      </div>
      <!--goodsPropertyList start-->
      <div v-if="addparams.goodsPropertyList&&addparams.goodsPropertyList.length>0">
        <div class="textinput" v-for="item in addparams.goodsPropertyList" :key="item.id">
          <i-input v-model="item.value" placeholder="请输入..." style="width: 350px;float:left">
            <span slot="prepend">{{item.name}}：</span>
          </i-input>
          <!-- <div v-if="item.propertyType!=1" class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type ivu-input-group ivu-input-group-default ivu-input-group-with-prepend" >
            <div class="ivu-input-group-prepend"><span>{{item.name}}：</span></div>
            <div class="inpCheck">
              <Checkbox v-for="(itemName,itemindex) in item.data" :checked.sync="itemName.checked" @on-change="propertyChange(itemName,item)" :key="itemindex">{{itemName.name}}</Checkbox>
            </div>
          </div> -->
          <Checkbox v-if="item.propertyType!=1" v-model="item.userSelect" style="float:left;padding-top:7px;padding-left:10px">是否需要买家选择</Checkbox>
          <div v-if="item.propertyType!=1" style="line-height:30px;float:left;padding-left:7px;color:#aaa">(多属性英文分号隔开)</div>
          <div style="clear:both"></div>
        </div>
      </div>
      <!--goodsPropertyList end-->
      <div class="textinput">
        <span slot="prepend">商品列表图片1张：</span>
        <uploadImg ref="goodsAttr" :maxlength="1" :defaultList="goodsAttr" v-if="modal1" />
      </div>
      <div class="textinput">
        <span slot="prepend">商品轮播图：</span>
        <uploadImg ref="goodsImg" :defaultList="goodsImg" v-if="modal1" />
      </div>
      <div class="textinput">
        <span slot="prepend">商品描述：</span>
        <editor class="textinput" ref="editor" v-model="addparams.description" @on-change="handleChange" />
      </div>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { goodsAdd, goodsModify, selectByGoodsId, goodsDelete, getGoodsList, goodsOnline, propertyInfoList, categoryList } from '@/api/goods'
import Editor from '_c/editor'
import Icons from '_c/icons'
import uploadImg from './upload.vue'
export default {
  name: 'tables_page',
  components: {
    Tables,
    Editor,
    Icons,
    uploadImg
  },
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 30
      },
      addparams: {
        title: '',
        hot: false,
        initPrice: 0,
        vipPrice: 0,
        goodsAttr: '',
        goodsImg: '',
        goodsPropertyList: [],
        // rootCategoryId: 0,
        // subCategoryId: 0,
        description: '',
      },
      modal1: false,
      loading: true,
      modify: false,
      property: [],
      category: [],
      goodsAttr: [],
      goodsImg: [],
      columns: [
        { title: '商品ID', key: 'goodsId', sortable: true },
        { title: '商品标题', key: 'title' },
        { title: '价格', key: 'initPrice' },
        {          title: '缩略图', key: 'goodsAttr', render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.goodsAttr ? this.$showUrl + params.row.goodsAttr : ''
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
                      this.goodsEdit(params.row)
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
    categoryChange(value) {
      console.log(value)
      this.category.value = value
      console.log(value)
    },
    // propertyChange(itemName,item){  // 属性多选
    //   if (!item.value) {
    //     item.value = itemName.name
    //   } else {
    //     var tags = item.value.split(';')
    //     var p = []
    //     tags.map(x => {
    //       if (x != itemName.name) {
    //         p.push(x)
    //       }
    //     })
    //     if (!tags.find(x => x == itemName.name)) {
    //       p.push(itemName.name)
    //     }
    //     item.value = p.join(";")
    //   }
    // },
    showAdd() {
      this.addparams.goodsPropertyList = []
      this.initgoodsPropertyList()
      this.modal1 = true
      this.$refs.editor.setHtml(this.addparams.description)
    },
    handleDelete(params) {
      goodsDelete(params.row.id).then(res => {
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
      this.$refs.editor.setHtml('1')
    },
    handleChange(html, text) {
      this.addparams.description = html
      // console.log(html,'2222222', text)
    },
    verifyParams() {
      console.log(this.addparams)
      if (this.addparams.title.length < 1) {
        this.$Modal.error({
          title: '提示',
          content: '请输入商品名称',
          onOk: () => {
            this.showAdd()
          }
        })
        return false
      } else if (this.addparams.initPrice <= 0) {
        this.$Modal.error({
          title: '提示',
          content: '请输入价格',
          onOk: () => {
            this.showAdd()
          }
        })
        return false
      } else if (this.addparams.vipPrice <= 0) {
        this.$Modal.error({
          title: '提示',
          content: '请输入会员价格',
          onOk: () => {
            this.showAdd()
          }
        })
        return false
      } else if (!this.category.value) {
        this.$Modal.error({
          title: '提示',
          content: '请选择商品类型',
          onOk: () => {
            this.showAdd()
          }
        })
        return false
      }
      return true
    },
    getCategory() {
      categoryList({ pageNum: 1, pageSize: 20 }).then(res => {
        if (res.data && res.data.success) {
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
        }
      })
    },
    getPropertyInfo() {
      propertyInfoList({ pageNum: 1, pageSize: 20 }).then(res => {
        if (res.data && res.data.success) {
          this.property = res.data.result.list
          if (this.property && this.property.length > 0) {
            this.initgoodsPropertyList()
          }
        }
      })
    },
    verifyProperty() {
      // this.addparams.goodsPropertyList = []
      // this.property.map(x=>{
      //   var obj = {
      //   fieldName: x.fieldName,
      //   propertyValue: x.value,
      //   userSelect: x.userSelect
      // }
      //   this.addparams.goodsPropertyList.push(obj)
      // })
    },
    ok() {
      var vm = this
      if (this.$refs.goodsAttr.uploadList.length > 0) {
        this.goodsAttr = this.$refs.goodsAttr.uploadList
        this.addparams.goodsAttr = this.$refs.goodsAttr.uploadList.map(x => x.url).join(';')
      }
      if (this.$refs.goodsImg.uploadList.length > 0) {
        this.goodsImg = this.$refs.goodsImg.uploadList
        this.addparams.goodsImg = this.$refs.goodsImg.uploadList.map(x => x.url).join(';')
      }
      this.verifyProperty()
      if (!this.verifyParams()) {
        this.modal1 = false
        return
      }
      this.addparams.rootCategoryId = this.category.value[0]
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
        goodsAdd(this.addparams).then(res => {
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
    initgoodsPropertyList() {
      this.addparams.goodsPropertyList = this.copy(this.property)
      this.addparams.goodsPropertyList.map(x => {
        x.value = x.defalutValue
      })
    },
    copy(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    initParams() {
      this.addparams.title = ''
      this.addparams.hot = false
      this.addparams.initPrice = 0
      this.addparams.vipPrice = 0
      this.addparams.goodsAttr = ''
      this.addparams.goodsImg = ''
      this.addparams.description = ''
      this.goodsAttr = []
      this.goodsImg = []
      this.category.value = []
      this.modify = false
    },
    goodsEdit(row) {
      this.modify = true
      this.addparams.id = row.id
      this.addparams.title = row.title
      this.addparams.hot = row.hot
      this.addparams.initPrice = row.initPrice
      this.addparams.vipPrice = row.vipPrice
      this.addparams.description = row.description
      this.goodsAttr = row.goodsAttr ? [{ url: row.goodsAttr, name: row.goodsAttr }] : []
      this.goodsImg = row.goodsImg ? row.goodsImg.split(';').map(x => { var a = { url: x, name: x }; return a }) : []
      this.category.value = [row.rootCategoryId]
      // this.getSelectByGoodsId(row.goodsId)
      this.showAdd()
    },
    // getSelectByGoodsId(goodsId) {
    //   selectByGoodsId({ goodsId }).then(res => {
    //     console.log(res)
    //   })
    // },
    addcancel() {
      this.initParams()
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
.inpCheck {
  height: 30px;
  border: 1px solid #ddd;
  border-radius: 0 3px 3px 0;
  padding-left: 10px;
  line-height: 28px;
}
.inpCheck-title {
  float: left;
  padding-right: 10px;
}
.inpCheck-title input {
  position: relative;
  top: 3px;
}
.inpCheck-tips {
  padding-left: 3px;
  float: right;
}
</style>
