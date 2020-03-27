<template>
  <div>
    <Card shadow title="订单列表">
      <i-button type="primary" @click="showAdd()">手动补单</i-button>
      <div style="margin:10px 0">
        <i-input v-model="listparams.orderId" placeholder="查询单个订单号" style="width:200px;float:left;margin-right:10px">
          <span slot="prepend">订单号</span>
        </i-input>
        <DatePicker type="date" v-model="StartTime" @on-change="startTimeChange" :options="optionsStartTime" placeholder="请选择日期" style="width: 120px;margin-right:10px"></DatePicker>
        <DatePicker type="date" v-model="EndTime" @on-change="endtTimeChange" :options="optionsEndTime" placeholder="请选择日期" style="width: 120px;margin-right:10px"></DatePicker>
        
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
    </Modal>
    <Modal v-model="modal2" title="查看商品">
      <div>订单号：{{goodsInfo.orderId}}</div>
      <div>
        订单商品：
        <div v-for="(item,index) in goodsInfo.subOrderInfoList" :key="index">
          <div>商品名字：{{item.title}}</div>
          <div><img :src="$showUrl+item.goodsAttr" width="80px"></div>
          <div v-if="item.propertyTitle">属性：{{item.propertyTitle}}</div>
        </div>
      </div>
      <div>价格：{{goodsInfo.price}}</div>
      <div>时间：{{goodsInfo.createTime}}</div>
    </Modal>
    <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { orderList, deliveryOrder } from '@/api/goods'
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
        orderId:'',
        goodsId:''
      },
      goodsInfo:'',
      StartTime: new Date()+604800000,
      EndTime: new Date(),
      optionsStartTime: {
        // disabledDate (date) {
        //     return date && date.valueOf() < Date.now() - 86400000;
        // }
      },
      optionsEndTime: {
        // disabledDate (date) {
        //     const disabledDay = date.getDate();
        //     return disabledDay === 15;
        // }
      },
      sendParams: {
        orderId: '',
        sendCode: '',
      },
      modal1: false,
      modal2:false,
      loading: true,
      modify: false,
      columns: [
        { title: '订单号', key: 'orderId' },
        { title: '状态', key: 'state' },
        { title: '使用积分', key: 'score' },
        { title: '金额', key: 'price' },
        { title: '实际金额', key: 'totalAmount' },
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
                }, '查看'),
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
                      this.showSend(params.row)
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
    initTime(){
      this.listparams.createStartTime = this.StartTime
      this.listparams.createEndTime = this.EndTime

    },
    initParams() {
      this.sendParams = {
        orderId: '',
        sendCode: '',
      }
      this.modify = false
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
          console.log(date.valueOf(), vm.StartTime)

          if ((date.valueOf() < vm.StartTime) || (date.valueOf() > (vm.StartTime.valueOf() + 2591160000))) {
            return date
          }
        }
      }
    },
    endtTimeChange(val) {
      let vm = this
      this.listparams.createEndTime = val
      this.optionsStartTime = {
        disabledDate(date) {
          return date && date.valueOf() < vm.EndTime + 2592000000;
        }
      }
    },
    showSend(row) {
      if (row) {
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
        } else {
          this.$Modal.error({
            title: '提示',
            content: res.data.message
          })
        }
      })
    },
    goodsLook(row){
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
          this.params.pageNum = 1
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
