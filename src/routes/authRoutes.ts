import { Hono, Context } from 'hono';
import { register, login } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

// ユーザー情報の型定義
interface UserPayload {
  userId: number;
}

const authRoutes = new Hono();

// ユーザー登録とログインのルート
authRoutes.post('/register', register);
authRoutes.post('/login', login);

// 保護されたルートの例
authRoutes.get('/profile', authenticateToken, (c: Context) => {
  // 型アサーションを使用して user 情報に型を付与
  const user = c.get('user') as UserPayload;
  return c.json({ message: 'Profile data', user });
});

export default authRoutes;
