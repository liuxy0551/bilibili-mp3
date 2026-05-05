import { useState } from 'react'
import { Settings, ChevronDown, ChevronUp } from 'lucide-react'

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [naming, setNaming] = useState('TITLE-AUTHOR-DATE')
  const [threads, setThreads] = useState(10)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Settings className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700 dark:text-gray-300">
            高级设置
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 space-y-4 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              文件命名规则
            </label>
            <select
              value={naming}
              onChange={(e) => setNaming(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="TITLE-AUTHOR-DATE">标题-作者-日期</option>
              <option value="INDEX-TITLE-AUTHOR-DATE">序号-标题-作者-日期</option>
              <option value="TITLE">仅标题</option>
              <option value="INDEX-TITLE">序号-标题</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              可用变量: INDEX, TITLE, AUTHOR, DATE
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              下载线程数
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={threads}
              onChange={(e) => setThreads(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>1</span>
              <span>{threads}</span>
              <span>20</span>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              注意: 设置将在下次下载时生效
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
