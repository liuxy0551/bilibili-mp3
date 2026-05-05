import React, { useState } from 'react'
import { useTaskContext } from '../context/TaskContext'
import { Download, Link, List } from 'lucide-react'

export default function UrlInput() {
  const [url, setUrl] = useState('')
  const [isValid, setIsValid] = useState(true)
  const { addTask, addCollectionTask, loading } = useTaskContext()

  const validateUrl = (value: string) => {
    const bilibiliRegex = /^https?:\/\/(www\.)?bilibili\.com\/video\/[A-Za-z0-9]+/
    return bilibiliRegex.test(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setIsValid(false)
      return
    }

    if (!validateUrl(url)) {
      setIsValid(false)
      return
    }

    setIsValid(true)
    await addTask(url.trim())
    setUrl('')
  }

  const handleCollectionDownload = async () => {
    if (!url.trim()) {
      setIsValid(false)
      return
    }

    if (!validateUrl(url)) {
      setIsValid(false)
      return
    }

    setIsValid(true)
    await addCollectionTask(url.trim())
    setUrl('')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            bilibili 视频链接
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setIsValid(true)
              }}
              placeholder="https://www.bilibili.com/video/BV..."
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                !isValid ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
          </div>
          {!isValid && (
            <p className="mt-1 text-sm text-red-500">
              请输入有效的 bilibili 视频链接
            </p>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            {loading ? '处理中...' : '下载单个'}
          </button>
          
          <button
            type="button"
            onClick={handleCollectionDownload}
            disabled={loading}
            className="flex-1 flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <List className="h-5 w-5 mr-2" />
            {loading ? '处理中...' : '下载合集'}
          </button>
        </div>
      </form>
    </div>
  )
}
