const request = require('supertest');
const app = require('../app');

describe('Todo API', () => {
  it('should create a new todo', async () => {
    const res = await request(app)
      .post('/todos')
      .send({
        title: 'Test Todo'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Todo');
  });

  it('should get all todos', async () => {
    const res = await request(app).get('/todos');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get a single todo', async () => {
    const postRes = await request(app)
      .post('/todos')
      .send({ title: 'Single Todo' });
    
    const id = postRes.body.id;
    const res = await request(app).get(`/todos/${id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toBe('Single Todo');
  });

  it('should update a todo', async () => {
    const postRes = await request(app)
      .post('/todos')
      .send({ title: 'Old Title' });
    
    const id = postRes.body.id;
    const res = await request(app)
      .put(`/todos/${id}`)
      .send({ title: 'New Title', completed: true });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toBe('New Title');
    expect(res.body.completed).toBe(true);
  });

  it('should delete a todo', async () => {
    const postRes = await request(app)
      .post('/todos')
      .send({ title: 'Delete Me' });
    
    const id = postRes.body.id;
    const res = await request(app).delete(`/todos/${id}`);
    expect(res.statusCode).toEqual(204);

    const getRes = await request(app).get(`/todos/${id}`);
    expect(getRes.statusCode).toEqual(404);
  });

  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/todos')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors[0].msg).toBe('Title is required');
  });

  it('should return 400 if title is not a string', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ title: 123 });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors[0].msg).toBe('Title must be a string');
  });
});
