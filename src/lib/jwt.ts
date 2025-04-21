import {jwtVerify, SignJWT} from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export default class Jwt {
    static async verifyToken(token: string): Promise<{ id: number; username: string } | null> {
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            return payload as { id: number; username: string };
        } catch (error) {
            console.log(error);

            return null;
        }
    }

    static async getNewSignJwt(username: string, userId: string): Promise<string> {
        return await new SignJWT({
            username: username,
            id: userId,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h")
            .sign(JWT_SECRET);
    }
}

