const { Task } = require('../models/Task');

class TaskService {
  constructor(taskRepository) {
    this.repo = taskRepository;
  }

  listTasks(filters = {}) {
    return this.repo.findAll(filters);
  }

  getTask(id) {
    const task = this.repo.findById(id);
    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    return task;
  }

  createTask(data) {
    const task = new Task(data);
    return this.repo.save(task);
  }

  updateTask(id, data) {
    const task = this.getTask(id);
    task.update(data);
    return this.repo.save(task);
  }

  deleteTask(id) {
    const deleted = this.repo.delete(id);
    if (!deleted) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }
    return true;
  }

  getStats() {
    const tasks = this.repo.findAll();
    return {
      total: tasks.length,
      byStatus: {
        pending: tasks.filter((t) => t.status === 'pending').length,
        in_progress: tasks.filter((t) => t.status === 'in_progress').length,
        done: tasks.filter((t) => t.status === 'done').length,
      },
      byPriority: {
        low: tasks.filter((t) => t.priority === 'low').length,
        medium: tasks.filter((t) => t.priority === 'medium').length,
        high: tasks.filter((t) => t.priority === 'high').length,
      },
    };
  }
}

module.exports = { TaskService };
