import { TaskProvider } from './context/TaskContext'
import UrlInput from './components/UrlInput'
import TaskList from './components/TaskList'
import SettingsPanel from './components/SettingsPanel'

function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Bilibili 视频转 MP3
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              下载 Bilibili 视频并转换为 MP3 音频
            </p>
          </header>
          
          <main className="space-y-6">
            <UrlInput />
            <TaskList />
            <SettingsPanel />
          </main>
          
          <footer className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
            <p>基于 bilibili-video2mp3 项目</p>
          </footer>
        </div>
      </div>
    </TaskProvider>
  )
}

export default App
