import {email, z} from "zod";

const userSchema = z.object({
    name:z.string().trim().min(3),

    email:z.string().email(),

    password:z.string().min(6).max(20)
});

export default userSchema;