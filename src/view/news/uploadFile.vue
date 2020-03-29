<template>
<div>
  <div class="demo-upload-list" v-for="item in uploadList">
    <template v-if="item.status === 'finished'">
      <!-- <img :src="$showUrl+item.url"> -->
      <div><video :src="$showUrl+item.url" style="max-width: 82px;max-height:82px" autoplay muted></video></div>
      <div class="demo-upload-list-cover">
        <Icon type="ios-eye-outline" @click.native="handleView($showUrl+item.url)" size="30"></Icon>
        <Icon type="ios-trash-outline" @click.native="handleRemove(item)" size="30"></Icon>
      </div>
    </template>
    <template v-else>
      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
    </template>
  </div>
   <Upload
      ref="upload"
      name="file"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :max-size="100000"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      type="drag"
      :action="$uploadFile"
      accept="video/*"
      style="display: inline-block;width:80px;">
      <div style="width: 80px;height:80px;line-height: 80px;">
          <Icon type="ios-camera" size="50"></Icon>
      </div>
  </Upload>
  <Modal title="查看" v-model="visible">
    <video :src="imgName" v-if="visible" style="max-width: 400px;max-height:300px" autoplay></video>
  </Modal>
</div>
</template>
<script>
export default {
  props: {
    // 编辑初始化图片
    defaultList: {
      type: Array
    },
    maxlength:{
      type:Number,
      default:15
    }
  },
  // watch:{
  //   defaultList(val){
  //     console.log(val)
  //   }
  // },
  data() {
    return {
      imgName: '',
      visible: false,
      uploadList: []
    }
  },
  methods: {
    handleView(url) {
      this.imgName = url;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      if (res.success) {
        file.name = res.result
        file.url = res.result
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: file.name + '格式不符合',
        desc: '请上传 jpg 或者 png'
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '图片太大',
        desc: file.name + '图片大于2M'
      });
    },
    handleBeforeUpload() {
      const check = this.uploadList.length < this.maxlength;
      if (!check) {
        this.$Notice.warning({
          title: '最多上传'+this.maxlength+'文件'
        });
      }
      return check;
    }
  },
  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  }
}
</script>
<style scoped>
.demo-upload-list {
  display: inline-block;
  height: 82px;
  width: auto !important;
  min-width:82px;
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
