import { loginUser, registerUser } from "../services/authService";

export const register = async (req: Request, res: Response) => {
    const {name, email, password} = req.body;
    try {
        const user = await registerUser(name, email, password);
        res.status(201).json(user);
    }catch (error){
        res.status(400).json({message: 'Registration failed'})
    }
};

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;
    try{
        const token = await loginUser(email,password);
        res.status(200).json({token})
    }catch(error){
        res.status(401).json({message:'Login failed'})
    }
};