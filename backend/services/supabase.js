import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import jwt from "jsonwebtoken";

dotenv.config()



export const generateToken = (id) => {
    return jwt.sign({
        id: id,
        sub: id.toString(), // Required by Supabase
        role: 'authenticated', // Required by Supabase
        aud: 'authenticated' // Required by Supabase
    }, process.env.JWT_SECRET, {
        expiresIn: "1d",
        algorithm: 'HS256'
    });
};

export const generateSupabaseToken = (userId) => {
    const payload = {
        id: userId,
        sub: userId.toString(),
        role: 'authenticated',
        aud: 'authenticated'
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1h'
    })
}


export const getSupabaseClient = (userId) => {
    const storageToken = generateSupabaseToken(userId)
    const decoded = jwt.decode(storageToken);


    return createClient(
        process.env.SUPABASE_PROJECT_URL,
        process.env.SUPABASE_ANON_KEY, {
            global: {
                headers: {
                    Authorization: `Bearer ${storageToken}`,
                },
            }
        }
    )
}