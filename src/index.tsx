import { Context, Hono, Next } from 'hono';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// ユーザー情報の型定義
interface UserPayload {
  userId: number;
}

// Honoの変数型を拡張
type Variables = {
  user: UserPayload;
};

const app = new Hono<{ Variables: Variables }>();
const prisma = new PrismaClient();
const SECRET_KEY = 'your_secret_key';

// ユーザー登録
app.post('/auth/register', async (c) => {
  const { name, email, password } = await c.req.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
  return c.json({ message: 'User registered', user }, 201);
});

// ログイン
app.post('/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return c.json({ message: 'Invalid email or password' }, 401);
  }

  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
  return c.json({ message: 'Login successful', token });
});

// JWT検証ミドルウェア
const authenticateToken = async (c: Context<{ Variables: Variables }>, next: Next) => {
  const token = c.req.header('Authorization')?.split(' ')[1];
  if (!token) return c.json({ message: 'Unauthorized' }, 401);

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as UserPayload;
    c.set('user', decoded);
    await next();
  } catch (error) {
    return c.json({ message: 'Forbidden' }, 403);
  }
};

// 既存のルート
app.get('/', (c) => {
  return c.text('Hello 🔥');
});

app.get('/api', (c) => {
  return c.json({ message: 'Hello Hono!' });
});

// グローバルミドルウェアとして認証を設定
app.use('/api/*', authenticateToken);

// 認証が必要なルート
app.get('/api/Hello/:name', (c) => {
  const name = c.req.param('name');
  const user = c.get('user');
  return c.text(`Hello, ${name}! User ID: ${user.userId}`);
});

// 保護されたルート
app.get('/api/protected', (c) => {
  const user = c.get('user');
  return c.json({ message: `Hello, user ${user.userId}!` });
});

export default app;