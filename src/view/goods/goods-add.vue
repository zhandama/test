<template>
  <div>
    <Card shadow title="添加商品">
      <div class="textinput">
        <i-input v-model="params.title" placeholder="请输入..." style="width: 300px">
          <span slot="prepend">商品名称<span class="xing">*</span>：</span>
        </i-input>
      </div>
      <div class="textinput">
        <i-input v-model="params.initPrice" placeholder="请输入..." style="width: 300px">
          <span slot="prepend">原价<span class="xing">*</span>：</span>
        </i-input>
      </div>
      <div class="textinput">
        <i-input v-model="params.vipPrice" placeholder="请输入..." style="width: 300px">
          <span slot="prepend">会员价<span class="xing">*</span>：</span>
        </i-input>
      </div>
      <div class="textinput">
        <div class="ivu-input-wrapper ivu-input-wrapper-default ivu-input-type ivu-input-group ivu-input-group-default ivu-input-group-with-prepend" style="width: 300px;">
          <div class="ivu-input-group-prepend" style=""><span>商品类别<span class="xing">*</span>：</span></div>
          <div class="ivu-input-inner-container">
            <i class="ivu-icon ivu-icon-ios-loading ivu-load-loop ivu-input-icon ivu-input-icon-validate"></i>
            <Cascader :data="this.property.data" v-model="category" @on-change="handleChange"></Cascader>
          </div>
        </div>
      </div>
      <div class="textinput">
        <i-input v-model="params.phone" placeholder="请输入..." style="width: 300px">
          <span slot="prepend">动态属性：</span>
          <!-- <span></span> -->
        </i-input>
      </div>
      <div class="textinput">
        <span slot="prepend">商品描述：</span>
        <editor class="textinput" ref="editor" :value="params.description" @on-change="handleChange" />
      </div>
      <i-button type="info" @click="add">添加商品</i-button>
    </Card>
  </div>
</template>

<script>
import { propertyInfoList } from '@/api/goods'
import Editor from '_c/editor'
export default {
  name: 'adduser',
  components: {
    Editor
  },
  data () {
    return {
      params: {
        description: '',
        goodsAttr: '',
        goodsImg: '',
        goodsPropertyList: [],
        initPrice: 0,
        rootCategoryId: 0,
        subCategoryId: 0,
        title: '',
        vipPrice: 0,
        hot:false
      },
      category: [],
      property: [],
      propertyParams: {
        pageNum: 1,
        pageSize: 20
      }
    }
  },
  watch: {
    category (val) {
      console.log(val)
    }
  },
  methods: {
    changeContent () {
      this.$refs.editor.setHtml('<p>powered by wangeditor</p>')
    },
    handleChange (html, text) {
      console.log(html, text)
    },
    add () {
      console.log(this.params)
      if (this.params.sexName == '男') {
        this.params.sex = true
      } else {
        this.params.sex = false
      }
      addUser(this.params).then(res => {
        console.log(res)
        if (res.data && res.data.success) {
          this.$Message.success('添加成功')
        } else {
          this.$Modal.error({ title: '提示', content: res.data.message })
          setTimeout(() => {
            this.$Modal.remove()
          }, 2000)
        }
      })
    },
    getPropertyInfo () {
      propertyInfoList(this.propertyParams).then(res => {
        this.property = res.data.result
        console.log(this.property)
        if (this.property && this.property.list.length > 0) {
          this.property.data = this.property.list.map(x => {
            var obj = {
              value: x.id,
              label: x.name
            }
            return obj
          })
        }
        console.log(this.property.data)
      })
    }
  },
  mounted () {
    this.getPropertyInfo()
  }
}
</script>
<style>
.xing {
  color: red;
  padding: 0 2px;
}
.ivu-input-group .ivu-input, .ivu-input-group .ivu-input-inner-container{z-index:auto}
</style>
