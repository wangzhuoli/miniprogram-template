import { baseUrl } from '../config/config'
import { getToken } from '../storage/token'
import pendingRequest from './PendingRequest'
/**
 * 公共请求
 */
interface RequestResponse<T> {
  code: number
  msg: string
  data?: T
}

interface RequestOptions extends WechatMiniprogram.RequestOption {
  showLoading?: boolean
  showToast?: boolean
}

class Request {
  request<T>(options: RequestOptions): Promise<RequestResponse<T>> {
    const { url, data: _data, showLoading = true, showToast = true } = options
    let [_url, params] = this.replaceUrlDynamicParams(url, _data as any)
    showLoading && wx.showLoading({ title: '加载中' })
    let token = getToken()
    if (token) {
      // 携带token
      _url += '?access_token=' + token
    }

    return new Promise((resoleve) => {
      const RequestTask = wx.request({
        ...options,
        url: baseUrl + _url,
        data: params,
        complete: (result: WechatMiniprogram.GeneralCallbackResult & { statusCode?: number; data?: string | RequestResponse<T> }) => {
          if (result.errMsg === 'request:fail abort') {
            // 中断请求了
            return
          }
          showLoading && wx.hideLoading()

          pendingRequest.delete({ url: options.url, method: options.method, data: options.data })
          const { data } = result

          if (result.statusCode === 200 && data) {
            // 接口请求成功

            if (typeof data === 'string' || typeof data === 'number') {
              // 返回的是字符串
              resoleve({ code: 0, msg: 'success', data: data as any })
              return
            }

            if (data.code !== 0) {
              // 接口返回失败 给错误提示
              showToast && wx.showToast({ title: data.msg, icon: 'error' })
            }
            resoleve({ code: data.code, msg: data.msg, data: data.data })
          } else {
            // 接口请求失败 给出错误提示
            resoleve({
              code: 404,
              msg: '请求失败了'
            })
            showToast && wx.showToast({ title: '请求失败了', icon: 'error' })
          }
        }
      })
      pendingRequest.add({ url: options.url, method: options.method, data: options.data }, RequestTask)
    })
  }
  get<T>(options: RequestOptions): Promise<RequestResponse<T>> {
    return this.request<T>({ ...options, method: 'GET' })
  }
  post<T>(options: RequestOptions): Promise<RequestResponse<T>> {
    return this.request({ ...options, method: 'POST' })
  }
  delete<T>(options: RequestOptions): Promise<RequestResponse<T>> {
    return this.request({ ...options, method: 'DELETE' })
  }
  put<T>(options: RequestOptions): Promise<RequestResponse<T>> {
    return this.request({ ...options, method: 'PUT' })
  }
  // url 动态参数替换
  replaceUrlDynamicParams(url = '', params: { [key: string]: any } = {}): [string, { [key: string]: any }] {
    const keys = Object.keys(params)
    let pattern: RegExp | null = null
    for (const key of keys) {
      pattern = new RegExp(`:${key}\\b`, 'g')
      if (pattern.test(url)) {
        // url 当前有动态参数，使用正则替换
        url = url.replace(pattern, params[key])
        delete params[key]
      }
    }
    return [url, params]
  }
}

const request = new Request()

export default request
