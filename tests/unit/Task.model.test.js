const { Task, VALID_STATUSES, VALID_PRIORITIES } = require('../../src/models/Task');

describe('Task Model', () => {
  describe('constructor', () => {
    it('should create a task with required fields', () => {
      const task = new Task({ title: 'Buy groceries' });

      expect(task.id).toBeDefined();
      expect(task.title).toBe('Buy groceries');
      expect(task.description).toBe('');
      expect(task.status).toBe('pending');
      expect(task.priority).toBe('medium');
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    it('should trim title and description whitespace', () => {
      const task = new Task({ title: '  Fix bug  ', description: '  important  ' });
      expect(task.title).toBe('Fix bug');
      expect(task.description).toBe('important');
    });

    it('should throw if title is missing', () => {
      expect(() => new Task({})).toThrow('Title is required');
    });

    it('should throw if title is empty string', () => {
      expect(() => new Task({ title: '   ' })).toThrow('Title is required');
    });

    it('should throw for invalid status', () => {
      expect(() => new Task({ title: 'X', status: 'invalid' })).toThrow(
        `Status must be one of: ${VALID_STATUSES.join(', ')}`
      );
    });

    it('should throw for invalid priority', () => {
      expect(() => new Task({ title: 'X', priority: 'urgent' })).toThrow(
        `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`
      );
    });

    it('should accept all valid statuses', () => {
      VALID_STATUSES.forEach((status) => {
        const task = new Task({ title: 'Task', status });
        expect(task.status).toBe(status);
      });
    });

    it('should accept all valid priorities', () => {
      VALID_PRIORITIES.forEach((priority) => {
        const task = new Task({ title: 'Task', priority });
        expect(task.priority).toBe(priority);
      });
    });

    it('should accept a valid dueDate', () => {
      const task = new Task({ title: 'Task', dueDate: '2026-12-31T00:00:00.000Z' });
      expect(task.dueDate).toBe('2026-12-31T00:00:00.000Z');
    });

    it('should default dueDate to null', () => {
      const task = new Task({ title: 'Task' });
      expect(task.dueDate).toBeNull();
    });

    it('should throw for invalid dueDate', () => {
      expect(() => new Task({ title: 'Task', dueDate: 'not-a-date' })).toThrow(
        'dueDate must be a valid ISO date string'
      );
    });
  });

  describe('update()', () => {
    let task;

    beforeEach(() => {
      task = new Task({ title: 'Original', status: 'pending', priority: 'low' });
    });

    it('should update title', () => {
      task.update({ title: 'Updated' });
      expect(task.title).toBe('Updated');
    });

    it('should update status', () => {
      task.update({ status: 'done' });
      expect(task.status).toBe('done');
    });

    it('should update updatedAt timestamp', () => {
      const before = task.updatedAt;
      // Avança o relógio 1s para garantir timestamp diferente
      jest.useFakeTimers();
      jest.setSystemTime(new Date(Date.now() + 1000));
      task.update({ title: 'New' });
      jest.useRealTimers();
      expect(task.updatedAt).not.toBe(before);
    });

    it('should throw if title updated to empty string', () => {
      expect(() => task.update({ title: '' })).toThrow('Title cannot be empty');
    });

    it('should throw if updated status is invalid', () => {
      expect(() => task.update({ status: 'invalid' })).toThrow(/Status must be one of/);
    });

    it('should only update provided fields', () => {
      task.update({ title: 'New title' });
      expect(task.status).toBe('pending');
      expect(task.priority).toBe('low');
    });

    it('should update dueDate', () => {
      task.update({ dueDate: '2026-06-01T00:00:00.000Z' });
      expect(task.dueDate).toBe('2026-06-01T00:00:00.000Z');
    });

    it('should throw for invalid dueDate on update', () => {
      expect(() => task.update({ dueDate: 'invalid' })).toThrow(
        'dueDate must be a valid ISO date string'
      );
    });
  });

  describe('toJSON()', () => {
    it('should return a plain object with all fields', () => {
      const task = new Task({ title: 'Test', description: 'Desc', status: 'done', priority: 'high' });
      const json = task.toJSON();

      expect(json).toEqual({
        id: task.id,
        title: 'Test',
        description: 'Desc',
        status: 'done',
        priority: 'high',
        dueDate: null,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      });
    });
  });
});
