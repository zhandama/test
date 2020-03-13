<template>
<div>
  <div class="demo-upload-list" v-for="item in uploadList">
    <template v-if="item.status === 'finished'">
      <img :src="item.showUrl">
      <div class="demo-upload-list-cover">
        <Icon type="ios-eye-outline" @click.native="handleView(item.showUrl)" size="30"></Icon>
        <Icon type="ios-trash-outline" @click.native="handleRemove(item)" size="30"></Icon>
      </div>
    </template>
    <template v-else>
      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
    </template>
  </div>
  <Upload ref="upload" name="editormd-image-file" :show-upload-list="false" :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" :action="$uploadUrl" style="display: inline-block;width:80px;" accept="image/*">
    <div style="width: 80px;height:80px;line-height: 80px;">
      <Icon type="ios-camera" size="50"></Icon>
    </div>
  </Upload>
  <Modal title="查看大图" v-model="visible">
    <img :src="imgName" v-if="visible" style="width: 100%">
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
  data() {
    return {
      // defaultList: [
      //   {
      //     'name': 'a42bdcc1178e62b4694c830f028db5c0',
      //     'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
      //   },
      //   {
      //     'name': 'bc7521e033abdd1e92222d733590f104',
      //     'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
      //   }
      // ],
      imgName: '',
      visible: false,
      uploadList: []
    }
  },
  methods: {
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList;
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    handleSuccess(res, file) {
      if (res.success) {
        file.showUrl = this.$showUrl + res.result
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
          title: '最多上传'+this.maxlength+'张图片'
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
