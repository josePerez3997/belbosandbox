export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
    phoneNumber: string;
    providerId: string;
    createdAt: string;
    lastLoginAt: string;
    customClaims?: Record<string, any>;
}