import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function convertToMp3(inputFile: string, outputFile: string): Promise<void> {
  try {
    await execAsync(`ffmpeg -y -i "${inputFile}" -q:a 0 "${outputFile}"`)
  } catch (error: any) {
    throw new Error(`FFmpeg 转换失败: ${error.message}`)
  }
}
