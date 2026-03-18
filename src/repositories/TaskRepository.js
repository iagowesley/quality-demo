/**
 * In-memory repository — em produção real seria substituído por um DB (Postgres, MongoDB, etc.)
 * A interface é a mesma, então os testes de serviço não precisam mudar.
 */
class TaskRepository {
  constructor() {
    this._store = new Map();
  }

  findAll({ status, priority } = {}) {
    let tasks = Array.from(this._store.values());
    if (status) tasks = tasks.filter((t) => t.status === status);
    if (priority) tasks = tasks.filter((t) => t.priority === priority);
    return tasks;
  }

  findById(id) {
    return this._store.get(id) || null;
  }

  save(task) {
    this._store.set(task.id, task);
    return task;
  }

  delete(id) {
    const exists = this._store.has(id);
    if (exists) this._store.delete(id);
    return exists;
  }

  clear() {
    this._store.clear();
  }

  count() {
    return this._store.size;
  }
}

module.exports = { TaskRepository };
