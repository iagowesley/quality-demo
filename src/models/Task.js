const { v4: uuidv4 } = require('uuid');

const VALID_STATUSES = ['pending', 'in_progress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

class Task {
  constructor({ title, description = '', status = 'pending', priority = 'medium', dueDate = null }) {
    if (!title || title.trim() === '') {
      throw new Error('Title is required');
    }
    if (!VALID_STATUSES.includes(status)) {
      throw new Error(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
    if (!VALID_PRIORITIES.includes(priority)) {
      throw new Error(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }
    if (dueDate !== null && isNaN(Date.parse(dueDate))) {
      throw new Error('dueDate must be a valid ISO date string');
    }

    this.id = uuidv4();
    this.title = title.trim();
    this.description = description.trim();
    this.status = status;
    this.priority = priority;
    this.dueDate = dueDate;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  update({ title, description, status, priority, dueDate }) {
    if (title !== undefined) {
      if (title.trim() === '') throw new Error('Title cannot be empty');
      this.title = title.trim();
    }
    if (description !== undefined) this.description = description.trim();
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        throw new Error(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
      }
      this.status = status;
    }
    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority)) {
        throw new Error(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
      }
      this.priority = priority;
    }
    if (dueDate !== undefined) {
      if (dueDate !== null && isNaN(Date.parse(dueDate))) {
        throw new Error('dueDate must be a valid ISO date string');
      }
      this.dueDate = dueDate;
    }
    this.updatedAt = new Date().toISOString();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = { Task, VALID_STATUSES, VALID_PRIORITIES };
