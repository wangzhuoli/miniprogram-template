Page({
  data: {
    fileList: [],
    uploadCom: undefined
  } as any,
  onLoad() {
    const uploadCom: any = this.selectComponent('#upload')
    this.setData({
      uploadCom
    })
  },
  // 监听上传组件上传状态
  onLodingChange(e: WechatMiniprogram.TouchEvent) {
    console.log('loading', e.detail)
  },
  // 点击上传
  onUpload() {
    console.log(this.data.uploadCom)
    this.data.uploadCom.uploadFiles()
  },
  // 监听图片上传成功后的返回值
  onImagChange(e: WechatMiniprogram.TouchEvent) {
    console.log(e.detail)
  }
})
