import { spawn } from 'child_process'

export async function convertToMp3(
  inputFile: string, 
  outputFile: string, 
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    // 先获取音频时长
    const probe = spawn('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      inputFile
    ])

    let duration = 0
    let probeOutput = ''

    probe.stdout.on('data', (data) => {
      probeOutput += data.toString()
    })

    probe.on('close', (code) => {
      if (code === 0) {
        duration = parseFloat(probeOutput.trim()) || 0
      }
      
      // 开始转换
      const ffmpeg = spawn('ffmpeg', [
        '-y',
        '-i', inputFile,
        '-q:a', '0',
        outputFile
      ])

      let stderr = ''

      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString()
        
        // 解析 ffmpeg 输出的 time= 信息
        const timeMatch = stderr.match(/time=(\d{2}):(\d{2}):(\d{2})\.(\d{2})/)
        if (timeMatch && duration > 0 && onProgress) {
          const hours = parseInt(timeMatch[1])
          const minutes = parseInt(timeMatch[2])
          const seconds = parseInt(timeMatch[3])
          const currentTime = hours * 3600 + minutes * 60 + seconds
          const percent = Math.min(Math.round((currentTime / duration) * 100), 99)
          onProgress(percent)
          // 清除已处理的 stderr 避免重复匹配
          stderr = stderr.slice(stderr.lastIndexOf('time='))
        }
      })

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          if (onProgress) onProgress(100)
          resolve()
        } else {
          reject(new Error(`FFmpeg 转换失败，退出码: ${code}`))
        }
      })

      ffmpeg.on('error', (err) => {
        reject(new Error(`FFmpeg 转换失败: ${err.message}`))
      })
    })

    probe.on('error', (err) => {
      reject(new Error(`FFprobe 失败: ${err.message}`))
    })
  })
}
