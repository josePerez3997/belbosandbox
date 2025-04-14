
export interface Account {
    id: string;
    link?: string;  
    institution?: string;
    name: string;
    type?: string;
    number?: string;
    balance?: {
        current: number;
        available?: number;
    };
    currency: string;
    category?: string;
    public?: boolean;
    created_at?: string;
    updated_at?: string;
}

export namespace BelvoAPI {
    export interface Account {
        id: string;
        link: string;
        institution: {
            id: string;
            name: string;
            type: string;
        };
        created_at: string;
        collected_at: string;
        category: string;
        type: string;
        name: string;
        number: string;
        balance: {
            current: number;
            available: number;
        };
        currency: string;
        public: boolean;
        meta?: Record<string, any>;
    }

    export interface PaginatedResponse<T> {
        count: number;
        next?: string;
        previous?: string;
        results: T[];
    }
}