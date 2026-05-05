import { useTaskContext } from '../context/TaskContext'
import TaskItem from './TaskItem'
import { Inbox } from 'lucide-react'

export default function TaskList() {
  const { tasks, loading, error } = useTaskContext()

  if (loading && tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">加载中...</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <Inbox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          还没有下载任务
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          输入 Bilibili 视频链接开始下载
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          下载任务 ({tasks.length})
        </h2>
      </div>
      
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
