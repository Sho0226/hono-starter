import { Hono } from "hono";

const app = new Hono

app.get('/',(c) =>{
  return c.text('Hello 🔥')
})

app.get('/api', (c) =>{
  return  c.json({ message: 'Hello Hono!'})
})

app.get('/api/Hello/:name', (c) =>{
  const name = c.req.param('name')
  return c.text(`Hello, ${name}!`)
})

export default app;