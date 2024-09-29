import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret';
export const authenticateToken = async (c, next) => {
    const token = c.req.header('Authorization')?.split(' ')[1];
    if (!token)
        return c.text('Unauthorized', 401);
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        c.set('user', decoded);
        await next();
    }
    catch (error) {
        return c.text('Forbidden', 403);
    }
};
