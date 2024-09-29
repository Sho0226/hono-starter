import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwt";
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
export const registerUser = async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
        data: { name, email, password: hashedPassword }
    });
};
export const loginUser = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }
    return generateToken(user.id);
};
