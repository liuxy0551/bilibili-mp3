import { Task } from '../types'
import { useTaskContext } from '../context/TaskContext'
import { getDownloadUrl } from '../services/api'
import ProgressBar from './ProgressBar'
import { Download, X, Music, Video, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { clsx } from 'clsx'

interface TaskItemProps {
  task: Task
}

export default function TaskItem({ task }: TaskItemProps) {
  const { removeTask } = useTaskContext()

  const getStatusIcon = () => {
    switch (task.status) {
      case 'pending':
        return <Loader className="h-5 w-5 text-gray-400 animate-spin" />
      case 'downloading':
        return <Download className="h-5 w-5 text-blue-500 animate-pulse" />
      case 'converting':
        return <Music className="h-5 w-5 text-yellow-500 animate-pulse" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const handleDownload = () => {
    if (task.id) {
      window.open(getDownloadUrl(task.id), '_blank')
    }
  }

  return (
    <div className={clsx(
      'bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-slide-up',
      task.status === 'error' && 'border-l-4 border-red-500'
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {getStatusIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {task.title || task.url}
            </h3>
            {task.author && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {task.author}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {task.status === 'completed' && (
            <button
              onClick={handleDownload}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="下载 MP3"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => removeTask(task.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="删除任务"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {task.status !== 'pending' && (
        <div className="mt-3">
          <ProgressBar progress={task.progress} status={task.status} />
        </div>
      )}

      {task.error && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-600 dark:text-red-400">
          {task.error}
        </div>
      )}

      {task.status === 'completed' && task.filename && (
        <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Video className="h-3 w-3 mr-1" />
          {task.filename}
        </div>
      )}
    </div>
  )
}
