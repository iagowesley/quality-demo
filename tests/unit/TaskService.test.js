const { TaskService } = require('../../src/services/TaskService');
const { TaskRepository } = require('../../src/repositories/TaskRepository');

describe('TaskService', () => {
  let service;

  beforeEach(() => {
    const repo = new TaskRepository();
    service = new TaskService(repo);
  });

  describe('createTask()', () => {
    it('should create and return a task', () => {
      const task = service.createTask({ title: 'Deploy app', priority: 'high' });
      expect(task.id).toBeDefined();
      expect(task.title).toBe('Deploy app');
      expect(task.priority).toBe('high');
    });

    it('should throw if title is missing', () => {
      expect(() => service.createTask({})).toThrow('Title is required');
    });
  });

  describe('listTasks()', () => {
    beforeEach(() => {
      service.createTask({ title: 'Task 1', status: 'pending', priority: 'low' });
      service.createTask({ title: 'Task 2', status: 'done', priority: 'high' });
      service.createTask({ title: 'Task 3', status: 'pending', priority: 'high' });
    });

    it('should return all tasks', () => {
      expect(service.listTasks()).toHaveLength(3);
    });

    it('should filter by status', () => {
      const pending = service.listTasks({ status: 'pending' });
      expect(pending).toHaveLength(2);
      pending.forEach((t) => expect(t.status).toBe('pending'));
    });

    it('should filter by priority', () => {
      const high = service.listTasks({ priority: 'high' });
      expect(high).toHaveLength(2);
    });

    it('should return empty array when no tasks match filter', () => {
      expect(service.listTasks({ status: 'in_progress' })).toHaveLength(0);
    });
  });

  describe('getTask()', () => {
    it('should return task by id', () => {
      const created = service.createTask({ title: 'Find me' });
      const found = service.getTask(created.id);
      expect(found.id).toBe(created.id);
    });

    it('should throw 404 for unknown id', () => {
      expect(() => service.getTask('non-existent')).toThrow('Task not found');
    });

    it('should attach statusCode 404 to error', () => {
      try {
        service.getTask('nope');
      } catch (err) {
        expect(err.statusCode).toBe(404);
      }
    });
  });

  describe('updateTask()', () => {
    it('should update task fields', () => {
      const task = service.createTask({ title: 'Old title' });
      const updated = service.updateTask(task.id, { title: 'New title', status: 'done' });
      expect(updated.title).toBe('New title');
      expect(updated.status).toBe('done');
    });

    it('should throw 404 when updating non-existent task', () => {
      expect(() => service.updateTask('ghost', { title: 'X' })).toThrow('Task not found');
    });
  });

  describe('deleteTask()', () => {
    it('should delete existing task', () => {
      const task = service.createTask({ title: 'Delete me' });
      expect(service.deleteTask(task.id)).toBe(true);
      expect(() => service.getTask(task.id)).toThrow('Task not found');
    });

    it('should throw 404 when deleting non-existent task', () => {
      expect(() => service.deleteTask('ghost')).toThrow('Task not found');
    });
  });

  describe('getStats()', () => {
    it('should return correct stats', () => {
      service.createTask({ title: 'A', status: 'pending', priority: 'high' });
      service.createTask({ title: 'B', status: 'done', priority: 'high' });
      service.createTask({ title: 'C', status: 'in_progress', priority: 'low' });

      const stats = service.getStats();
      expect(stats.total).toBe(3);
      expect(stats.byStatus.pending).toBe(1);
      expect(stats.byStatus.done).toBe(1);
      expect(stats.byStatus.in_progress).toBe(1);
      expect(stats.byPriority.high).toBe(2);
      expect(stats.byPriority.low).toBe(1);
    });

    it('should return zeros when no tasks', () => {
      const stats = service.getStats();
      expect(stats.total).toBe(0);
      expect(stats.byStatus.pending).toBe(0);
    });
  });
});
