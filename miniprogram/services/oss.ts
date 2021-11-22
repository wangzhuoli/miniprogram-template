import request from '../utils/request'

interface OssResponse {
  accessid: string
  callback: string
  dir: string
  expire: Date
  host: string
  oss_url_domain: string
  policy: string
  signature: string
}

export const getOssOptions = () => request.get<OssResponse>({ url: '/oss/signature', showLoading: false })
