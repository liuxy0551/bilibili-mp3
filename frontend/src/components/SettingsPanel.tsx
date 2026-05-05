import { useSettings } from '../context/SettingsContext'
import { Settings, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface SettingsPanelProps {
  variant?: 'full' | 'compact'
}

export default function SettingsPanel({ variant = 'full' }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(variant === 'full')
  const { settings, updateSettings } = useSettings()

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="设置"
        >
          <Settings className="h-5 w-5" />
        </button>
        
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50 animate-fade-in">
              <h3 className="font-medium text-gray-800 dark:text-white mb-3">设置</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    文件命名规则
                  </label>
                  <select
                    value={settings.naming}
                    onChange={(e) => updateSettings({ naming: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="INDEX-TITLE-AUTHOR">序号-标题-作者</option>
                    <option value="INDEX-TITLE-AUTHOR-DATE">序号-标题-作者-日期</option>
                    <option value="TITLE-AUTHOR-DATE">标题-作者-日期</option>
                    <option value="TITLE">仅标题</option>
                    <option value="INDEX-TITLE">序号-标题</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    提取线程数: {settings.threads}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={settings.threads}
                    onChange={(e) => updateSettings({ threads: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

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
              value={settings.naming}
              onChange={(e) => updateSettings({ naming: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="INDEX-TITLE-AUTHOR">序号-标题-作者</option>
              <option value="INDEX-TITLE-AUTHOR-DATE">序号-标题-作者-日期</option>
              <option value="TITLE-AUTHOR-DATE">标题-作者-日期</option>
              <option value="TITLE">仅标题</option>
              <option value="INDEX-TITLE">序号-标题</option>
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              可用变量: INDEX, TITLE, AUTHOR, DATE
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              提取线程数
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={settings.threads}
              onChange={(e) => updateSettings({ threads: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>1</span>
              <span>{settings.threads}</span>
              <span>20</span>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              注意: 设置将在下次提取时生效
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
