import { Task } from '../types/index.js'

class TaskManager {
  private tasks: Map<string, Task> = new Map()

  createTask(id: string, url: string): Task {
    const task: Task = {
      id,
      url,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.tasks.set(id, task)
    return task
  }

  getTask(id: string): Task | undefined {
    return this.tasks.get(id)
  }

  getAllTasks(): Task[] {
    return Array.from(this.tasks.values())
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const task = this.tasks.get(id)
    if (task) {
      const updatedTask = { ...task, ...updates, updatedAt: new Date() }
      this.tasks.set(id, updatedTask)
      return updatedTask
    }
    return undefined
  }

  deleteTask(id: string): boolean {
    return this.tasks.delete(id)
  }

  clearAllTasks(): void {
    this.tasks.clear()
  }
}

export const taskManager = new TaskManager()
