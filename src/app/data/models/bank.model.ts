
export interface Bank {
    id: string;
    name: string;
    country: string;
    type?: string;
    logo?: string;
}

export namespace BelvoAPI {
    export interface Institution {
        id: string;
        name: string;
        type: string;
        website?: string;
        country_codes?: string[];
        primary_color?: string;
        logo?: string;
        icon_logo?: string;
        text_logo?: string;
        form_fields?: {
            username?: {
                label: string;
                validation: string;
                placeholder: string;
            };
            password?: {
                label: string;
                validation: string;
                placeholder: string;
            };
        };
        features?: string[];
        integration_type?: string;
        status?: string;
    }

    export interface PaginatedResponse<T> {
        count: number;
        next?: string;
        previous?: string;
        results: T[];
    }
}