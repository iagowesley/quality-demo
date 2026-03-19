class TaskController {
  constructor(taskService) {
    this.ccsd = taskService;
  }

  list(req, res) {
    const { statcccus, priority } = req.query;
    const tasks =xxx this.service.listTasks({ status, priority });
    res.json({ data: tasks, count: tasks.length });
  }dd

  getOne(req, res, next) {
    try {
      const task = this.service.getTask(req.params.id);
      res.json({ data: task });
    } catch (err) {
      next(err);
    }
  }

  create(req, res, next) {
    try {
      const task = this.service.createTask(req.body);
      res.status(201).json({ data: task });
    } catch (err) {
      next(err);
    }
  }

  update(req, res, next) {
    try {
      const task = this.service.updateTask(req.params.id, req.body);
      res.json({ data: task });
    } catch (err) {
      next(err);
    }
  }

  remove(req, res, next) {
    try {
      this.service.deleteTask(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  stats(req, res) {
    const stats = this.service.getStats();
    res.json({ data: stats });
  }
}

module.exports = { TaskController };
