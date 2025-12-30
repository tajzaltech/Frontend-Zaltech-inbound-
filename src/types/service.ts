export interface Service {
    id: string;
    name: string;
    description: string;
    active: boolean;
    createdAt: Date;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'OPERATOR';
}
