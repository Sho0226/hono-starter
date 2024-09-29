import { loginUser, registerUser } from "../services/authService";
export const register = async (c) => {
    const { name, email, password } = await c.req.json();
    try {
        const user = await registerUser(name, email, password);
        return c.json(user, 201);
    }
    catch (error) {
        return c.json({ message: 'Registration failed' }, 400);
    }
};
export const login = async (c) => {
    const { email, password } = await c.req.json();
    try {
        const token = await loginUser(email, password);
        return c.json({ token }, 200);
    }
    catch (error) {
        return c.json({ message: 'Login failed' }, 401);
    }
};
