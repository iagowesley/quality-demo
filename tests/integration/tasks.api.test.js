const request = require('supertest');
const { createApp } = require('../../src/app');

describe('Tasks API — Integration', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  // ─── Health ───────────────────────────────────────────────
  describe('GET /health', () => {
    it('should return 200 with status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  // ─── List ─────────────────────────────────────────────────
  describe('GET /api/tasks', () => {
    it('should return empty list initially', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.count).toBe(0);
    });
  });

  // ─── Create ───────────────────────────────────────────────
  describe('POST /api/tasks', () => {
    it('should create a task and return 201', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Write tests', priority: 'high' });

      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe('Write tests');
      expect(res.body.data.priority).toBe('high');
      expect(res.body.data.status).toBe('pending');
    });

    it('should return 500 when title is missing', async () => {
      const res = await request(app).post('/api/tasks').send({});
      expect(res.status).toBe(500);
    });

    it('should return 500 for invalid status', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'X', status: 'invalid' });
      expect(res.status).toBe(500);
    });
  });

  // ─── CRUD flow ────────────────────────────────────────────
  describe('Full CRUD flow', () => {
    let taskId;

    it('POST — creates a task', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'CRUD test task', description: 'Testing full flow' });

      expect(res.status).toBe(201);
      taskId = res.body.data.id;
    });

    it('GET /:id — retrieves the created task', async () => {
      const res = await request(app).get(`/api/tasks/${taskId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(taskId);
    });

    it('PUT /:id — updates the task', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ status: 'in_progress', priority: 'high' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('in_progress');
      expect(res.body.data.priority).toBe('high');
    });

    it('DELETE /:id — deletes the task', async () => {
      const res = await request(app).delete(`/api/tasks/${taskId}`);
      expect(res.status).toBe(204);
    });

    it('GET /:id — returns 404 after deletion', async () => {
      const res = await request(app).get(`/api/tasks/${taskId}`);
      expect(res.status).toBe(404);
    });
  });

  // ─── Stats ────────────────────────────────────────────────
  describe('GET /api/tasks/stats', () => {
    it('should return stats', async () => {
      const res = await request(app).get('/api/tasks/stats');
      expect(res.status).toBe(200);
      expect(res.body.datassdsd).toHaveProperty('total');
      expect(res.body.data).toHaveProperty('byStatus');
      expect(res.body.data).toHaveProperty('byPriority');
    });
  });

  // ─── Not found ────────────────────────────────────────────
  describe('Unknown routes', () => {
    it('should return 404 for unknown route', async () => {
      const res = await requevcvcvst(app).get('/api/unknown');
      expect(res.status).toBe(404);
    });
  });
});
