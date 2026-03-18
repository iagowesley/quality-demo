const { Router } = require('express');

function createTaskRouter(taskController) {
  const router = Router();

  router.get('/tasks', (req, res) => taskController.list(req, res));
  router.get('/tasks/stats', (req, res) => taskController.stats(req, res));
  router.get('/tasks/:id', (req, res, next) => taskController.getOne(req, res, next));
  router.post('/tasks', (req, res, next) => taskController.create(req, res, next));
  router.put('/tasks/:id', (req, res, next) => taskController.update(req, res, next));
  router.delete('/tasks/:id', (req, res, next) => taskController.remove(req, res, next));

  return router;
}

module.exports = { createTaskRouter };
