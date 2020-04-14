<template>
  <div>
    <Card shadow title="订单列表">
      <i-button type="primary" @click="modal3=true;addOrderId=''">手动补单</i-button>
      <div style="margin:10px 0">
        <i-input v-model="listparams.orderId" placeholder="查询单个订单号" style="width:200px;float:left;margin-right:5px">
          <span slot="prepend">订单号</span>
        </i-input>
        <DatePicker type="date" v-model="StartTime" @on-change="startTimeChange" :options="optionsStartTime" placeholder="请选择日期" style="width: 120px;margin-right:5px"></DatePicker>
        <DatePicker type="date" v-model="EndTime" @on-change="endtTimeChange" :options="optionsEndTime" placeholder="请选择日期" style="width: 120px;margin-right:5px"></DatePicker>
        <Select v-model="listparams.state" style="width:100px;margin-right:5px">
          <Option value="">全部</Option>
          <Option value="1">待付款</Option>
          <Option value="2">待发货</Option>
          <Option value="3">已发货</Option>
          <Option value="4">已收货</Option>
          <Option value="5">已结单</Option>
          <Option value="6">已取消</Option>
        </Select>
        <i-button type="primary" @click="search()">搜索</i-button>
      </div>
      <tables ref="tables" v-model="tableData.list" :columns="columns" @on-delete="handleDelete" v-if="tableData.list&&tableData.list.length>0" />
      <Page :total="tableData.total" :page-size="listparams.pageSize" show-total class="paging" @on-change="changepage" style="margin-top:20px"></Page>
    </Card>

    <Modal v-model="modal1" title="发货" @on-ok="ok" :loading="loading" width="400" :styles="{'margin-bottom': '30px'}">
      <i-input v-model="sendParams.orderId" placeholder="请输入..." style="width: 330px;" :disabled='true'>
        <span slot="prepend">订单号<span class="xing">*</span>：</span>
      </i-input>
      <i-input v-model="sendParams.sendCode" placeholder="请输入..." style="width: 330px;margin-top:20px">
        <span slot="prepend">快递单号<span class="xing">*</span>：</span>
      </i-input>
      <div class="sendCont" v-if="goodsInfo.orderAddressInfo">
        <div class="seeTitle">收货人：{{goodsInfo.orderAddressInfo.realName}}</div>
        <div class="seeTitle">收货人号码：{{goodsInfo.orderAddressInfo.phone}}</div>
        <div class="seeTitle">收货收货地址：{{goodsInfo.orderAddressInfo.completeAddress}}</div>
      </div>
    </Modal>

    <Modal v-model="modal2" title="查看商品">
      <div class="seeTitle">订单号：{{goodsInfo.orderId}}</div>
      <div class="seeCont">
        <div class="seeContTitle">订单商品：</div>
        <div class="seeGoodsList" v-for="(item,index) in goodsInfo.subOrderInfoList" :key="index">
          <div class="seeGoodsImg"><img :src="$showUrl+item.goodsAttr" width="80px"></div>
          <div class="seeGoodsCont">
            <div class="seeGoodsTitle">商品名字：{{item.title}}</div>
            <div class="seeGoodsTitle" v-if="item.propertyTitle">{{item.propertyTitle}}</div>
            <div class="seeGoodsTitle"><span class="seeprice">￥{{item.goodsPrice}}</span> x {{item.count}}</div>
            <div class="clear"></div>
          </div>
        </div>
      </div>
      <div class="seeTitle">价格：<span class="seeprice">￥{{goodsInfo.price}}</span></div>
      <div class="seeTitle">时间：{{goodsInfo.createTime}}</div>
      <div class="seeCont" v-if="goodsInfo.orderAddressInfo">
        <div class="seeTitle">收货人：{{goodsInfo.orderAddressInfo.realName}}</div>
        <div class="seeTitle">收货人号码：{{goodsInfo.orderAddressInfo.phone}}</div>
        <div class="seeTitle">收货收货地址：{{goodsInfo.orderAddressInfo.completeAddress}}</div>
      </div>
    </Modal>

    <Modal v-model="modal3" title="手动补单" @on-ok="addOrderIdok" :loading="loading" width="400" :styles="{'margin-bottom': '30px'}">
      <i-input v-model="addOrderId" placeholder="请输入..." style="width: 330px;">
        <span slot="prepend">订单号<span class="xing">*</span>：</span>
      </i-input>
    </Modal>
    
    <Modal v-model="modal4" title="手动补单" @on-ok="editPrice" :loading="loading" width="400" :styles="{'margin-bottom': '30px'}">
      <i-input v-model="price.orderId" placeholder="请输入..." style="width: 330px;" :readonly='true'>
        <span slot="prepend">订单号<span class="xing">*</span>：</span>
      </i-input>
      <i-input v-model="price.totalPrice" placeholder="请输入..." style="width: 330px;margin-top:20px">
        <span slot="prepend">价格<span class="xing">*</span>：</span>
      </i-input>
    </Modal>

    <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { orderList, deliveryOrder, manualPayOrder, modifyOrderPrice } from '@/api/goods'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data() {
    return {
      listparams: {
        pageNum: 1,
        pageSize: 100,
        createStartTime: "",
        createEndTime: '',
        orderId: '',
        goodsId: ''
      },
      price:{
        orderId:'',
        totalPrice: ''
      },
      goodsInfo: '',
      StartTime: new Date(new Date() - 604800000),
      EndTime: new Date(),
      optionsStartTime: {
        disabledDate (date) {
            return date && date.valueOf() > Date.now();
        }
      },
      optionsEndTime: {
        disabledDate (date) {
            return date && date.valueOf() > Date.now();
        }
      },
      sendParams: {
        orderId: '',
        sendCode: '',
      },
      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      loading: true,
      modify: false,
      addOrderId:'',
      columns: [
        { title: '订单号', key: 'orderId' },
        { title: '订单状态', key: 'stateName' },
        { title: '使用积分', key: 'score' },
        { title: '金额', key: 'price' },
        { title: '实际金额', key: 'totalAmount' },
        { title: '时间', key: 'createTime' },
        {
          title: '操作',
          key: 'handle',
          width: 200,
          // options: ['delete'],
          button: [
            (h, params, vm) => {
              let arr = []
              arr.push(h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.goodsLook(params.row)
                  }
                }
              }, '查看'))
              if (params.row.state == 1) {
                arr.push(h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showPrice(params.row)
                    }
                  }
                }, '修改价格'))
              }
              if (params.row.state == 2) {
                arr.push(h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.showSend(params.row)
                    }
                  }
                }, '发货'))
              }
              return h('div', arr)
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
    initTime() {
      this.listparams.createStartTime = this.dataTime(this.StartTime)
      this.listparams.createEndTime = this.dataTime(this.EndTime)
    },
    dataTime(date){
      var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      return time
    },
    initParams() {
      this.sendParams = {
        orderId: '',
        sendCode: '',
      }
      this.modify = false
    },
    showPrice(row){
      this.modal4 = true
      this.price.totalPrice = ''
      this.price.orderId = row.orderId
    },
    editPrice(){
      this.modal4 = false
      if (this.price.totalPrice == ''||this.price.totalPrice <= 0) {
        this.$Modal.error({
          title: '提示',
          content: '请输入价格',
          onOk: () => {
            this.modal4 = true
          }
        })
        return
      }
      modifyOrderPrice(this.price).then(res => {
        if (res.data && res.data.success) {
          this.price.totalPrice = ''
          this.$Message.success('操作成功')
          this.listparams.pageNum = 1
          this.getList()
        } else {
          this.$Modal.error({
            title: '提示',
            content: res.data.message,
            onOk: () => {
              this.modal4 = true
            }
          })
        }
        this.modal4 = false
      },error=>{
        this.$Message.error('操作失败')
      })
    },
    search() {
      if (this.listparams.createStartTime == '' || this.listparams.createEndTime == '') {
        this.$Modal.error({
          title: '提示',
          content: '请选择时间',
        })
        return
      }
      this.listparams.pageNum = 1
      this.getList()
    },
    startTimeChange(val) {
      let vm = this
      this.listparams.createStartTime = val
      this.optionsEndTime = {
        disabledDate(date) {
          if ((date.valueOf() < vm.StartTime) || (date.valueOf() > (vm.StartTime.valueOf() + 2591160000))) {
            return date
          }
        }
      }
    },
    endtTimeChange(val) {
      let vm = this
      this.listparams.createEndTime = val
      // this.optionsStartTime = {
      //   disabledDate(date) {
      //     return date && date.valueOf() < vm.EndTime + 2592000000;
      //   }
      // }
    },
    showSend(row) {
      if (row) {
        this.goodsInfo = row
        this.sendParams.orderId = row.orderId
      }
      this.modal1 = true
    },
    handleDelete(params) {

    },
    changepage(page) {
      this.listparams.pageNum = page
      this.getList()
    },
    getList() {
      orderList(this.listparams).then(res => {
        if (res.data.result) {
          this.tableData = res.data.result
          this.tableData.list.map(x => {
            switch (x.state) {
              case 1:
                x.stateName = '待付款'
                break;
              case 2:
                x.stateName = '待发货'
                break;
              case 3:
                x.stateName = '已发货'
                break;
              case 4:
                x.stateName = '已收货'
                break;
              case 5:
                x.stateName = '已结单'
                break;
              case 6:
                x.stateName = '已取消'
                break;
            }
          })
        } else {
          this.$Modal.error({
            title: '提示',
            content: res.data.message
          })
        }
      })
    },
    goodsLook(row) {
      this.goodsInfo = row
      this.modal2 = true
    },
    ok() {
      this.modal1 = false
      if (this.sendParams.sendCode == '') {
        this.$Modal.error({
          title: '提示',
          content: '请输入快递单号',
          onOk: () => {
            this.modal1 = true
          }
        })
        return
      }
      deliveryOrder(this.sendParams).then(res => {
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
              this.modal1 = true
            }
          })
        }
        this.modal1 = false
      })
    },
    cancel() {

    },
    addOrderIdok() {
      if (this.addOrderId=='') {
        this.modal3 = false
        this.$Modal.error({
            title: '提示',
            content: '请输入需要补的订单号',
            onOk: () => {
              this.modal3 = true
            }
          })
        return
      }
      manualPayOrder({orderId:this.addOrderId}).then(res => {
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
              this.modal3 = true
            }
          })
        }
        this.modal3 = false
      })
    },
    exportExcel() {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    }
  },
  mounted() {
    this.initTime()
    this.getList()
  }
}
</script>
<style scoped>
.seeTitle {
  font-size: 16px;
  border-bottom: 1px solid #f1f1f1;
  padding: 5px 0;
}
.clear {
  clear: both;
}
.seeCont {
  padding-bottom: 15px;
}
.seeContTitle {
  font-size: 14px;
  padding: 3px 0;
  border-bottom: 1px dashed #eee;
}
.seeGoodsList {
  padding-left: 20px;
  padding-bottom: 10px;
  margin-top: 10px;
  border-bottom: 1px dashed #eee;
}
.seeprice {
  color: chocolate;
  font-size: 16px;
}
.seeGoodsTitle {
  font-size: 14px;
}
.seeGoodsImg {
  float: left;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
}
.sendCont {
  padding-top: 10px;
}
.sendCont .seeTitle {
  font-size: 12px;
}
</style>