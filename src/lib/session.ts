import 'server-only'
import { SignJWT, jwtVerify, JWTPayload } from 'jose'

const ACCESS_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key';

const encodedAccessKey = new TextEncoder().encode(ACCESS_SECRET_KEY);

// Define specific interfaces for the payloads
interface AccessTokenPayload extends JWTPayload {
    userId: string;
}

// Functions for Access Tokens
export async function encryptAccessToken(payload: AccessTokenPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h') // Access token expires in 1 hour
        .sign(encodedAccessKey);
}

export async function decryptAccessToken(token: string | undefined = ''): Promise<AccessTokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, encodedAccessKey, {
            algorithms: ['HS256'],
        });
        return payload as AccessTokenPayload;
    } catch (error) {
        console.error('Failed to verify access token:', error);
        return null;
    }
}
