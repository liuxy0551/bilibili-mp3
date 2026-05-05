export interface Task {
  id: string
  url: string
  status: 'pending' | 'downloading' | 'converting' | 'completed' | 'error'
  progress: number
  filename?: string
  error?: string
  title?: string
  author?: string
  createdAt: Date
  updatedAt: Date
}

export interface DownloadOptions {
  naming?: string
  threads?: number
  skipMp3?: boolean
}

export interface VideoData {
  bvid: string
  aid: number
  title: string
  owner: {
    name: string
  }
  ctime: number
  pages: Array<{
    cid: number
    part: string
  }>
}
