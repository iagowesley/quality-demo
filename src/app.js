const express = require('express');
const { TaskRepository } = require('./repositories/TaskRepository');
const { TaskService } = require('./services/TaskService');
const { TaskController } = require('./controllers/TaskController');
const { createTaskRouter } = require('./routes/taskRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

function createApp() {
  const app = express();

  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Dependency injection
  const taskRepository = new TaskRepository();
  const taskService = new TaskService(taskRepository);
  const taskController = new TaskController(taskService);

  app.use('/api', createTaskRouter(taskController));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
