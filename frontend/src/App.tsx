import { ThemeProvider } from './context/ThemeContext'
import { TaskProvider } from './context/TaskContext'
import UrlInput from './components/UrlInput'
import TaskList from './components/TaskList'
import SettingsPanel from './components/SettingsPanel'
import ThemeToggle from './components/ThemeToggle'
import { Github } from 'lucide-react'

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <nav className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="flex items-center justify-between h-14">
                <div className="flex items-center space-x-2">
                  <img src="/favicon.ico" alt="bilibili" className="h-8 w-8" />
                  <span className="font-bold text-gray-800 dark:text-white">bilibili 音频提取</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <ThemeToggle />
                  <a
                    href="https://github.com/liuxy0551/bilibili-mp3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="bilibili-mp3"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <SettingsPanel variant="compact" />
                </div>
              </div>
            </div>
          </nav>
          
          <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                bilibili 音频提取
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                提取 bilibili 视频音频并转换为 MP3
              </p>
            </div>
            
            <UrlInput />
            <TaskList />
          </main>
          
          <footer className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
            <p>
              基于{' '}
              <a
                href="https://github.com/wxsms/bilibili-video2mp3"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                bilibili-video2mp3
              </a>
              {' '}项目
            </p>
          </footer>
        </div>
      </TaskProvider>
    </ThemeProvider>
  )
}

export default App
