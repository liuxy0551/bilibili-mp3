import { clsx } from 'clsx'

interface ProgressBarProps {
  progress: number
  status: string
  className?: string
}

export default function ProgressBar({ progress, status, className }: ProgressBarProps) {
  const getColor = () => {
    switch (status) {
      case 'downloading':
        return 'bg-blue-500'
      case 'converting':
        return 'bg-yellow-500'
      case 'completed':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getLabel = () => {
    switch (status) {
      case 'pending':
        return '等待中'
      case 'downloading':
        return `提取中 ${progress}%`
      case 'converting':
        return '转换中'
      case 'completed':
        return '已完成'
      case 'error':
        return '失败'
      default:
        return '未知'
    }
  }

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {getLabel()}
        </span>
        {status === 'downloading' && (
          <span className="text-xs font-medium text-gray-500">
            {progress}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={clsx('h-2 rounded-full transition-all duration-300', getColor())}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
