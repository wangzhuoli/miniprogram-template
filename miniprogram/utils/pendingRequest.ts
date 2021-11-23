/**
 * 请求管理
 */

class PendingRequest {
  // 队列
  queue = new Map<string, WechatMiniprogram.RequestTask>()
  // 生成请求唯一的key
  generateKey(options: WechatMiniprogram.RequestOption) {
    const { url, method, data } = options
    return [method, url, JSON.stringify(data)].join('&')
  }
  // 入列
  add(options: WechatMiniprogram.RequestOption, RequestTask: WechatMiniprogram.RequestTask) {
    const key = this.generateKey(options)
    if (this.queue.has(key)) {
      // 取消上一次请求
      this.queue.get(key)?.abort()
    }
    this.queue.set(key, RequestTask)
  }
  // 出列
  delete(options: WechatMiniprogram.RequestOption) {
    const key = this.generateKey(options)
    this.queue.delete(key)
  }
}

const pendingRequest = new PendingRequest()

export default pendingRequest
