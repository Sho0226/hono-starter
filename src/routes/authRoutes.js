import { Hono } from 'hono';
import { register, login } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';
const authRoutes = new Hono();
// ユーザー登録とログインのルート
authRoutes.post('/register', register);
authRoutes.post('/login', login);
// 保護されたルートの例
authRoutes.get('/profile', authenticateToken, (c) => {
    // 型アサーションを使用して user 情報に型を付与
    const user = c.get('user');
    return c.json({ message: 'Profile data', user });
});
export default authRoutes;
