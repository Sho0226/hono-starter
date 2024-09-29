import { Jwt } from "hono/utils/jwt"

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret'

export const generateToken = (userId: number) => {
    return Jwt.sign({userId},SECRET_KEY,{expiresIn: '1h'})
};