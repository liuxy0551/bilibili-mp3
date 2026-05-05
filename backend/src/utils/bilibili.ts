import axios from 'axios'
import { VideoData } from '../types/index.js'

axios.defaults.headers.common['referer'] = 'https://www.bilibili.com/'
axios.defaults.headers.common['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0'

export async function getVideoData(url: string): Promise<{ videoData: VideoData, p: number }> {
  const { data } = await axios.get(url)
  const initialStateStr = data.match(/__INITIAL_STATE__=(.*?);\(function\(\)/)?.[1]

  if (!initialStateStr) {
    throw new Error('无法解析视频数据')
  }

  return JSON.parse(initialStateStr)
}

export async function getAudioUrl(bvid: string, cid: number): Promise<string> {
  const playUrl = `https://api.bilibili.com/x/player/playurl?fnval=80&cid=${cid}&bvid=${bvid}`
  const playResult = await axios.get(playUrl)

  if (!playResult.data?.data?.dash?.audio?.[0]?.baseUrl) {
    throw new Error('无法获取音频下载链接')
  }

  return playResult.data.data.dash.audio[0].baseUrl
}
