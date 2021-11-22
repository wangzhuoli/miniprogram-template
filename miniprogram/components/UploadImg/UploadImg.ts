/**
 * 图片上传组件
 * 1. 传入已上传的文件格式必须为 FileItem[]
 * 2. 支持限制上传数量，默认1
 * 3. 支持点击上传 ｜ 读取文件后直接上传
 * 4. 组件文件上传时，会通过onLodingChange方法把上传中状态返回给父组件
 * 5. 组件文件上传成功  ｜ 删除文件时通过change方法返回上传好的图片
 */

import { getOssOptions } from '../../services/oss'

interface FileItem {
  message?: string
  size?: number
  status?: 'await' | 'done' | 'uploading' | 'failed'
  thumb?: string
  type?: string
  url: string
}

Component({
  properties: {
    // 已上传文件
    fileList: {
      type: Array,
      value: []
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      value: false
    },
    // 最大上传数量
    maxCount: {
      type: Number,
      value: 1
    },
    // 是否显示删除
    deletable: {
      type: Boolean,
      value: true
    },
    // 图片读取后是否马上上传
    atOnce: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    // 图片读取后
    afterRead(event: WechatMiniprogram.TouchEvent) {
      const files: FileItem[] = event.detail.file
      let { fileList } = this.data

      if (this.data.atOnce) {
        // 马上上传
        this.setData({
          fileList: [...fileList, ...files.map((i: FileItem) => ({ ...i, status: 'uploading', message: '上传中' }))]
        })
        this.uploadFiles()
      } else {
        this.setData({
          fileList: [...fileList, ...files.map((i: FileItem) => ({ ...i, status: 'await', message: '待上传' }))]
        })
      }
    },
    // 删除图片
    deleteImg(event: WechatMiniprogram.TouchEvent) {
      const { index } = event.detail
      const { fileList } = this.data
      fileList.splice(index, 1)
      this.setData({ fileList })
      this.triggerEvent('change', fileList)
    },
    // 上传文件列表
    async uploadFiles() {
      const { fileList } = this.data
      // 把待上传 和上传失败的文件改文上传中
      for (let i of fileList) {
        if (i.status === 'await' || i.status === 'failed') {
          i.status = 'uploading'
          i.message = '上传中'
        }
      }
      this.setData({ fileList })
      // 把上传中状态传给父组件
      // wx.showLoading({ title: '上传中' })
      this.triggerEvent('onLodingChange', true)
      for (let i = 0; i < fileList.length; i++) {
        const item = await this.uploadFile(fileList[i])
        fileList[i] = item
      }
      this.setData({ fileList })
      // 把上传中状态传给父组件
      // wx.hideLoading()
      this.triggerEvent('onLodingChange', false)
      // 把上传好的文件传给父组件
      this.triggerEvent('change', fileList)
      // 返回promise，便于父组件异步上传
      return fileList
    },
    // 单文件上传
    async uploadFile(file: FileItem): Promise<FileItem> {
      if (!file.status || file.status === 'done') {
        // 已经上传好的文件
        return { url: file.url }
      }

      // 获取oss签名
      const { code, data } = await getOssOptions()
      if (code === 0 && data) {
        // 获取签名成功
        const fileSuffix = file.url.split('.').reverse()[0]
        const filename = Date.now().toString() + '.' + fileSuffix
        const result: FileItem = await new Promise((resolve) => {
          wx.uploadFile({
            url: data.host, // 开发者服务器的URL。
            filePath: file.url,
            name: 'file', // 必须填file。
            formData: {
              key: data.dir + filename, //文件名，可直接用文件名filename，后台返回的数据result.dir，目的是在oss上建一个文件夹文件，方便管理
              policy: data.policy, //
              OSSAccessKeyId: data.accessid,
              // 让服务端返回200,不然，默认会返回204
              success_action_status: '200',
              signature: data.signature
            },
            success: () => {
              resolve({ url: data.oss_url_domain + '/' + data.dir + filename })
            },
            fail: () => {
              resolve({ url: file.url, status: 'failed' })
            }
          })
        })
        return result
      } else {
        // 获取签名失败
        return { url: file.url, status: 'failed' }
      }
    }
  }
})
